import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, Polyline } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Vehicle Icon (Red Car or Arrow)
const vehicleIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3202/3202926.png', // Car icon
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

// Sighting Warning Icon
const sightingIcon = new L.DivIcon({
  className: 'sighting-marker',
  html: '<div class="w-8 h-8 bg-red-600 rounded-full border-2 border-white shadow-[0_0_20px_rgba(239,68,68,1)] flex items-center justify-center text-white font-bold animate-pulse">!</div>',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Component to keep map centered on user
function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

// --- STATIC HIGH-RISK CORRIDORS ---
// We define these on the frontend so alarms work even if the phone loses internet connection in the jungle!
const STATIC_ZONES = [
  { id: 'z1', name: "Buttala–Kataragama Road (B35)", lat: 6.5500, lng: 81.3000, radius: 10000 },
  { id: 'z2', name: "Habarana–Minneriya–Kaudulla", lat: 8.0360, lng: 80.8350, radius: 8000 },
  { id: 'z3', name: "Yala National Park Vicinity", lat: 6.3750, lng: 81.5200, radius: 12000 },
  { id: 'z4', name: "Trincomalee Road (via Habarana)", lat: 8.1500, lng: 80.9500, radius: 6000 },
  { id: 'z5', name: "Udawalawe & Lunugamwehera", lat: 6.4670, lng: 80.9500, radius: 9000 },
  { id: 'z6', name: "Ampara HEC Hotspot", lat: 7.2800, lng: 81.6700, radius: 10000 },
];

const DriveMode = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const API_URL = import.meta.env.VITE_API_URL || 'https://wildroute-pwa.onrender.com';

  // State for real-time data
  const [userLocation, setUserLocation] = useState(null); // { lat, lng }
  const [speed, setSpeed] = useState(0);
  const [heading, setHeading] = useState(0);
  const [gpsError, setGpsError] = useState(null);

  const [dangerAlerts, setDangerAlerts] = useState([]);
  const [sightings, setSightings] = useState([]); // Real sightings for map rendering

  const watchId = useRef(null);

  // --- 1. NEW REFS FOR AUDIO AND WAKE LOCK ---
  const alarmAudio = useRef(null);
  const wakeLock = useRef(null);

  // --- 2. SETUP AUDIO & WAKE LOCK ON MOUNT ---
  useEffect(() => {
    // Initialize the audio object and set it to loop
    alarmAudio.current = new Audio('/alarm.mp3');
    alarmAudio.current.loop = true;

    // Request Wake Lock to prevent the screen from turning off while driving
    const requestWakeLock = async () => {
      if ('wakeLock' in navigator) {
        try {
          wakeLock.current = await navigator.wakeLock.request('screen');
          console.log('Screen Wake Lock active');
        } catch (err) {
          console.error("Wake Lock failed:", err);
        }
      }
    };
    requestWakeLock();

    // Cleanup when leaving Drive Mode
    return () => {
      if (alarmAudio.current) {
        alarmAudio.current.pause();
        alarmAudio.current.currentTime = 0;
      }
      if (wakeLock.current) {
        wakeLock.current.release();
      }
    };
  }, []);

  // Fetch all active sightings for the map display
  useEffect(() => {
    const fetchSightings = async () => {
      try {
        const response = await fetch(`${API_URL}/api/sightings`);
        const data = await response.json();
        if (response.ok) {
          setSightings(data);
        }
      } catch (error) {
        console.error("Failed to fetch sightings for Drive Mode:", error);
      }
    };
    fetchSightings();
  }, []);

  useEffect(() => {
    // Ask the user for permission to send Push Notifications
    if ('Notification' in window) {
      Notification.requestPermission();
    }

    // This function runs every time the phone's GPS location changes
    const handlePositionChange = async (position) => {
      const { latitude, longitude, speed: gpsSpeed, heading: gpsHeading } = position.coords;

      setUserLocation({ lat: latitude, lng: longitude });
      setSpeed(gpsSpeed ? (gpsSpeed * 3.6).toFixed(1) : 0);
      setHeading(gpsHeading || 0);
      setGpsError(null);

      try {
        // 1. Fetch DYNAMIC live alerts from the backend
        const res = await axios.get(`${API_URL}/api/sightings/nearby?lng=${longitude}&lat=${latitude}`);
        const dynamicAlerts = res.data;

        // 2. Calculate STATIC corridor alerts directly on the phone (Offline-proof!)
        const userLatLng = L.latLng(latitude, longitude);
        const triggeredStaticZones = STATIC_ZONES.filter(zone => {
          return userLatLng.distanceTo(L.latLng(zone.lat, zone.lng)) <= zone.radius;
        });

        // 3. Combine both threats
        const totalThreats = [...dynamicAlerts, ...triggeredStaticZones];

        if (totalThreats.length > 0) {
          setDangerAlerts(totalThreats); // Trigger the red UI warning

          // --- PLAY THE ALARM ---
          if (alarmAudio.current && alarmAudio.current.paused) {
            alarmAudio.current.play().catch(e => console.log("Audio blocked:", e));
          }

          // Trigger System Push Notification
          if (Notification.permission === 'granted') {
            const warningMessage = dynamicAlerts.length > 0
              ? `WARNING: You are within 2km of a LIVE elephant sighting!`
              : `CAUTION: You have entered a high-risk historical elephant corridor.`;

            new Notification("CRITICAL ALERT: WildRoute", {
              body: warningMessage,
              icon: "/pwa-192x192.png",
              vibrate: [200, 100, 200, 100, 200]
            });
          }
        } else {
          setDangerAlerts([]); // Clear UI warnings

          // --- STOP THE ALARM WHEN SAFE ---
          if (alarmAudio.current && !alarmAudio.current.paused) {
            alarmAudio.current.pause();
            alarmAudio.current.currentTime = 0;
          }
        }
      } catch (error) {
        console.error("Failed to calculate nearby risks", error);
      }
    };

    const error = (err) => {
      console.error("GPS Error: ", err);
      if (err.code === 1) setGpsError("GPS denied.");
      else if (err.code === 2) setGpsError("GPS unavailable.");
      else if (err.code === 3) setGpsError("GPS timeout.");
    };

    // Start tracking the user's live location
    if ('geolocation' in navigator) {
      watchId.current = navigator.geolocation.watchPosition(
        handlePositionChange,
        error,
        {
          enableHighAccuracy: true, // Forces the phone to use GPS hardware, not just Wi-Fi
          maximumAge: 10000,
          timeout: 5000
        }
      );
    } else {
      setGpsError('Geolocation is not supported');
    }

    // Cleanup: Stop tracking when they close the Drive Mode page
    return () => {
      if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
    };
  }, []);

  return (
    <div className="h-screen w-full bg-[#0e191b] text-white flex flex-col p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-4 z-[1000]">
        <h1 className="text-2xl font-bold">Drive Mode</h1>

        {/* Close Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-white/10 text-white p-3 rounded-full hover:bg-white/20 shadow-lg backdrop-blur-sm pointer-events-auto transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Alert Banners */}
      <div className="mb-4 z-[1000] shrink-0">
        {dangerAlerts.length > 0 ? (
          <div className="bg-red-600/20 border-2 border-red-500 rounded-xl p-6 animate-pulse shadow-[0_0_30px_rgba(220,38,38,0.5)]">
            <div className="flex items-center gap-4 mb-2">
              <span className="material-symbols-outlined text-red-500 text-4xl">warning</span>
              <h2 className="text-red-500 font-black text-xl uppercase tracking-widest">Danger Zone</h2>
            </div>
            <p className="font-bold">You are within 2km of {dangerAlerts.length} active elephant sighting(s).</p>
          </div>
        ) : (
          <div className="bg-[#0bda54]/10 border border-[#0bda54]/50 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-2">
              <span className="material-symbols-outlined text-[#0bda54] text-4xl">check_circle</span>
              <h2 className="text-[#0bda54] font-black text-xl uppercase tracking-widest">Path Clear</h2>
            </div>
            <p className="opacity-80">No active sightings within a 2km radius.</p>
          </div>
        )}
      </div>

      {/* Map Content */}
      <div className="flex-1 w-full relative rounded-2xl overflow-hidden border-2 border-white/5 shadow-2xl">
        {userLocation ? (
          <MapContainer
            center={[userLocation.lat, userLocation.lng]}
            zoom={16}
            className="w-full h-full"
            zoomControl={false}
          >
            {/* Switch Map Tiles based on Theme */}
            <TileLayer
              url={theme === 'dark'
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
              attribution='&copy; OpenStreetMap &copy; CARTO'
            />

            <RecenterMap lat={userLocation.lat} lng={userLocation.lng} />

            <Marker position={[userLocation.lat, userLocation.lng]} icon={vehicleIcon}>
              <Popup>You</Popup>
            </Marker>

            {/* Render Static Historical Corridors */}
            {STATIC_ZONES.map(zone => (
              <Circle
                key={zone.id}
                center={[zone.lat, zone.lng]}
                radius={zone.radius}
                pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.1, weight: 2, dashArray: '5, 5' }}
              />
            ))}

            {/* Render Live Sightings */}
            {sightings.map(sighting => {
              if (!sighting.location || !sighting.location.coordinates) return null;
              const [lng, lat] = sighting.location.coordinates;
              return (
                <React.Fragment key={sighting._id}>
                  <Marker position={[lat, lng]} icon={sightingIcon}>
                    <Popup>
                      <div className="text-black">
                        <strong>{sighting.description}</strong>
                      </div>
                    </Popup>
                  </Marker>
                  <Circle
                    center={[lat, lng]}
                    radius={2000} // Matches the 2km alarm radius
                    pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.3, weight: 0 }}
                  />
                </React.Fragment>
              )
            })}
          </MapContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-white bg-black/40 backdrop-blur-sm transition-colors">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto mb-4"></div>
              <p>{gpsError || "Connecting to Satellites..."}</p>
            </div>
          </div>
        )}

        {/* Speedometer Overlay Inside Map */}
        <div className="absolute bottom-4 left-4 z-[1000] pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md text-white p-4 rounded-2xl border border-white/10 shadow-2xl transition-colors">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-mono font-bold text-green-400">{speed}</span>
              <span className="text-sm font-semibold text-gray-400">km/h</span>
            </div>
            <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Speed</div>
          </div>
        </div>

        {/* Report Sighting Button */}
        <div className="absolute bottom-4 right-4 z-[1000]">
          <button
            onClick={() => navigate('/report')}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black py-4 px-6 rounded-2xl shadow-[0_10px_30px_rgba(220,38,38,0.5)] transform transition active:scale-95 border border-red-400/50"
          >
            <span className="material-symbols-outlined font-black text-xl">emergency</span>
            <span className="tracking-widest uppercase text-sm">Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriveMode;
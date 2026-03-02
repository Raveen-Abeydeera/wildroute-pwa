import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { useTheme } from '../context/ThemeContext';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet Icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom User Icon - Neon Style
const userIcon = new L.DivIcon({
  className: 'user-location-marker',
  html: '<div class="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-[0_0_15px_rgba(34,197,94,0.8)] pulse-ring"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// Custom Sighting Icon - Dynamic based on verification status
const getSightingIcon = (status) => {
  const isVerified = status === 'verified';
  return new L.DivIcon({
    className: 'sighting-marker',
    html: `<div class="w-6 h-6 ${isVerified ? 'bg-red-600' : 'bg-orange-500'} rounded-full border-2 border-white shadow-[0_0_15px_${isVerified ? 'rgba(239,68,68,0.8)' : 'rgba(249,115,22,0.8)'}] flex items-center justify-center text-white text-[10px] font-bold">!</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { theme } = useTheme(); // Get current theme
  const API_URL = import.meta.env.VITE_API_URL || 'https://wildroute-pwa.onrender.com';
  const [userName, setUserName] = useState('User');
  const [profileImg, setProfileImg] = useState(null); // Add this state at the top
  const [userLocation, setUserLocation] = useState(null);
  const [sightings, setSightings] = useState([]); // State for live sightings

  // Mock Risk Zones (Static Corridors)
  const [riskZones] = useState([
    { id: 1, name: "Elephant Corridor A", lat: 7.957, lng: 80.760, radius: 1000 },
    { id: 2, name: "Water Hole Activity", lat: 7.965, lng: 80.765, radius: 800 }
  ]);

  useEffect(() => {
    // FIX: Look for 'user', not 'userInfo'
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      // Get the first name
      const name = storedUser.fullName || storedUser.name || 'User';
      setUserName(name.split(' ')[0]);
      // Set the profile image
      if (storedUser.profileImage) {
        setProfileImg(storedUser.profileImage);
      }
    }

    // Fetch Live Sightings from Backend
    const fetchSightings = async () => {
      try {
        // CORRECTED: Endpoint is /api/sightings
        const response = await fetch(`${API_URL}/api/sightings`);
        const data = await response.json();
        if (response.ok) {
          setSightings(data);
        }
      } catch (error) {
        console.error("Failed to fetch sightings:", error);
      }
    };
    fetchSightings();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.error(error),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  return (
    <div className="min-h-screen pb-24 transition-colors duration-300 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Top Bar */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-green-500/20 p-6 rounded-b-3xl shadow-lg dark:shadow-[0_10px_30px_-10px_rgba(34,197,94,0.2)] relative z-10 transition-colors duration-300">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-green-600 dark:text-green-400 text-sm font-medium tracking-wide">SYSTEM ONLINE</p>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
              Welcome, <span className="text-green-600 dark:text-green-400 dark:drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">{userName}</span>
            </h1>
          </div>
          <div onClick={() => navigate('/profile')} className="w-10 h-10 bg-gray-100 dark:bg-gray-700/50 rounded-full cursor-pointer border border-gray-200 dark:border-green-500/30 hover:bg-green-100 dark:hover:bg-green-500/20 hover:border-green-400 transition shadow-sm dark:shadow-[0_0_10px_rgba(34,197,94,0.1)] overflow-hidden flex items-center justify-center">
            {profileImg ? (
              <img src={profileImg} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </div>
        </div>

        {/* Weather/Status Widget */}
        <div className="bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-green-500/20 rounded-xl p-3 flex items-center justify-between backdrop-blur-md shadow-inner">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <span className="text-xl">🌤️</span>
            <span className="text-sm font-medium">Clear Skies</span>
          </div>
          <span className="text-xs bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/30 px-2 py-1 rounded shadow-sm dark:shadow-[0_0_10px_rgba(34,197,94,0.1)]">Safe Activity</span>
        </div>
      </div>

      <div className="p-4 -mt-6 relative z-20 space-y-4">

        {/* Live Map Widget */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] overflow-hidden h-48 border border-gray-100 dark:border-green-500/20 relative group transition-colors duration-300">
          {userLocation ? (
            <MapContainer
              center={[userLocation.lat, userLocation.lng]}
              zoom={14}
              className="w-full h-full z-0"
              zoomControl={false}
              scrollWheelZoom={false}
              dragging={false}
              doubleClickZoom={false}
            >
              {/* Dynamic Tile Layer based on Theme */}
              <TileLayer
                url={theme === 'dark'
                  ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
                attribution='&copy; OpenStreetMap'
              />
              <RecenterMap lat={userLocation.lat} lng={userLocation.lng} />

              {/* User Marker */}
              <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon} />

              {/* Static Risk Zones */}
              {riskZones.map(zone => (
                <Circle key={`zone-${zone.id}`} center={[zone.lat, zone.lng]} radius={zone.radius} pathOptions={{ color: '#f97316', fillColor: '#f97316', fillOpacity: 0.1, weight: 1, dashArray: '5, 5' }} />
              ))}

              {/* Live Sighting Markers & Areas */}
              {sightings.map(sighting => {
                if (!sighting.location || !sighting.location.coordinates) return null;
                const [lng, lat] = sighting.location.coordinates;
                const isVerified = sighting.status === 'verified';

                return (
                  <React.Fragment key={sighting._id}>
                    <Marker position={[lat, lng]} icon={getSightingIcon(sighting.status)}>
                      <Popup className="custom-popup">
                        <div className="text-black flex flex-col gap-2 min-w-[160px] pb-1">
                          <strong className="text-sm">{sighting.description || "Reported Sighting"}</strong>

                          {/* THE DYNAMIC BADGE */}
                          {isVerified ? (
                            <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded border border-green-300 w-max">
                              ✓ Verified by Ranger
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded border border-orange-300 w-max">
                              ⚠ Unverified Report
                            </span>
                          )}

                          {/* NEW: View Details Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevents map from zooming when clicking the button
                              navigate(`/sighting/${sighting._id}`);
                            }}
                            className="mt-1 w-full bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 rounded-lg shadow-md transition-transform active:scale-95 flex items-center justify-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[14px]">visibility</span>
                            View Details
                          </button>
                        </div>
                      </Popup>
                    </Marker>

                    {/* Danger Circle - Red for Verified, Orange for Unverified */}
                    <Circle
                      center={[lat, lng]}
                      radius={2000} // Matches the 2km alarm radius
                      pathOptions={{
                        color: isVerified ? '#ef4444' : '#f97316',
                        fillColor: isVerified ? '#ef4444' : '#f97316',
                        fillOpacity: 0.3,
                        weight: 0
                      }}
                    />
                  </React.Fragment>
                );
              })}
            </MapContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-500 text-sm">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mb-2"></div>
                <span className="text-gray-400 dark:text-green-500/70">Initializing Satellite...</span>
              </div>
            </div>
          )}

          {/* Expand Map Overlay Button */}
          <div className="absolute inset-0 bg-black/10 dark:bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-[400] pointer-events-none backdrop-blur-sm">
            <span className="bg-white dark:bg-green-500 text-gray-800 dark:text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg dark:shadow-[0_0_15px_rgba(34,197,94,0.6)]">
              ENGAGE DRIVE MODE
            </span>
          </div>
          <button
            onClick={() => navigate('/drive')}
            className="absolute bottom-2 right-2 z-[400] bg-white dark:bg-gray-900/90 text-green-700 dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full shadow border border-green-100 dark:border-green-500/50 flex items-center gap-1 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <span>Expand Map</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
          </button>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/report')}
            className="bg-white dark:bg-gray-800/60 p-4 rounded-2xl shadow-sm dark:shadow-lg border border-gray-100 dark:border-gray-700 hover:border-red-500/50 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95 transition group"
          >
            <div className="w-12 h-12 bg-red-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center text-red-600 dark:text-red-500 text-2xl shadow-inner group-hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all">
              📢
            </div>
            <span className="font-bold text-gray-700 dark:text-gray-300 group-hover:text-red-500 dark:group-hover:text-red-400">Report</span>
          </button>

          <button
            onClick={() => navigate('/drive')}
            className="bg-white dark:bg-gray-800/60 p-4 rounded-2xl shadow-sm dark:shadow-lg border border-gray-100 dark:border-gray-700 hover:border-green-500/50 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95 transition group"
          >
            <div className="w-12 h-12 bg-green-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center text-green-600 dark:text-green-500 text-2xl shadow-inner group-hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] transition-all">
              🚘
            </div>
            <span className="font-bold text-gray-700 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400">Drive Mode</span>
          </button>

          <button
            onClick={() => navigate('/alerts')}
            className="bg-white dark:bg-gray-800/60 p-4 rounded-2xl shadow-sm dark:shadow-lg border border-gray-100 dark:border-gray-700 hover:border-orange-500/50 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95 transition group"
          >
            <div className="w-12 h-12 bg-orange-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-500 text-2xl shadow-inner group-hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-all">
              🔔
            </div>
            <span className="font-bold text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400">Alerts</span>
          </button>

          <button
            onClick={() => navigate('/saved')}
            className="bg-white dark:bg-gray-800/60 p-4 rounded-2xl shadow-sm dark:shadow-lg border border-gray-100 dark:border-gray-700 hover:border-purple-500/50 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95 transition group"
          >
            <div className="w-12 h-12 bg-purple-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-500 text-2xl shadow-inner group-hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all">
              🔖
            </div>
            <span className="font-bold text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400">Saved</span>
          </button>
        </div>

        {/* Recent Activity List */}
        <div className="bg-white dark:bg-gray-800/60 rounded-2xl shadow-sm dark:shadow-lg border border-gray-100 dark:border-gray-700 p-4 backdrop-blur-sm transition-colors duration-300">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-800 dark:text-gray-200">Live Feed</h3>
            <span className="text-xs text-green-600 dark:text-green-400 font-semibold cursor-pointer hover:underline">View All</span>
          </div>
          <div className="space-y-3">
            {sightings.length > 0 ? (
              sightings.slice(0, 3).map((sighting, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
                  <div className="w-2 h-2 rounded-full bg-red-500 shadow-sm dark:shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{sighting.description || "Elephant Sighting"}</p>
                    <p className="text-xs text-gray-500">Live • Just now</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-3 p-2">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm dark:shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">No recent threats</p>
                  <p className="text-xs text-gray-500">Area is clear</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 border-t border-gray-200 dark:border-gray-800 px-8 py-3 flex justify-between items-center z-50 pb-safe backdrop-blur-lg transition-colors duration-300">
        <button className="flex flex-col items-center text-green-600 dark:text-green-400 dark:drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
          <span className="text-[10px] font-bold mt-1">Home</span>
        </button>

        {/* Big Middle Button */}
        <div className="relative -top-6">
          <button onClick={() => navigate('/drive')} className="bg-green-600 text-white p-4 rounded-full shadow-lg dark:shadow-[0_0_20px_rgba(34,197,94,0.4)] border-4 border-gray-100 dark:border-gray-800 hover:bg-green-700 dark:hover:bg-green-500 hover:scale-105 transition dark:hover:shadow-[0_0_30px_rgba(34,197,94,0.6)]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </button>
        </div>

        <button onClick={() => navigate('/settings')} className="flex flex-col items-center text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <span className="text-[10px] font-bold mt-1">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
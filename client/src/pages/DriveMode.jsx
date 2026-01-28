import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useTheme } from '../context/ThemeContext';

// --- FIXED: BOOTSTRAP ICONS FOR MAP ---

// 1. CAR ICON (Green Car)
const carIcon = new L.DivIcon({
  html: `<i class="bi bi-car-front-fill" style="font-size: 2rem; color: #19e66f; filter: drop-shadow(0 0 5px rgba(0,0,0,0.5));"></i>`,
  className: '', // Removes default white square
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

// 2. HAZARD ICON (Red Warning Triangle)
const elephantIcon = new L.DivIcon({
  html: `<i class="bi bi-exclamation-triangle-fill" style="font-size: 2rem; color: #E04040; filter: drop-shadow(0 0 5px rgba(0,0,0,0.5));"></i>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

function NavigationController({ center }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 18, { animate: true, duration: 1.5 });
  }, [center, map]);
  return null;
}

export default function DriveMode() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [showDangerAlert, setShowDangerAlert] = useState(false);
  const [speed, setSpeed] = useState(45);
  const [distanceToHazard, setDistanceToHazard] = useState(2.0);

  const startPos = { lat: 7.8731, lng: 80.7718 };
  const hazardPos = { lat: 7.8750, lng: 80.7718 };

  const [currentPos, setCurrentPos] = useState(startPos);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 1) return 1;
        return prev + 0.002;
      });
      setSpeed(45 + Math.floor(Math.random() * 5));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const newLat = startPos.lat + (hazardPos.lat - startPos.lat) * progress;
    const newLng = startPos.lng + (hazardPos.lng - startPos.lng) * progress;
    setCurrentPos({ lat: newLat, lng: newLng });

    const remaining = (1.0 - progress) * 2;
    setDistanceToHazard(remaining.toFixed(2));

    if (remaining <= 0.2 && !showDangerAlert && remaining > 0) {
      setShowDangerAlert(true);
    }
  }, [progress]);

  return (
    <div className="relative h-screen w-full flex flex-col bg-gray-100 dark:bg-[#101318] text-gray-900 dark:text-white overflow-hidden transition-colors duration-300">

      {/* MAP LAYER */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={[currentPos.lat, currentPos.lng]}
          zoom={18}
          zoomControl={false}
          dragging={false}
          scrollWheelZoom={false}
          style={{ height: '100vh', width: '100vw' }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url={theme === 'dark'
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            }
          />
          <NavigationController center={[currentPos.lat, currentPos.lng]} />

          <Marker position={[currentPos.lat, currentPos.lng]} icon={carIcon} />
          <Marker position={[hazardPos.lat, hazardPos.lng]} icon={elephantIcon} />
        </MapContainer>
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/90 dark:from-[#101318]/90 dark:via-transparent dark:to-[#101318]/90 pointer-events-none"></div>
      </div>

      {/* HEADER */}
      <div className="relative z-10 p-4">
        <div className="flex items-center justify-between backdrop-blur-md bg-white/80 dark:bg-black/60 rounded-xl px-4 py-3 border border-gray-200 dark:border-white/10 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-[#19e66f] rounded-full animate-pulse"></div>
            <p className="text-gray-700 dark:text-white text-sm font-medium">Live Tracking</p>
          </div>
          <span className="text-[10px] font-bold text-[#19e66f] flex items-center gap-1">
            <i className="bi bi-broadcast"></i> GPS ACTIVE
          </span>
        </div>
      </div>

      {/* TELEMETRY */}
      <div className="relative z-10 flex justify-between px-4 mt-2">
        <div className="flex flex-col items-start backdrop-blur-md bg-white/80 dark:bg-black/60 p-4 rounded-xl shadow-lg">
          <p className="text-gray-500 dark:text-white/60 text-[10px] font-bold uppercase">Speed</p>
          <span className="text-3xl font-extrabold">{speed} <span className="text-sm">km/h</span></span>
        </div>
        <div className="flex flex-col items-end backdrop-blur-md bg-white/80 dark:bg-black/60 p-4 rounded-xl shadow-lg">
          <p className="text-gray-500 dark:text-white/60 text-[10px] font-bold uppercase">Hazard In</p>
          <span className={`text-3xl font-extrabold ${distanceToHazard < 0.5 ? 'text-red-500' : 'text-[#19e66f]'}`}>
            {distanceToHazard} <span className="text-sm">km</span>
          </span>
        </div>
      </div>

      <div className="flex-1"></div>

      {/* CONTROLS */}
      <div className="relative z-10 p-4 pb-8 space-y-3">
        <div className={`backdrop-blur-md rounded-xl p-4 border-l-4 transition-all shadow-lg ${distanceToHazard < 0.5 ? 'bg-red-100/90 dark:bg-red-900/80 border-red-500' : 'bg-white/90 dark:bg-black/70 border-[#19e66f]'}`}>
          <h2 className={`text-xl font-bold ${distanceToHazard < 0.5 ? 'text-red-700 dark:text-white' : 'text-gray-900 dark:text-white'}`}>
            {distanceToHazard < 0.5 ? 'APPROACHING ZONE' : 'SAFE ZONE'}
          </h2>
          <div className="mt-2 h-1.5 w-full bg-gray-200 dark:bg-white/20 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${distanceToHazard < 0.5 ? 'bg-red-500' : 'bg-[#19e66f]'}`}
              style={{ width: `${progress * 100}%` }}
            ></div>
          </div>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full bg-[#19e66f] hover:bg-[#14cc60] text-black h-14 rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl"
        >
          <i className="bi bi-stop-circle-fill text-xl"></i>
          END DRIVE
        </button>
      </div>

      {/* ALERT MODAL */}
      {showDangerAlert && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-[#101010] border-4 border-red-600 rounded-xl p-6 text-center shadow-[0_0_50px_red]">
            <i className="bi bi-exclamation-triangle-fill text-red-600 text-6xl mb-4 block"></i>
            <h1 className="text-3xl font-black text-white uppercase mb-2">WILDLIFE CORRIDOR</h1>
            <p className="text-gray-400 text-sm mb-6">High elephant activity detected ahead.</p>
            <button
              onClick={() => setShowDangerAlert(false)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg"
            >
              DISMISS
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
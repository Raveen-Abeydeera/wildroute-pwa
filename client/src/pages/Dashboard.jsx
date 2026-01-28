import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import SightingSheet from '../components/SightingSheet';
import { useTheme } from '../context/ThemeContext';

// --- FIXED: BOOTSTRAP ICON FOR DASHBOARD ---
const elephantIcon = new L.DivIcon({
  html: `<i class="bi bi-exclamation-circle-fill" style="font-size: 2rem; color: #E04040; background: white; border-radius: 50%; display: block; width: 32px; height: 32px; line-height: 32px; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></i>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

function RecenterMap({ sightings }) {
  const map = useMap();
  useEffect(() => {
    if (sightings.length > 0) {
      const latest = sightings[0];
      map.setView([latest.location.latitude, latest.location.longitude], 13);
    }
  }, [sightings, map]);
  return null;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [sightings, setSightings] = useState([]);
  const [selectedSighting, setSelectedSighting] = useState(null);
  const defaultCenter = [7.8731, 80.7718];

  useEffect(() => {
    const fetchSightings = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://wildroute-pwa.onrender.com';
        const res = await axios.get(`${apiUrl}/api/sightings/all`);
        setSightings(res.data);
      } catch (err) { console.error("Error fetching sightings:", err); }
    };
    fetchSightings();
    const interval = setInterval(fetchSightings, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getZoneStyle = (count) => {
    if (count === "10+" || count === "6-15") return { color: '#E04040', fillColor: '#E04040', radius: 800 };
    else if (count === "2-5") return { color: '#D4A373', fillColor: '#D4A373', radius: 500 };
    else return { color: '#19cee6', fillColor: '#19cee6', radius: 300 };
  };

  return (
    <div className="relative h-screen w-full flex flex-col bg-[#f0f2f5] dark:bg-[#17191c] overflow-hidden font-sans text-[#1a535b] dark:text-white select-none transition-colors duration-300">

      {/* MAP */}
      <div className="absolute inset-0 z-0">
        <MapContainer center={defaultCenter} zoom={8} style={{ height: '100%', width: '100%' }} zoomControl={false}>
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url={theme === 'dark'
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            }
          />
          <RecenterMap sightings={sightings} />
          {sightings.map((sighting) => {
            const zoneStyle = getZoneStyle(sighting.elephantCount);
            return (
              <div key={sighting._id}>
                <Circle center={[sighting.location.latitude, sighting.location.longitude]} pathOptions={{ color: zoneStyle.color, fillColor: zoneStyle.fillColor, fillOpacity: 0.2, weight: 1 }} radius={zoneStyle.radius} />
                <Marker position={[sighting.location.latitude, sighting.location.longitude]} icon={elephantIcon} eventHandlers={{ click: () => setSelectedSighting(sighting) }} />
              </div>
            );
          })}
        </MapContainer>
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-white/80 dark:from-[#17191c]/80 dark:via-transparent dark:to-[#17191c]/90 pointer-events-none z-[400]"></div>
      </div>

      {/* HEADER */}
      <header className="relative z-[500] p-4 pt-6 flex items-center justify-between">
        <div className="backdrop-blur-md bg-white/80 dark:bg-[#2b2f36]/85 p-2 px-4 rounded-lg flex items-center gap-3 border border-gray-200 dark:border-white/10 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-[#19cee6] animate-pulse"></div>
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#19cee6]">Live</span>
        </div>
        <div onClick={handleLogout} className="backdrop-blur-md bg-white/80 dark:bg-[#2b2f36]/85 p-2 px-3 rounded-lg flex items-center gap-2 cursor-pointer border border-gray-200 dark:border-white/10 shadow-sm">
          <span className="text-xs font-bold text-[#19cee6]">GPS Online</span>
        </div>
      </header>

      {/* BUTTONS */}
      <div className="flex-1"></div>
      <div className="relative z-[500] px-4 pb-24 space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/report')} className="backdrop-blur-md bg-white/80 dark:bg-[#E04040]/20 hover:bg-white dark:hover:bg-[#E04040]/40 border border-gray-200 dark:border-[#E04040]/30 rounded-xl flex flex-col items-center justify-center size-20 text-[#E04040] transition-colors shadow-lg">
            <i className="bi bi-camera-fill text-2xl mb-1"></i>
            <span className="text-[10px] font-bold uppercase tracking-widest">Report</span>
          </button>
          <button onClick={() => navigate('/drive')} className="flex-1 bg-[#19cee6] hover:bg-[#15b2c7] text-[#17191c] h-20 rounded-xl flex items-center justify-center gap-4 shadow-[0_0_30px_rgba(25,206,230,0.3)] transition-all active:scale-95">
            <i className="bi bi-car-front-fill text-4xl"></i>
            <div className="text-left">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] leading-none opacity-70">Initiate</div>
              <div className="text-xl font-bold leading-tight">DRIVE MODE</div>
            </div>
          </button>
        </div>
      </div>

      {/* NAV */}
      <nav className="absolute bottom-0 left-0 right-0 z-[500] pb-8 pt-4 px-6 backdrop-blur-xl bg-white/90 dark:bg-[#17191c]/90 rounded-t-3xl border-t border-gray-200 dark:border-white/5 shadow-lg">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex flex-col items-center gap-1 cursor-pointer text-[#19cee6]">
            <div className="bg-[#19cee6]/10 p-2 rounded-xl"><i className="bi bi-compass-fill"></i></div>
            <span className="text-[10px] font-bold uppercase">Home</span>
          </div>
          <div onClick={() => navigate('/saved')} className="flex flex-col items-center gap-1 cursor-pointer opacity-40 hover:opacity-100 text-[#1a535b] dark:text-white"><i className="bi bi-bookmark-fill"></i><span className="text-[10px] font-bold uppercase">Saved</span></div>
          <div onClick={() => navigate('/alerts')} className="flex flex-col items-center gap-1 cursor-pointer opacity-40 hover:opacity-100 text-[#1a535b] dark:text-white"><i className="bi bi-bell-fill"></i><span className="text-[10px] font-bold uppercase">Alerts</span></div>
          <div onClick={() => navigate('/profile')} className="flex flex-col items-center gap-1 cursor-pointer opacity-40 hover:opacity-100 text-[#1a535b] dark:text-white"><i className="bi bi-person-circle"></i><span className="text-[10px] font-bold uppercase">Profile</span></div>
        </div>
      </nav>

      {selectedSighting && <SightingSheet sighting={selectedSighting} onClose={() => setSelectedSighting(null)} onVerify={() => { alert('Verification Sent!'); setSelectedSighting(null); }} />}
    </div>
  );

}

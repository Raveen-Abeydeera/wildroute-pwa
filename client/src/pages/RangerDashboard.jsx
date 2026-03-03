import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Default Leaflet Icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Tactical Icon (Orange for Pending)
const getSightingIcon = () => {
    return new L.DivIcon({
        className: 'sighting-marker',
        html: `<div class="w-6 h-6 bg-orange-500 rounded-full border-2 border-white shadow-[0_0_15px_rgba(249,115,22,0.8)] flex items-center justify-center text-white text-[10px] font-bold animate-pulse">!</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });
};

export default function RangerDashboard() {
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || 'https://wildroute-pwa.onrender.com';
    const [rangerName, setRangerName] = useState('');
    const [pendingReports, setPendingReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('triage'); // 'triage', 'map', 'geofence', 'analytics'

    useEffect(() => {
        const userString = localStorage.getItem('user') || localStorage.getItem('userInfo');
        if (!userString) return navigate('/login');

        const parsedUser = JSON.parse(userString);
        if (parsedUser.role !== 'ranger') return navigate('/dashboard');

        setRangerName(parsedUser.fullName || parsedUser.name || 'Officer');
        fetchPendingReports();
    }, [navigate]);

    const fetchPendingReports = async () => {
        try {
            const res = await fetch(`${API_URL}/api/sightings/pending`);
            if (res.ok) {
                const data = await res.json();
                setPendingReports(data);
            }
        } catch (error) {
            console.error("Failed to fetch pending reports:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyStatus = async (sightingId, newStatus) => {
        try {
            const res = await fetch(`${API_URL}/api/sightings/${sightingId}/verify`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                setPendingReports((prev) => prev.filter((report) => report._id !== sightingId));
            } else {
                alert("Failed to update sighting status.");
            }
        } catch (error) {
            console.error("Network Error:", error);
        }
    };

    // --- SUB-COMPONENTS FOR TABS --- //

    const RenderTriage = () => (
        <div className="space-y-5 pb-24 overflow-y-auto">
            {loading ? (
                <div className="flex justify-center py-10">
                    <div className="w-8 h-8 border-4 border-[#2ECC71] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : pendingReports.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-50">
                    <span className="material-symbols-outlined text-6xl mb-4">check_circle</span>
                    <p className="text-lg font-bold tracking-widest uppercase text-[#95A5A6]">Queue Clear</p>
                </div>
            ) : (
                pendingReports.map((report, index) => {
                    // Simulating Priority/Trust visually for the demo
                    const isCritical = index === 0;
                    const trustScore = report.user?.points || Math.floor(Math.random() * 500) + 50;

                    return (
                        <article key={report._id} className="bg-[#1E272E] rounded-2xl overflow-hidden shadow-lg border border-[#2C3E50]/50 flex flex-col group">
                            {/* Image Header */}
                            <div className="relative h-48 w-full bg-[#2C3E50]">
                                {report.imageUrl ? (
                                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${report.imageUrl})` }}></div>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-[#1E272E]">
                                        <span className="material-symbols-outlined text-6xl text-[#2C3E50]">landscape</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1E272E] to-transparent opacity-90"></div>

                                {/* Badges */}
                                {isCritical && (
                                    <div className="absolute top-3 left-3 bg-[#E74C3C]/20 backdrop-blur-md border border-[#E74C3C]/30 text-[#E74C3C] px-3 py-1 rounded-full flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-[#E74C3C] animate-pulse"></span>
                                        <span className="text-xs font-bold uppercase tracking-wider">Critical</span>
                                    </div>
                                )}

                                <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md border border-white/10 text-white px-3 py-1.5 rounded-full flex items-center gap-2">
                                    <span className={`material-symbols-outlined text-[18px] ${trustScore > 300 ? 'text-[#2ECC71]' : 'text-[#f39c12]'}`}>verified_user</span>
                                    <div className="flex flex-col leading-none">
                                        {/* UPDATED: Changed from .name to .fullName */}
                                        <span className="text-[10px] text-[#95A5A6] uppercase">{report.user?.fullName || 'Scout'}</span>
                                        <span className="text-xs font-bold">{trustScore} pts</span>
                                    </div>
                                </div>

                                <div className="absolute bottom-3 left-4 right-4">
                                    <h2 className="text-xl font-bold text-white mb-0.5">{report.description || 'Sighting Report'}</h2>
                                    <p className="text-sm text-[#95A5A6] flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                                        {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • App
                                    </p>
                                </div>
                            </div>

                            {/* Details Body */}
                            <div className="p-4 space-y-4">
                                <div className="flex gap-3">
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-start gap-2 text-sm text-[#95A5A6]">
                                            <span className="material-symbols-outlined text-[18px] mt-0.5 shrink-0 text-[#2ECC71]">location_on</span>
                                            <span className="leading-snug">Pending Location Validation</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-mono text-[#95A5A6] pl-6">
                                            <span className="bg-[#2C3E50] px-1.5 py-0.5 rounded text-[#2ECC71]">Lat: {report.location?.coordinates[1]?.toFixed(4)}</span>
                                            <span className="bg-[#2C3E50] px-1.5 py-0.5 rounded text-[#2ECC71]">Long: {report.location?.coordinates[0]?.toFixed(4)}</span>
                                        </div>
                                    </div>
                                    <div className="w-16 h-16 rounded-lg bg-[#2C3E50] shrink-0 flex items-center justify-center border border-white/10">
                                        <span className="material-symbols-outlined text-[#95A5A6]">map</span>
                                    </div>
                                </div>

                                {/* --- NEW: Contact Reporter Row --- */}
                                {report.user?.phone && (
                                    <div className="flex items-center justify-between bg-[#2C3E50]/30 p-3 rounded-xl border border-[#2C3E50]/50">
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[#3498DB]">phone_in_talk</span>
                                            <div className="flex flex-col">
                                                <span className="text-xs text-[#95A5A6] uppercase font-bold tracking-wider">Contact Reporter</span>
                                                <span className="text-sm font-bold text-[#ECF0F1]">{report.user.phone}</span>
                                            </div>
                                        </div>
                                        <a href={`tel:${report.user.phone}`} className="bg-[#3498DB]/20 text-[#3498DB] px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#3498DB] hover:text-white transition-colors border border-[#3498DB]/30">
                                            CALL NOW
                                        </a>
                                    </div>
                                )}
                                {/* -------------------------------- */}

                                <div className="h-px bg-[#2C3E50] w-full"></div>

                                {/* Actions */}
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleVerifyStatus(report._id, 'verified')}
                                        className="h-12 flex-1 bg-[#2ECC71] hover:opacity-90 text-[#121212] font-bold rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                                    >
                                        <span className="material-symbols-outlined filled">check_circle</span>
                                        VERIFY
                                    </button>
                                    <button
                                        onClick={() => handleVerifyStatus(report._id, 'rejected')}
                                        className="h-12 flex-1 bg-[#2C3E50] hover:opacity-80 text-[#E74C3C] border border-[#E74C3C]/20 font-bold rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                                    >
                                        <span className="material-symbols-outlined">cancel</span>
                                        REJECT
                                    </button>
                                </div>
                            </div>
                        </article>
                    );
                })
            )}
        </div>
    );

    const RenderMap = () => (
        <div className="h-[calc(100vh-160px)] w-full rounded-2xl overflow-hidden border border-[#2C3E50] relative z-0 shadow-lg">
            <MapContainer
                center={[7.8731, 80.7718]} // Centers perfectly on Sri Lanka
                zoom={7}
                className="w-full h-full"
                zoomControl={false}
            >
                {/* Standard Light Map Tiles */}
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap'
                />

                {/* Plot all pending reports */}
                {pendingReports.map(report => {
                    if (!report.location || !report.location.coordinates) return null;
                    const [lng, lat] = report.location.coordinates;

                    // Parse the description safely for the tiny popup
                    const displayDesc = report.description && report.description.includes('Notes:')
                        ? report.description.split('Notes:')[1].trim()
                        : (report.description || "Reported Sighting");

                    return (
                        <Marker key={`map-${report._id}`} position={[lat, lng]} icon={getSightingIcon()}>
                            <Popup className="tactical-popup">
                                <div className="text-black flex flex-col min-w-[180px] p-1">
                                    {/* Map Popup Evidence Image */}
                                    {report.imageUrl && (
                                        <img src={report.imageUrl} alt="Evidence" className="w-full h-24 object-cover rounded-md mb-2 bg-gray-200" />
                                    )}

                                    <strong className="text-sm leading-tight mb-1 truncate w-full block">{displayDesc}</strong>
                                    <p className="text-xs text-gray-600 font-medium leading-snug">Rep: {report.user?.fullName || 'Scout'}</p>

                                    {/* Clickable Phone Number inside the map! */}
                                    {report.user?.phone && (
                                        <a href={`tel:${report.user.phone}`} className="text-xs text-[#3498DB] font-bold my-1 hover:underline">
                                            📞 {report.user.phone}
                                        </a>
                                    )}

                                    {/* Action Buttons directly on the map */}
                                    <div className="flex gap-2 w-full mt-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleVerifyStatus(report._id, 'verified'); }}
                                            className="flex-1 bg-[#2ECC71] text-[#121212] text-[10px] font-bold py-2 rounded shadow-sm hover:opacity-80 transition-opacity"
                                        >
                                            VERIFY
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleVerifyStatus(report._id, 'rejected'); }}
                                            className="flex-1 bg-[#E74C3C] text-white text-[10px] font-bold py-2 rounded shadow-sm hover:opacity-80 transition-opacity"
                                        >
                                            REJECT
                                        </button>
                                    </div>
                                </div>
                            </Popup>

                            {/* Visual 2km Danger Zone */}
                            <Circle
                                center={[lat, lng]}
                                radius={2000}
                                pathOptions={{ color: '#f39c12', fillColor: '#f39c12', fillOpacity: 0.15, weight: 1, dashArray: '4, 4' }}
                            />
                        </Marker>
                    );
                })}
            </MapContainer>

            {/* Map UI Overlay */}
            <div className="absolute top-4 left-4 z-[400] bg-[#121212]/80 backdrop-blur-md border border-[#2C3E50] px-3 py-1.5 rounded-full shadow-lg">
                <span className="text-xs font-bold text-[#2ECC71] tracking-widest uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#2ECC71] animate-pulse"></span>
                    Live Triage Layer
                </span>
            </div>
        </div>
    );

    const RenderGeofence = () => (
        <div className="flex flex-col items-center justify-center h-full text-[#95A5A6] opacity-70">
            <span className="material-symbols-outlined text-6xl mb-4 text-[#E74C3C]">radar</span>
            <h2 className="text-xl font-bold text-white mb-2">SOS Hotspot Management</h2>
            <p className="text-sm max-w-xs text-center">Draw custom risk zones and broadcast emergency alerts to drivers nearby.</p>
        </div>
    );

    const RenderAnalytics = () => (
        <div className="flex flex-col items-center justify-center h-full text-[#95A5A6] opacity-70">
            <span className="material-symbols-outlined text-6xl mb-4 text-[#f39c12]">bar_chart</span>
            <h2 className="text-xl font-bold text-white mb-2">Conflict Analytics</h2>
            <p className="text-sm max-w-xs text-center">Peak conflict hours, most dangerous routes, and resource deployment charts.</p>
        </div>
    );

    return (
        <div className="bg-[#121212] text-[#ECF0F1] min-h-screen flex flex-col antialiased selection:bg-[#2ECC71] selection:text-white font-sans">

            {/* Header / Top Bar */}
            <div className="sticky top-0 z-20 bg-[#121212]/95 backdrop-blur-md border-b border-[#2C3E50] px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/profile')} className="text-[#ECF0F1] p-1 rounded-full hover:bg-[#2C3E50] transition-colors">
                        <span className="material-symbols-outlined text-xl">person</span>
                    </button>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight text-[#ECF0F1]">Command Center</h1>
                        <p className="text-[10px] text-[#2ECC71] uppercase tracking-widest leading-none">Officer {rangerName}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="relative p-2 text-[#95A5A6] hover:text-[#2ECC71] transition-colors">
                        <span className="material-symbols-outlined">notifications</span>
                        {pendingReports.length > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E74C3C] rounded-full ring-2 ring-[#121212]"></span>
                        )}
                    </button>
                    <button className="p-2 text-[#95A5A6] hover:text-[#2ECC71] transition-colors">
                        <span className="material-symbols-outlined">filter_list</span>
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 px-4 py-4 overflow-y-auto">
                {activeTab === 'triage' && <RenderTriage />}
                {activeTab === 'map' && <RenderMap />}
                {activeTab === 'geofence' && <RenderGeofence />}
                {activeTab === 'analytics' && <RenderAnalytics />}
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 w-full bg-[#121212]/95 backdrop-blur-lg border-t border-[#2C3E50] z-30 pb-safe pt-2">
                <div className="flex justify-around items-end h-16 pb-4">
                    <button onClick={() => setActiveTab('triage')} className={`flex flex-col items-center justify-end gap-1 w-full group ${activeTab === 'triage' ? 'text-[#2ECC71]' : 'text-[#95A5A6] hover:text-[#2ECC71]'}`}>
                        <div className="relative p-1 rounded-full">
                            <span className={`material-symbols-outlined text-[26px] ${activeTab === 'triage' ? 'filled' : ''}`}>check_circle</span>
                            {pendingReports.length > 0 && <span className="absolute top-1 right-0 w-2 h-2 bg-[#E74C3C] rounded-full"></span>}
                        </div>
                        <span className="text-[10px] font-medium tracking-wide">Triage</span>
                    </button>
                    <button onClick={() => setActiveTab('map')} className={`flex flex-col items-center justify-end gap-1 w-full group ${activeTab === 'map' ? 'text-[#2ECC71]' : 'text-[#95A5A6] hover:text-[#2ECC71]'}`}>
                        <div className="relative p-1 rounded-full">
                            <span className={`material-symbols-outlined text-[26px] ${activeTab === 'map' ? 'filled' : ''}`}>map</span>
                        </div>
                        <span className="text-[10px] font-medium tracking-wide">Map</span>
                    </button>
                    <button onClick={() => setActiveTab('geofence')} className={`flex flex-col items-center justify-end gap-1 w-full group ${activeTab === 'geofence' ? 'text-[#2ECC71]' : 'text-[#95A5A6] hover:text-[#2ECC71]'}`}>
                        <div className="relative p-1 rounded-full">
                            <span className={`material-symbols-outlined text-[26px] ${activeTab === 'geofence' ? 'filled' : ''}`}>radar</span>
                        </div>
                        <span className="text-[10px] font-medium tracking-wide">Geofence</span>
                    </button>
                    <button onClick={() => setActiveTab('analytics')} className={`flex flex-col items-center justify-end gap-1 w-full group ${activeTab === 'analytics' ? 'text-[#2ECC71]' : 'text-[#95A5A6] hover:text-[#2ECC71]'}`}>
                        <div className="relative p-1 rounded-full">
                            <span className={`material-symbols-outlined text-[26px] ${activeTab === 'analytics' ? 'filled' : ''}`}>bar_chart</span>
                        </div>
                        <span className="text-[10px] font-medium tracking-wide">Stats</span>
                    </button>
                </div>
            </nav>
        </div>
    );
}

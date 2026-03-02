import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Alerts() {
    const navigate = useNavigate();
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'https://wildroute-pwa.onrender.com';

    // Fetch Live Active Sightings on Mount
    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                // This fetches the same active < 4hr sightings used on the map!
                const res = await axios.get(`${API_URL}/api/sightings`);
                setAlerts(res.data);
            } catch (err) {
                console.error("Failed to fetch alerts", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAlerts();
    }, [API_URL]);

    // Helper function to calculate "10 mins ago", "2 hours ago", etc.
    const timeAgo = (dateString) => {
        const diff = Math.floor((new Date() - new Date(dateString)) / 60000); // in minutes
        if (diff < 1) return 'Just now';
        if (diff < 60) return `${diff} mins ago`;
        return `${Math.floor(diff / 60)} hours ago`;
    };

    return (
        <div className="min-h-screen w-full bg-gray-100 dark:bg-[#17191c] font-sans text-gray-900 dark:text-white pb-24 transition-colors duration-300">
            {/* Header */}
            <header className="p-6 pt-8 bg-white/90 dark:bg-[#17191c]/90 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200 dark:border-white/5">
                <h1 className="text-2xl font-bold tracking-tight">System Alerts</h1>
                <p className="text-gray-500 dark:text-white/50 text-xs uppercase tracking-widest mt-1">Live Threat Feed</p>
            </header>

            {/* Alerts Feed */}
            <div className="p-4 space-y-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center mt-20 opacity-50 animate-pulse">
                        <span className="material-symbols-outlined text-4xl mb-2">radar</span>
                        <p className="font-bold text-sm tracking-widest uppercase">Scanning Area...</p>
                    </div>
                ) : alerts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center mt-20 opacity-50">
                        <span className="material-symbols-outlined text-5xl mb-3 text-green-500">verified_user</span>
                        <p className="font-bold text-lg">No Active Alerts</p>
                        <p className="text-sm">The routes are currently clear.</p>
                    </div>
                ) : (
                    alerts.map((alert) => (
                        <div
                            key={alert._id}
                            onClick={() => navigate(`/sighting/${alert._id}`)}
                            className={`p-4 rounded-xl flex gap-4 cursor-pointer shadow-sm transition-transform active:scale-[0.98] border ${alert.status === 'verified'
                                    ? 'bg-red-50 dark:bg-[#E04040]/10 border-red-200 dark:border-[#E04040]/30'
                                    : 'bg-orange-50 dark:bg-[#f59e0b]/10 border-orange-200 dark:border-[#f59e0b]/30'
                                }`}
                        >
                            <span className={`material-symbols-outlined text-3xl ${alert.status === 'verified' ? 'text-[#E04040]' : 'text-[#f59e0b]'}`}>
                                {alert.status === 'verified' ? 'warning' : 'campaign'}
                            </span>

                            <div className="flex-1">
                                <h3 className={`font-bold ${alert.status === 'verified' ? 'text-[#E04040]' : 'text-[#f59e0b]'}`}>
                                    {alert.status === 'verified' ? 'Verified Hazard' : 'Unverified Report'}
                                </h3>

                                {/* Parses the complex string just like we did for the Dashboard! */}
                                <p className="text-sm text-gray-700 dark:text-white/80 mt-1 line-clamp-2">
                                    {alert.description && alert.description.includes('Notes:')
                                        ? alert.description.split('Notes:')[1].trim()
                                        : (alert.description || "Elephant sighting reported.")}
                                </p>

                                <div className="flex justify-between items-center mt-3 pt-3 border-t border-black/5 dark:border-white/5">
                                    <p className="text-[10px] text-gray-500 dark:text-white/40 uppercase font-bold tracking-wider">
                                        {timeAgo(alert.createdAt)}
                                    </p>
                                    <p className="text-[10px] font-bold opacity-50 flex items-center gap-1 font-mono">
                                        <span className="material-symbols-outlined text-[12px]">location_on</span>
                                        {alert.location?.coordinates[1]?.toFixed(3)}, {alert.location?.coordinates[0]?.toFixed(3)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 pb-8 pt-4 px-6 bg-white/90 dark:bg-[#17191c]/90 backdrop-blur-xl border-t border-gray-200 dark:border-white/5">
                <div className="flex items-center justify-between max-w-md mx-auto">
                    <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100"><span className="material-symbols-outlined">explore</span></button>
                    <button onClick={() => navigate('/saved')} className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100"><span className="material-symbols-outlined">bookmark</span></button>
                    <div className="flex flex-col items-center gap-1"><div className="bg-[#19cee6]/10 p-2 rounded-xl"><span className="material-symbols-outlined text-[#19cee6]" style={{ fontVariationSettings: "'FILL' 1" }}>notifications</span></div></div>
                    <button onClick={() => navigate('/profile')} className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100"><span className="material-symbols-outlined">account_circle</span></button>
                </div>
            </nav>
        </div>
    );
}

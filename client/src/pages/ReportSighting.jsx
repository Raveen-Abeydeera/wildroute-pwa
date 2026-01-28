import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ReportSighting() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        elephantCount: '',
        behavior: 'Calm',
        notes: ''
    });

    // Metadata State
    const [location, setLocation] = useState({ lat: null, lng: null, status: 'Locating...' });
    const [currentTime, setCurrentTime] = useState('');

    // 1. Get GPS & Time on Mount
    useEffect(() => {
        // Set Time
        setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

        // Get GPS
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (p) => setLocation({ lat: p.coords.latitude, lng: p.coords.longitude, status: `${p.coords.latitude.toFixed(4)}° N, ${p.coords.longitude.toFixed(4)}° E` }),
                (e) => setLocation({ ...location, status: 'Location denied' })
            );
        } else {
            setLocation({ ...location, status: 'GPS not supported' });
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const payload = { ...formData, reporterId: user.id, latitude: location.lat || 0, longitude: location.lng || 0 };
            
            // --- FIXED: VITE_API_URL ---
            const apiUrl = import.meta.env.VITE_API_URL || 'https://wildroute-pwa.onrender.com';
            await axios.post(`${apiUrl}/api/sightings/create`, payload);
            
            navigate('/success');
        } catch (err) { alert('Failed to submit report.'); } finally { setLoading(false); }
    };

    return (
        <div className="relative h-screen w-full flex flex-col justify-end bg-gray-100 dark:bg-[#0e191b] font-sans text-gray-900 dark:text-white overflow-hidden transition-colors duration-300">

            <div className="absolute inset-0 z-0 opacity-40">
                <div className="w-full h-full bg-cover bg-center grayscale contrast-125" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=1000&auto=format&fit=crop")' }}></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-white/80 to-transparent dark:from-[#1a535b]/20 dark:to-transparent"></div>
            </div>

            <div className="relative z-10 w-full max-w-md mx-auto h-[92vh] flex flex-col backdrop-blur-xl bg-white/90 dark:bg-[#0e191b]/90 rounded-t-[2.5rem] shadow-2xl border-t border-gray-200 dark:border-white/10">

                <div className="flex justify-center py-3"><div className="w-10 h-1 bg-gray-300 dark:bg-white/20 rounded-full"></div></div>

                <div className="flex items-center px-6 pb-4 justify-between">
                    <button onClick={() => navigate(-1)} className="text-gray-500 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors p-2">
                        <i className="bi bi-x-lg text-lg"></i>
                    </button>
                    <h2 className="text-lg font-extrabold tracking-tight text-center">New Sighting</h2>
                    <div className="flex-1 flex justify-end"><p className="text-[#1a535b] font-bold text-xs tracking-widest uppercase">Step 1 of 2</p></div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 pb-24">

                    {/* Image Upload */}
                    <div className="mt-4 mb-8">
                        <div className="flex flex-col items-center gap-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-[#3c595d] bg-gray-50 dark:bg-[#1a535b]/5 px-6 py-12 hover:bg-gray-100 dark:hover:bg-[#1a535b]/10 transition-colors cursor-pointer group">
                            <div className="flex flex-col items-center gap-3">
                                <div className="bg-gray-200 dark:bg-[#1a535b]/20 p-4 rounded-full group-hover:scale-110 transition-transform">
                                    <i className="bi bi-camera-fill text-[#1a535b] text-3xl"></i>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <p className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">Upload Image</p>
                                    <p className="text-gray-500 dark:text-white/50 text-xs font-normal text-center">Capture evidence</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form id="reportForm" onSubmit={handleSubmit} className="space-y-6">

                        {/* Elephant Count */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-500 dark:text-white/70 text-sm font-bold uppercase tracking-wider px-1">How many elephants?</label>
                            <div className="relative">
                                <select name="elephantCount" required onChange={(e) => setFormData({ ...formData, elephantCount: e.target.value })} className="appearance-none w-full rounded-xl border border-gray-300 dark:border-[#3c595d] bg-gray-50 dark:bg-[#1e2d2f] h-14 px-4 text-base font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-[#1a535b] outline-none transition-all">
                                    <option value="" disabled selected>Select count</option>
                                    <option value="1">1 (Lone individual)</option>
                                    <option value="2-5">2 - 5 (Small group)</option>
                                    <option value="6-15">6 - 15 (Medium herd)</option>
                                    <option value="15+">More than 15 (Large herd)</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#1a535b]"><i className="bi bi-chevron-down"></i></div>
                            </div>
                        </div>

                        {/* --- RESTORED: Primary Behavior --- */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-500 dark:text-white/70 text-sm font-bold uppercase tracking-wider px-1">Primary Behavior</label>
                            <div className="flex gap-2">
                                {['Calm', 'Moving', 'Aggressive'].map((b) => (
                                    <button
                                        key={b}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, behavior: b })}
                                        className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${formData.behavior === b
                                                ? 'bg-[#1a535b] border-[#1a535b] text-white'
                                                : 'bg-transparent border-gray-300 dark:border-[#3c595d] text-gray-500 dark:text-white/60'
                                            }`}
                                    >
                                        {b}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-500 dark:text-white/70 text-sm font-bold uppercase tracking-wider px-1">Behavioral Notes</label>
                            <textarea name="notes" onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full min-h-[100px] resize-none rounded-xl border border-gray-300 dark:border-[#3c595d] bg-gray-50 dark:bg-[#1e2d2f] p-4 text-base font-normal text-gray-900 dark:text-white focus:ring-2 focus:ring-[#1a535b] outline-none transition-all placeholder:text-gray-400" placeholder="Describe movement..."></textarea>
                        </div>

                        {/* METADATA SECTION (TIME & LOCATION) */}
                        <div className="bg-gray-100 dark:bg-white/5 rounded-2xl p-4 border border-gray-200 dark:border-white/5 space-y-4">
                            {/* Location Row */}
                            <div className="flex items-center gap-3 border-b border-gray-200 dark:border-white/10 pb-3">
                                <i className="bi bi-geo-alt-fill text-[#1a535b]/80 text-xl"></i>
                                <div className="flex-1 flex justify-between items-center">
                                    <p className="text-gray-400 dark:text-white/40 text-[10px] font-bold uppercase tracking-widest">Location</p>
                                    <p className="text-gray-600 dark:text-white text-xs font-mono">{location.status}</p>
                                </div>
                            </div>

                            {/* Time Row */}
                            <div className="flex items-center gap-3">
                                <i className="bi bi-clock-fill text-[#1a535b]/80 text-xl"></i>
                                <div className="flex-1 flex justify-between items-center">
                                    <p className="text-gray-400 dark:text-white/40 text-[10px] font-bold uppercase tracking-widest">Time</p>
                                    <p className="text-gray-600 dark:text-white text-xs font-mono">{currentTime}</p>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/90 dark:bg-[#0e191b]/95 pt-10">
                    <button type="submit" form="reportForm" disabled={loading} className="w-full bg-[#1a535b] hover:bg-[#154249] text-white h-14 rounded-xl font-extrabold text-base tracking-tight shadow-xl shadow-[#1a535b]/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50">
                        {loading ? 'Sending Report...' : 'Submit Sighting'}
                        {!loading && <i className="bi bi-send-fill"></i>}
                    </button>
                </div>

            </div>
        </div>
    );
}


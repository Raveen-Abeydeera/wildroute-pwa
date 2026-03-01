import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ReportSighting() {
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || 'https://wildroute-pwa.onrender.com';
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        elephantCount: '',
        behavior: 'Calm',
        notes: ''
    });

    // Image Upload State
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

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
                (p) => setLocation({
                    lat: p.coords.latitude,
                    lng: p.coords.longitude,
                    status: `${p.coords.latitude.toFixed(4)}° N, ${p.coords.longitude.toFixed(4)}° E`
                }),
                (err) => {
                    console.error(err);
                    setLocation({ ...location, status: 'Location denied/failed' });
                },
                { enableHighAccuracy: true }
            );
        } else {
            setLocation({ ...location, status: 'GPS not supported' });
        }
    }, []);

    // 2. Handle Image Selection & Preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // 3. Handle Form Submission to Backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!location.lat || !location.lng) {
            setError('Please wait for GPS location before submitting.');
            return;
        }

        // Fetch user from localStorage (using 'userInfo' to match your auth flow)
        const userString = localStorage.getItem('user');
        if (!userString) {
            setError('You must be logged in to report a sighting.');
            return;
        }
        const user = JSON.parse(userString);

        setLoading(true);

        // Combine the detailed form data into the single description field expected by the Mongoose schema
        const combinedDescription = `Count: ${formData.elephantCount} | Behavior: ${formData.behavior} | Notes: ${formData.notes}`;

        // Using FormData because we are sending an Image file for Multer
        const uploadData = new FormData();
        uploadData.append('userId', user.id || user._id);
        uploadData.append('latitude', location.lat);
        uploadData.append('longitude', location.lng);
        uploadData.append('description', combinedDescription);

        if (image) {
            uploadData.append('image', image);
        }

        try {
            const response = await fetch(`${API_URL}/api/sightings`, {
                method: 'POST',
                // Note: Do not set 'Content-Type' when using FormData. The browser sets the multipart boundary automatically.
                body: uploadData,
            });

            if (response.ok) {
                navigate('/success');
            } else {
                // SAFETY NET: Check if the response is actually JSON!
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const data = await response.json();
                    setError(data.message || 'Failed to submit report.');
                } else {
                    // If it's HTML, the backend crashed
                    setError('Server error: The backend crashed. Check Render logs!');
                }
            }
        } catch (err) {
            console.error(err);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative h-screen w-full flex flex-col justify-end bg-gray-100 dark:bg-[#0e191b] font-sans text-gray-900 dark:text-white overflow-hidden transition-colors duration-300">

            {/* Background Image & Overlay */}
            <div className="absolute inset-0 z-0 opacity-40">
                <div className="w-full h-full bg-cover bg-center grayscale contrast-125" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=1000&auto=format&fit=crop")' }}></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-white/80 to-transparent dark:from-[#1a535b]/20 dark:to-transparent"></div>
            </div>

            {/* Main Bottom Sheet Container */}
            <div className="relative z-10 w-full max-w-md mx-auto h-[92vh] flex flex-col backdrop-blur-xl bg-white/90 dark:bg-[#0e191b]/90 rounded-t-[2.5rem] shadow-2xl border-t border-gray-200 dark:border-white/10">

                <div className="flex justify-center py-3"><div className="w-10 h-1 bg-gray-300 dark:bg-white/20 rounded-full"></div></div>

                {/* Header */}
                <div className="flex items-center px-6 pb-4 justify-between">
                    <button onClick={() => navigate(-1)} className="text-gray-500 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                        </svg>
                    </button>
                    <h2 className="text-lg font-extrabold tracking-tight text-center">New Sighting</h2>
                    <div className="flex-1 flex justify-end"><p className="text-[#1a535b] font-bold text-xs tracking-widest uppercase">Step 1 of 2</p></div>
                </div>

                {/* Scrollable Form Content */}
                <div className="flex-1 overflow-y-auto px-6 pb-24">

                    {error && (
                        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-4 text-sm font-bold">
                            {error}
                        </div>
                    )}

                    {/* Integrated Image Upload */}
                    <div className="mt-4 mb-8">
                        <label className="flex flex-col items-center gap-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-[#3c595d] bg-gray-50 dark:bg-[#1a535b]/5 px-6 py-12 hover:bg-gray-100 dark:hover:bg-[#1a535b]/10 transition-colors cursor-pointer group relative overflow-hidden">
                            {preview ? (
                                <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="bg-gray-200 dark:bg-[#1a535b]/20 p-4 rounded-full group-hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="text-[#1a535b]" viewBox="0 0 16 16">
                                            <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                            <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <p className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">Upload Image</p>
                                        <p className="text-gray-500 dark:text-white/50 text-xs font-normal text-center">Capture evidence</p>
                                    </div>
                                </div>
                            )}
                            <input type="file" className="hidden" accept="image/*" capture="environment" onChange={handleImageChange} />
                        </label>
                    </div>

                    <form id="reportForm" onSubmit={handleSubmit} className="space-y-6">

                        {/* Elephant Count */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-500 dark:text-white/70 text-sm font-bold uppercase tracking-wider px-1">How many elephants?</label>
                            <div className="relative">
                                <select name="elephantCount" required value={formData.elephantCount} onChange={(e) => setFormData({ ...formData, elephantCount: e.target.value })} className="appearance-none w-full rounded-xl border border-gray-300 dark:border-[#3c595d] bg-gray-50 dark:bg-[#1e2d2f] h-14 px-4 text-base font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-[#1a535b] outline-none transition-all">
                                    <option value="" disabled>Select count</option>
                                    <option value="1">1 (Lone individual)</option>
                                    <option value="2-5">2 - 5 (Small group)</option>
                                    <option value="6-15">6 - 15 (Medium herd)</option>
                                    <option value="15+">More than 15 (Large herd)</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#1a535b]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Primary Behavior */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-500 dark:text-white/70 text-sm font-bold uppercase tracking-wider px-1">Primary Behavior</label>
                            <div className="flex gap-2">
                                {['Calm', 'Moving', 'Aggressive'].map((b) => (
                                    <button
                                        key={b}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, behavior: b })}
                                        className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${formData.behavior === b
                                            ? 'bg-[#1a535b] border-[#1a535b] text-white shadow-md'
                                            : 'bg-transparent border-gray-300 dark:border-[#3c595d] text-gray-500 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5'
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
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                className="w-full min-h-[100px] resize-none rounded-xl border border-gray-300 dark:border-[#3c595d] bg-gray-50 dark:bg-[#1e2d2f] p-4 text-base font-normal text-gray-900 dark:text-white focus:ring-2 focus:ring-[#1a535b] outline-none transition-all placeholder:text-gray-400"
                                placeholder="Describe movement or specific actions..."
                                required
                            ></textarea>
                        </div>

                        {/* METADATA SECTION (TIME & LOCATION) */}
                        <div className="bg-gray-100 dark:bg-white/5 rounded-2xl p-4 border border-gray-200 dark:border-white/5 space-y-4">
                            {/* Location Row */}
                            <div className="flex items-center gap-3 border-b border-gray-200 dark:border-white/10 pb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="text-[#1a535b]/80" viewBox="0 0 16 16">
                                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                                </svg>
                                <div className="flex-1 flex justify-between items-center">
                                    <p className="text-gray-400 dark:text-white/40 text-[10px] font-bold uppercase tracking-widest">Location</p>
                                    <p className={`text-xs font-mono font-bold ${location.lat ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400 animate-pulse'}`}>
                                        {location.status}
                                    </p>
                                </div>
                            </div>

                            {/* Time Row */}
                            <div className="flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="text-[#1a535b]/80" viewBox="0 0 16 16">
                                    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
                                </svg>
                                <div className="flex-1 flex justify-between items-center">
                                    <p className="text-gray-400 dark:text-white/40 text-[10px] font-bold uppercase tracking-widest">Time</p>
                                    <p className="text-gray-600 dark:text-white text-xs font-mono font-bold">{currentTime}</p>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>

                {/* Sticky Submit Button */}
                <div className="absolute bottom-0 left-5 right-5 p-2 bg-white/90 dark:bg-[#0e191b]/95 pt-10">
                    <button
                        type="submit"
                        form="reportForm"
                        disabled={loading || !location.lat}
                        className="w-full bg-[#1a535b] hover:bg-[#154249] text-white h-14 rounded-xl font-extrabold text-base tracking-tight shadow-xl shadow-[#1a535b]/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            'Sending Report...'
                        ) : (
                            <>
                                Submit Sighting
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
                                </svg>
                            </>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}
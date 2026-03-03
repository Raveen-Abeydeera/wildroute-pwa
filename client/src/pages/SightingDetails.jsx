import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SightingDetails() {
    const { id } = useParams(); // Get the ID from the URL
    const navigate = useNavigate();
    const [sighting, setSighting] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'https://wildroute-pwa.onrender.com';
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userId = storedUser?._id || storedUser?.id;

    useEffect(() => {
        const fetchSighting = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/sightings/${id}`);
                setSighting(res.data);
            } catch (err) {
                console.error("Error fetching sighting", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSighting();
    }, [id, API_URL]);

    const handleConfirm = async () => {
        try {
            const res = await axios.post(`${API_URL}/api/sightings/${id}/confirm`, { userId });
            setSighting(res.data);
            alert("Thanks! The warning has been extended for other drivers.");
        } catch (err) {
            // NEW: Show the actual backend error!
            alert(err.response?.data?.message || "Failed to confirm sighting.");
        }
    };

    const handleSafe = async () => {
        try {
            const res = await axios.post(`${API_URL}/api/sightings/${id}/safe`, { userId });
            setSighting(res.data);
            if (res.data.status === 'resolved') {
                alert("Safe Zone Confirmed! This alert has been cleared from the map.");
                navigate('/dashboard'); // Go back to map
            } else {
                alert(`Vote counted! ${3 - res.data.safeVotes.length} more votes needed to clear this alert.`);
            }
        } catch (err) {
            // NEW: Show the actual backend error!
            alert(err.response?.data?.message || "Failed to submit vote.");
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center dark:bg-[#131f18] text-white">Loading...</div>;
    if (!sighting) return <div className="h-screen flex items-center justify-center text-white">Sighting not found.</div>;

    // Default image if none exists
    const bgImage = sighting.imageUrl || "https://images.unsplash.com/photo-1581852017103-68accd557203?q=80&w=1000&auto=format&fit=crop";

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-[#f6f8f7] dark:bg-[#131f18] overflow-x-hidden shadow-2xl font-sans text-slate-900 dark:text-slate-100">
            {/* Header */}
            <div className="flex items-center p-4 sticky top-0 z-10 border-b border-[#2ecc70]/10 bg-[#f6f8f7] dark:bg-[#131f18]">
                <div onClick={() => navigate(-1)} className="flex size-10 items-center justify-center rounded-full hover:bg-[#2ecc70]/10 cursor-pointer">
                    <span className="material-symbols-outlined">arrow_back</span>
                </div>
                <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Sighting Details</h2>
            </div>

            <div className="flex-1 overflow-y-auto">
                {/* Hero Image Section */}
                <div className="relative bg-cover bg-center flex flex-col justify-end min-h-[250px] aspect-video bg-[#1e272e]"
                    style={{ backgroundImage: `linear-gradient(to top, rgba(19, 31, 24, 0.9) 0%, rgba(19, 31, 24, 0) 50%), url("${bgImage}")` }}>

                    {sighting.status === 'verified' && (
                        <div className="absolute top-4 left-4">
                            <div className="flex items-center gap-1.5 rounded-full bg-[#2ecc70] px-3 py-1 shadow-lg">
                                <span className="material-symbols-outlined text-[16px] text-white">verified_user</span>
                                <span className="text-[12px] font-bold uppercase tracking-wider text-white">Verified</span>
                            </div>
                        </div>
                    )}

                    <div className="p-4 space-y-2">
                        {/* 1. Parse the complex description string into an array */}
                        {sighting.description && sighting.description.includes('|') ? (
                            <div className="flex flex-wrap gap-2 mb-2">
                                {sighting.description.split('|').map((part, index) => {
                                    // Make "Count:" and "Behavior:" look like tags!
                                    if (part.includes('Notes:')) return null; // Hide notes from tags
                                    return (
                                        <span key={index} className="bg-white/20 backdrop-blur-md text-white px-2 py-1 rounded text-xs font-bold border border-white/10">
                                            {part.trim()}
                                        </span>
                                    );
                                })}
                            </div>
                        ) : null}

                        {/* 2. Show the actual Notes as the main title */}
                        <h1 className="text-white text-xl font-bold leading-tight">
                            {sighting.description ? sighting.description.split('Notes:')[1]?.trim() || sighting.description : "Wild Elephant Sighting"}
                        </h1>

                        <p className="text-[#2ecc70] font-medium text-sm flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">location_on</span>
                            Lat: {sighting.location?.coordinates?.[1]?.toFixed(4) || "N/A"}, Lng: {sighting.location?.coordinates?.[0]?.toFixed(4) || "N/A"}
                        </p>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3 p-4">
                    <div className="flex flex-col gap-1 rounded-xl p-4 bg-[#2ecc70]/10 border border-[#2ecc70]/20">
                        <div className="flex items-center gap-2 text-[#2ecc70]">
                            <span className="material-symbols-outlined text-xl">groups</span>
                            <p className="text-xs font-bold uppercase tracking-wider">Confirmations</p>
                        </div>
                        <p className="text-lg font-bold leading-tight mt-1">{sighting.confirmations?.length || 0} People</p>
                    </div>
                    <div className="flex flex-col gap-1 rounded-xl p-4 bg-red-500/10 border border-red-500/20">
                        <div className="flex items-center gap-2 text-red-500">
                            <span className="material-symbols-outlined text-xl">warning</span>
                            <p className="text-xs font-bold uppercase tracking-wider">Status</p>
                        </div>
                        <p className="text-lg font-bold leading-tight mt-1 uppercase">{sighting.status}</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="px-4 py-6 flex flex-col gap-3">
                    <button
                        onClick={handleConfirm}
                        disabled={sighting.confirmations?.includes(userId) || sighting.user?._id === userId}
                        className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors ${sighting.user?._id === userId ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed' :
                                sighting.confirmations?.includes(userId) ? 'bg-gray-500 text-white cursor-not-allowed' :
                                    'bg-[#2ecc70] hover:bg-[#2ecc70]/90 text-white'
                            }`}
                    >
                        <span className="material-symbols-outlined">visibility</span>
                        {sighting.user?._id === userId ? 'Your Report' :
                            sighting.confirmations?.includes(userId) ? 'You Confirmed This' : 'I See It Too'}
                    </button>

                    <button
                        onClick={handleSafe}
                        disabled={sighting.safeVotes?.includes(userId) || sighting.user?._id === userId}
                        className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors border ${sighting.user?._id === userId ? 'bg-gray-200/10 dark:bg-gray-800/50 text-gray-400 border-gray-400/20 cursor-not-allowed' :
                                sighting.safeVotes?.includes(userId) ? 'bg-gray-500/10 text-gray-400 border-gray-500/30 cursor-not-allowed' :
                                    'bg-[#2ecc70]/10 hover:bg-[#2ecc70]/20 text-[#2ecc70] border-[#2ecc70]/30'
                            }`}
                    >
                        <span className="material-symbols-outlined">check_circle</span>
                        {sighting.user?._id === userId ? 'Author Cannot Vote' :
                            sighting.safeVotes?.includes(userId) ? 'Voted Safe' : 'Safe Now'}
                    </button>
                </div>
            </div>
        </div>
    );
}

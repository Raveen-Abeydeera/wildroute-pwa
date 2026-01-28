import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem('user'));
                if (!storedUser) return navigate('/login');
                const res = await axios.get(`http://localhost:5000/api/users/${storedUser.id}`);
                setProfileData(res.data);
            } catch (err) { console.error(err); } finally { setLoading(false); }
        };
        fetchProfile();
    }, [navigate]);

    if (loading) return <div className="h-screen bg-white dark:bg-[#0e191b] flex items-center justify-center text-gray-500 dark:text-white transition-colors">Loading Profile...</div>;

    const { user, stats, recentReports } = profileData;

    return (
        <div className="min-h-screen w-full bg-gray-50 dark:bg-[#0e191b] flex flex-col text-[#1a535b] dark:text-white font-sans overflow-x-hidden transition-colors duration-300">

            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center bg-white/80 dark:bg-[#0e191b]/80 backdrop-blur-md p-4 pb-2 justify-between border-b border-gray-200 dark:border-white/5">
                <button onClick={() => navigate('/dashboard')} className="flex size-12 items-center justify-start">
                    <span className="material-symbols-outlined cursor-pointer">arrow_back_ios</span>
                </button>
                <h2 className="text-lg font-bold tracking-tight flex-1 text-center">Field Profile</h2>
                <div className="w-12"></div>
            </header>

            {/* Info */}
            <section className="flex flex-col items-center p-6 gap-6">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        {/* --- FIXED AVATAR ICON --- */}
                        <div className="size-32 rounded-full border-4 border-gray-200 dark:border-[#1a535b]/20 p-1 bg-gray-100 dark:bg-[#1a535b]/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-gray-400 dark:text-[#1a535b] text-6xl">person</span>
                        </div>
                        {/* ------------------------- */}
                        <div className="absolute bottom-1 right-1 bg-[#1a535b] text-white p-1 rounded-full border-2 border-white dark:border-[#0e191b]">
                            <span className="material-symbols-outlined text-xs block">verified</span>
                        </div>
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold leading-tight">{user.fullName}</h2>
                        <p className="text-gray-500 dark:text-[#9bbbbf] font-medium">Field {user.role} • Zone A</p>
                        <p className="text-gray-400 dark:text-[#9bbbbf]/60 text-xs mt-1 uppercase tracking-widest">Points: <span className="text-[#0bda54] font-bold">{user.points}</span></p>
                    </div>
                </div>

                <div className="flex w-full gap-3">
                    <button className="flex-1 h-12 rounded-xl bg-gray-200 dark:bg-[#2a3f41] font-bold text-sm text-gray-700 dark:text-white">Edit Profile</button>
                    <button onClick={() => navigate('/settings')} className="flex-1 h-12 rounded-xl bg-[#1a535b] text-white font-bold text-sm shadow-lg">Settings</button>
                </div>
            </section>

            {/* Stats */}
            <section className="px-4 py-2">
                <div className="grid grid-cols-3 gap-3">
                    {[{ l: 'Reports', v: stats.reportCount }, { l: 'Verified', v: stats.verifiedCount }, { l: 'Zones', v: stats.zonesCount }].map((s, i) => (
                        <div key={i} className="flex flex-col gap-1 rounded-xl bg-white dark:bg-[#1a535b]/10 border border-gray-200 dark:border-white/5 p-4 items-center text-center shadow-sm">
                            <p className="text-2xl font-black">{s.v}</p>
                            <p className="text-gray-400 dark:text-[#9bbbbf] text-[10px] uppercase font-bold tracking-widest">{s.l}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Reports */}
            <section className="mt-4 pb-24 px-4 flex flex-col gap-3">
                <h3 className="text-xs font-black tracking-[0.2em] uppercase px-2 text-gray-400">My Recent Reports</h3>
                {recentReports.length === 0 ? <p className="text-center opacity-50 text-sm py-4">No reports yet.</p> : recentReports.map((report) => (
                    <div key={report._id} className="flex items-center gap-4 bg-white dark:bg-white/5 p-3 rounded-2xl border border-gray-200 dark:border-[#1a535b]/5 shadow-sm">
                        <div className="size-16 rounded-xl bg-gray-100 dark:bg-[#1a535b]/20 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-gray-400 dark:text-white">map</span>
                        </div>
                        <div className="flex flex-col justify-center overflow-hidden">
                            <div className="flex items-center justify-between mb-0.5">
                                <p className="font-bold text-sm truncate w-40">{report.behavior} Elephant(s)</p>
                                <span className="bg-[#0bda54]/10 text-[#0bda54] text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">{report.isVerified ? 'Verified' : 'Pending'}</span>
                            </div>
                            <p className="text-xs opacity-60 mb-1 truncate">Count: {report.elephantCount} • "{report.notes}"</p>
                        </div>
                    </div>
                ))}
            </section>

            {/* Bottom Nav */}
            <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[360px] h-16 bg-white/90 dark:bg-[#0e191b]/90 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 flex items-center justify-around px-6 shadow-2xl z-[100]">
                <button onClick={() => navigate('/dashboard')} className="text-gray-400 dark:text-white/50 hover:text-[#1a535b] dark:hover:text-white"><span className="material-symbols-outlined">explore</span></button>
                <button className="text-gray-400 dark:text-white/50 hover:text-[#1a535b] dark:hover:text-white"><span className="material-symbols-outlined">notifications</span></button>
                <button onClick={() => navigate('/report')} className="text-gray-400 dark:text-white/50 hover:text-[#1a535b] dark:hover:text-white"><span className="material-symbols-outlined">add_circle</span></button>
                <button className="text-[#1a535b] dark:text-white scale-110"><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span></button>
            </nav>
        </div>
    );
}

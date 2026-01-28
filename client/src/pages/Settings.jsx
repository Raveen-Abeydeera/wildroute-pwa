import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext'; // <--- Import Hook

export default function Settings() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme(); // <--- Get Theme State

    // Local toggles
    const [pushEnabled, setPushEnabled] = useState(true);
    const [alertsEnabled, setAlertsEnabled] = useState(true);

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to sign out?");
        if (confirmLogout) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    const user = JSON.parse(localStorage.getItem('user')) || { fullName: 'Ranger', role: 'Operative' };

    return (
        <div className="min-h-screen w-full bg-[#f0f2f5] dark:bg-[#0e191b] font-sans text-[#1a535b] dark:text-white select-none transition-colors duration-300">

            {/* --- HEADER --- */}
            <header className="flex items-center px-6 pt-8 pb-6 sticky top-0 z-20 bg-[#f0f2f5]/80 dark:bg-[#0e191b]/80 backdrop-blur-md transition-colors duration-300">
                <button
                    onClick={() => navigate(-1)}
                    className="bg-white dark:bg-[#162527]/80 p-2 rounded-xl border border-gray-200 dark:border-[#2a3f41]/50 hover:bg-gray-100 dark:hover:bg-[#1a535b]/20 transition-colors"
                >
                    <span className="material-symbols-outlined block text-[#1a535b] dark:text-white">arrow_back_ios_new</span>
                </button>
                <div className="flex-1 ml-4">
                    <h1 className="text-3xl font-extrabold tracking-tight uppercase italic">Settings</h1>
                    <p className="text-xs font-medium opacity-60 tracking-[0.2em] uppercase">Expedition Config</p>
                </div>
            </header>

            {/* --- CONTENT --- */}
            <div className="flex-1 px-4 pb-24 space-y-6">

                {/* DISPLAY SETTINGS (THEME TOGGLE) */}
                <section className="space-y-3">
                    <h3 className="text-xs font-bold opacity-60 uppercase tracking-[0.15em] px-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        Display
                    </h3>
                    <div className="bg-white dark:bg-[#162527]/80 backdrop-blur-md border border-gray-200 dark:border-[#2a3f41]/30 rounded-xl overflow-hidden">

                        {/* DARK MODE SWITCH */}
                        <div className="flex items-center gap-4 px-4 py-4 justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`flex items-center justify-center rounded-lg shrink-0 size-10 ${theme === 'dark' ? 'bg-purple-500/10 text-purple-400' : 'bg-yellow-500/10 text-yellow-600'}`}>
                                    <span className="material-symbols-outlined">
                                        {theme === 'dark' ? 'dark_mode' : 'light_mode'}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-medium">Dark Mode</p>
                                    <p className="text-[10px] opacity-60 uppercase tracking-tighter">
                                        {theme === 'dark' ? 'Night Reconnaissance' : 'Daylight Patrol'}
                                    </p>
                                </div>
                            </div>

                            {/* THE TOGGLE BUTTON */}
                            <div
                                onClick={toggleTheme}
                                className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors duration-300 ${theme === 'dark' ? 'bg-[#1a535b]' : 'bg-gray-300'}`}
                            >
                                <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* ... (Existing Alert Preferences) ... */}
                <section className="space-y-3">
                    <h3 className="text-xs font-bold opacity-60 uppercase tracking-[0.15em] px-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">sensors</span>
                        Alert Preferences
                    </h3>
                    <div className="bg-white dark:bg-[#162527]/80 backdrop-blur-md border border-gray-200 dark:border-[#2a3f41]/30 rounded-xl overflow-hidden divide-y divide-gray-100 dark:divide-[#2a3f41]/20">
                        {/* Push Toggle */}
                        <div className="flex items-center gap-4 px-4 py-4 justify-between">
                            <div className="flex items-center gap-4">
                                <div className="text-[#1a535b] bg-[#1a535b]/10 flex items-center justify-center rounded-lg shrink-0 size-10">
                                    <span className="material-symbols-outlined">notifications</span>
                                </div>
                                <p className="font-medium">Push Notifications</p>
                            </div>
                            <div
                                onClick={() => setPushEnabled(!pushEnabled)}
                                className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors ${pushEnabled ? 'bg-[#1a535b]' : 'bg-gray-300'}`}
                            >
                                <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${pushEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="w-full mt-4 bg-white dark:bg-[#162527]/80 backdrop-blur-md border border-red-200 dark:border-red-900/30 text-red-500 dark:text-red-400 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-red-50 transition-colors"
                >
                    Sign Out Protocol
                </button>

            </div>
        </div>
    );
}

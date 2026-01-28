import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Success() {
    const navigate = useNavigate();

    // Optional: Auto-redirect after 5 seconds
    useEffect(() => {
        const timer = setTimeout(() => navigate('/dashboard'), 5000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="relative min-h-screen w-full flex flex-col bg-gray-50 dark:bg-[#18181b] font-sans text-gray-900 dark:text-white overflow-hidden transition-colors duration-300">

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/dark-matter.png")' }}></div>

            {/* Close Button */}
            <div className="flex items-center justify-end p-6 z-10">
                <button onClick={() => navigate('/dashboard')} className="flex size-10 items-center justify-center rounded-full bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 transition-colors">
                    <span className="material-symbols-outlined text-xl text-gray-600 dark:text-white">close</span>
                </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-8 text-center z-10">

                {/* Animated Checkmark */}
                <div className="relative mb-8 group">
                    <div className="absolute inset-0 bg-[#2eb88a]/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="relative flex items-center justify-center w-32 h-32 rounded-full border-4 border-[#2eb88a] bg-white dark:bg-[#18181b] shadow-[0_0_30px_rgba(46,184,138,0.4)]">
                        <span className="material-symbols-outlined text-6xl text-[#2eb88a] font-bold animate-bounce">check_circle</span>
                    </div>
                </div>

                {/* Success Text */}
                <div className="space-y-3 mb-12">
                    <h1 className="text-3xl font-extrabold tracking-tight">Report Sent!</h1>
                    <p className="text-gray-500 dark:text-zinc-400 text-base leading-relaxed max-w-[280px] mx-auto">
                        Timer started for <span className="text-[#2eb88a] font-semibold">4 hours</span>. Your contribution keeps the community safe.
                    </p>
                </div>

                {/* Gamification Card */}
                <div className="w-full max-w-sm">
                    <div className="flex flex-col items-center gap-4 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 shadow-xl dark:shadow-[0_0_20px_rgba(46,184,138,0.1)]">
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#2eb88a]/10 mb-1">
                                <span className="material-symbols-outlined text-[#2eb88a] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                            </div>
                            <p className="text-gray-900 dark:text-white text-lg font-bold leading-tight">+10 Community Points</p>
                            <p className="text-gray-500 dark:text-zinc-500 text-sm">
                                You've earned a wildlife guardian badge.
                            </p>
                        </div>

                        <button
                            onClick={() => navigate('/profile')}
                            className="mt-2 text-xs font-bold uppercase tracking-wider text-[#2eb88a] hover:text-[#2eb88a]/80"
                        >
                            View Rewards
                        </button>
                    </div>
                </div>

            </div>

            {/* Footer Button */}
            <div className="p-6 pb-8 bg-white/80 dark:bg-[#18181b]/80 backdrop-blur-md border-t border-gray-200 dark:border-white/5">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full flex items-center justify-center rounded-2xl h-14 bg-[#2eb88a] hover:bg-[#259c75] text-white dark:text-[#18181b] text-lg font-bold tracking-tight shadow-lg transition-all active:scale-[0.98]"
                >
                    Back to Map
                    <span className="material-symbols-outlined ml-2 text-xl">map</span>
                </button>
            </div>

        </div>
    );
}

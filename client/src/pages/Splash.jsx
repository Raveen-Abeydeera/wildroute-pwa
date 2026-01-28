import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Splash() {
    const navigate = useNavigate();

    useEffect(() => {
        // Simulate loading time (3 seconds) then go to Onboarding
        const timer = setTimeout(() => {
            navigate('/onboarding');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="relative flex h-screen w-full flex-col bg-gradient-to-b from-[#138639] via-[#111712] to-[#0a0e0a] overflow-hidden font-sans">

            {/* Decorative Background Texture */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] pointer-events-none"></div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-8 z-10">

                {/* Animated Logo Container */}
                <div className="relative mb-8 group animate-pulse">
                    <div className="absolute inset-0 bg-[#138639]/20 rounded-full blur-2xl"></div>
                    <div className="w-32 h-32 flex items-center justify-center border-2 border-[#138639]/30 rounded-full relative bg-[#111712]/40 backdrop-blur-sm">
                        <span className="material-symbols-outlined text-[#138639] text-6xl">potted_plant</span>
                    </div>
                </div>

                {/* Text */}
                <div className="text-center">
                    <h1 className="text-white text-4xl font-bold tracking-tight mb-2">WildRoute</h1>
                    <p className="text-[#138639] text-sm tracking-[0.2em] uppercase font-medium">Safety in Coexistence</p>
                </div>
            </div>

            {/* Loading Indicator */}
            <div className="pb-16 flex flex-col items-center gap-6 z-10">
                <div className="w-48 px-4">
                    <div className="flex flex-col gap-3">
                        <p className="text-white/40 text-[10px] uppercase tracking-widest text-center">Initializing expedition logs...</p>
                        <div className="rounded-full bg-white/10 h-1 overflow-hidden">
                            <div className="h-full rounded-full bg-[#138639] w-1/3 animate-[loading_2s_ease-in-out_infinite]"></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

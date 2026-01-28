import { useState, useEffect } from 'react';

export default function SightingSheet({ sighting, onClose, onVerify }) {
    if (!sighting) return null;

    const calculateTimeLeft = () => {
        if (!sighting?.timestamp) return "00:00:00";
        const expiresAt = new Date(new Date(sighting.timestamp).getTime() + 4 * 60 * 60 * 1000);
        const difference = expiresAt - new Date();
        if (difference <= 0) return "EXPIRED";
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
        return () => clearInterval(timer);
    }, [sighting]);

    return (
        <div className="fixed inset-x-0 bottom-0 z-[1000] flex justify-center pointer-events-none">
            {/* 1. UPDATE BACKGROUND: White in Light Mode, Dark in Dark Mode */}
            <div className="pointer-events-auto w-full max-w-md bg-white dark:bg-[#0F1214] border-t border-gray-200 dark:border-white/10 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] p-6 pb-10 transition-colors duration-300">

                <div className="flex justify-center -mt-2 pb-4" onClick={onClose}>
                    <div className="h-1.5 w-12 rounded-full bg-gray-300 dark:bg-white/20 cursor-pointer"></div>
                </div>

                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-gray-900 dark:text-white text-2xl font-bold">Elephant Sighting</h2>
                        <p className="text-[#1a535b] dark:text-[#19cee6] text-sm mt-1 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            Reported {new Date(sighting.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                    <div className="bg-red-100 text-red-600 dark:bg-[#19cee6]/10 dark:text-[#19cee6] px-3 py-1 rounded-full text-xs font-bold border border-red-200 dark:border-[#19cee6]/20">
                        HIGH RISK
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="col-span-2 relative h-48 rounded-xl overflow-hidden group bg-gray-100 dark:bg-gray-800">
                        {sighting.imageUrl ? (
                            <img src={sighting.imageUrl} alt="Sighting" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-white/20">
                                <span className="material-symbols-outlined text-4xl">image_not_supported</span>
                                <span className="text-xs uppercase tracking-widest mt-2">No Image Evidence</span>
                            </div>
                        )}
                    </div>

                    <div className="col-span-1 bg-gray-50 dark:bg-[#1A1F24] p-4 rounded-xl border border-gray-200 dark:border-white/5">
                        <p className="text-gray-500 dark:text-white/50 text-[10px] font-bold uppercase tracking-wider mb-1">Expires In</p>
                        <span className="text-[#1a535b] dark:text-[#19cee6] text-xl font-bold font-mono">{timeLeft}</span>
                    </div>

                    <div className="col-span-1 bg-gray-50 dark:bg-[#1A1F24] p-4 rounded-xl border border-gray-200 dark:border-white/5">
                        <p className="text-gray-500 dark:text-white/50 text-[10px] font-bold uppercase tracking-wider mb-1">Status</p>
                        <span className="text-gray-900 dark:text-white text-xl font-bold">{sighting.behavior}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <button onClick={onVerify} className="w-full bg-[#19cee6] hover:bg-[#15b2c7] text-[#0F1214] font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                        <span className="material-symbols-outlined font-bold">visibility</span>
                        I SEE IT TOO (Verify)
                    </button>

                    <button onClick={onClose} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white font-bold py-4 rounded-xl border border-transparent dark:border-white/10 transition-all">
                        CLOSE
                    </button>
                </div>

            </div>
        </div>
    );
}

import { useNavigate } from 'react-router-dom';

export default function Alerts() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full bg-gray-100 dark:bg-[#17191c] font-sans text-gray-900 dark:text-white pb-24 transition-colors duration-300">
            <header className="p-6 pt-8 bg-white/90 dark:bg-[#17191c]/90 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200 dark:border-white/5">
                <h1 className="text-2xl font-bold tracking-tight">System Alerts</h1>
                <p className="text-gray-500 dark:text-white/50 text-xs uppercase tracking-widest mt-1">Real-time Updates</p>
            </header>

            <div className="p-4 space-y-4">
                <div className="bg-red-50 dark:bg-[#E04040]/10 border border-red-200 dark:border-[#E04040]/30 p-4 rounded-xl flex gap-4">
                    <span className="material-symbols-outlined text-[#E04040] text-3xl">warning</span>
                    <div>
                        <h3 className="font-bold text-[#E04040]">Corridor Active</h3>
                        <p className="text-sm text-gray-700 dark:text-white/80 mt-1">High elephant activity detected in Sector 4.</p>
                        <p className="text-[10px] text-gray-400 dark:text-white/40 mt-2 uppercase font-bold">10 mins ago</p>
                    </div>
                </div>
            </div>

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

import { useNavigate } from 'react-router-dom';

export default function Saved() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full bg-gray-100 dark:bg-[#17191c] font-sans text-gray-900 dark:text-white pb-24 transition-colors duration-300">
            <header className="p-6 pt-8 bg-white/90 dark:bg-[#17191c]/90 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200 dark:border-white/5">
                <h1 className="text-2xl font-bold tracking-tight">Saved Locations</h1>
                <p className="text-gray-500 dark:text-white/50 text-xs uppercase tracking-widest mt-1">Bookmarks & Routes</p>
            </header>

            <div className="p-4 space-y-4">
                {[1, 2].map((i) => (
                    <div key={i} className="bg-white dark:bg-[#2b2f36]/50 border border-gray-200 dark:border-white/5 p-4 rounded-xl flex items-center gap-4 shadow-sm">
                        <div className="size-16 bg-gray-100 dark:bg-white/5 rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-gray-400 dark:text-white/40">map</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg">Zone A Corridor</h3>
                            <p className="text-xs text-gray-500 dark:text-white/50">Safe route planned • 12km</p>
                        </div>
                        <button className="p-2 bg-[#19cee6]/10 rounded-full text-[#19cee6]"><span className="material-symbols-outlined">directions</span></button>
                    </div>
                ))}
            </div>

            <nav className="fixed bottom-0 left-0 right-0 z-50 pb-8 pt-4 px-6 bg-white/90 dark:bg-[#17191c]/90 backdrop-blur-xl border-t border-gray-200 dark:border-white/5">
                <div className="flex items-center justify-between max-w-md mx-auto">
                    <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100"><span className="material-symbols-outlined">explore</span></button>
                    <div className="flex flex-col items-center gap-1"><div className="bg-[#19cee6]/10 p-2 rounded-xl"><span className="material-symbols-outlined text-[#19cee6]" style={{ fontVariationSettings: "'FILL' 1" }}>bookmark</span></div></div>
                    <button onClick={() => navigate('/alerts')} className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100"><span className="material-symbols-outlined">notifications</span></button>
                    <button onClick={() => navigate('/profile')} className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100"><span className="material-symbols-outlined">account_circle</span></button>
                </div>
            </nav>
        </div>
    );
}

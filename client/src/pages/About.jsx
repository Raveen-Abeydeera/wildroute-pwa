import { useNavigate } from 'react-router-dom';

export default function About() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full bg-[#f0f2f5] dark:bg-[#0e191b] font-sans text-[#1a535b] dark:text-white transition-colors duration-300 flex flex-col">

            {/* Header */}
            <header className="flex items-center px-6 pt-8 pb-6 sticky top-0 z-20 bg-[#f0f2f5]/80 dark:bg-[#0e191b]/80 backdrop-blur-md">
                <button onClick={() => navigate(-1)} className="bg-white dark:bg-[#162527]/80 p-2 rounded-xl border border-gray-200 dark:border-[#2a3f41]/50 hover:bg-gray-100 dark:hover:bg-[#1a535b]/20 transition-colors">
                    <span className="material-symbols-outlined block">arrow_back_ios_new</span>
                </button>
                <div className="flex-1 ml-4">
                    <h1 className="text-xl font-extrabold tracking-tight uppercase">About</h1>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 px-6 pb-12 overflow-y-auto">

                {/* App Logo & Version */}
                <div className="flex flex-col items-center justify-center mb-8 mt-4">
                    <img src="/pwa-192x192.png" alt="WildRoute Logo" className="w-24 h-24 mb-4 drop-shadow-lg" />
                    <h2 className="text-2xl font-black tracking-tight text-[#1a535b] dark:text-white">WildRoute</h2>
                    <p className="text-sm font-bold opacity-60 tracking-widest uppercase mt-1">Version 1.0.0</p>
                </div>

                <div className="bg-white dark:bg-[#162527]/80 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-[#2a3f41]/30 space-y-6">
                    <section>
                        <h2 className="font-bold text-lg mb-2">Our Mission</h2>
                        <p className="text-sm opacity-80 leading-relaxed">
                            WildRoute was created to mitigate human-elephant conflict through real-time, community-driven early warnings. By connecting civilians and Wildlife Rangers, we aim to protect both human lives and our precious wildlife.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-bold text-lg mb-2">The Project</h2>
                        <p className="text-sm opacity-80 leading-relaxed">
                            Developed as a comprehensive computing project, this application leverages spatial tracking, dynamic rendering, and Progressive Web App (PWA) technologies to ensure reliability even in remote field conditions.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-bold text-lg mb-2">Support</h2>
                        <p className="text-sm opacity-80 leading-relaxed">
                            For support or system inquiries, please reach out to the Department of Wildlife Conservation or contact the development team at <a href="mailto:wildroute.2026@gmail.com" className="text-blue-500 font-bold hover:underline">support@wildroute.lk</a>.
                        </p>
                    </section>
                </div>

                <p className="text-center text-xs opacity-50 mt-8 font-medium">
                    &copy; {new Date().getFullYear()} WildRoute. All rights reserved.
                </p>
            </div>
        </div>
    );
}


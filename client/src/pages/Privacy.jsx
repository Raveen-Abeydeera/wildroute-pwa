import { useNavigate } from 'react-router-dom';

export default function Privacy() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full bg-[#f0f2f5] dark:bg-[#0e191b] font-sans text-[#1a535b] dark:text-white transition-colors duration-300 flex flex-col">

            {/* Header */}
            <header className="flex items-center px-6 pt-8 pb-6 sticky top-0 z-20 bg-[#f0f2f5]/80 dark:bg-[#0e191b]/80 backdrop-blur-md">
                <button onClick={() => navigate(-1)} className="bg-white dark:bg-[#162527]/80 p-2 rounded-xl border border-gray-200 dark:border-[#2a3f41]/50 hover:bg-gray-100 dark:hover:bg-[#1a535b]/20 transition-colors">
                    <span className="material-symbols-outlined block">arrow_back_ios_new</span>
                </button>
                <div className="flex-1 ml-4">
                    <h1 className="text-xl font-extrabold tracking-tight uppercase">Privacy Policy</h1>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 px-6 pb-12 overflow-y-auto">
                <div className="bg-white dark:bg-[#162527]/80 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-[#2a3f41]/30 space-y-6">
                    <p className="text-sm opacity-80 leading-relaxed">Last updated: March 2026</p>

                    <section>
                        <h2 className="font-bold text-lg mb-2">1. Data We Collect</h2>
                        <p className="text-sm opacity-80 leading-relaxed">
                            To provide safety alerts, we collect specific data including your account information (Name, Email, Phone Number), photographic evidence uploaded voluntarily, and real-time GPS location data when "Drive Mode" or "Reporting" features are active.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-bold text-lg mb-2">2. How We Use Your Data</h2>
                        <p className="text-sm opacity-80 leading-relaxed">
                            Your GPS location is strictly used to calculate proximity to known hazard zones and issue critical push notifications. Uploaded sighting images and coordinates are shared with the community and Wildlife Rangers to verify threats.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-bold text-lg mb-2">3. Data Sharing</h2>
                        <p className="text-sm opacity-80 leading-relaxed">
                            We do not sell your personal data to third parties. Sighting data (excluding your personal phone number) is visible on the public dashboard. Your contact information is exclusively accessible by verified Rangers for emergency contact purposes.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-bold text-lg mb-2">4. Device Permissions</h2>
                        <p className="text-sm opacity-80 leading-relaxed">
                            The app requires access to your device's Camera (for evidence upload), Location Services (for proximity alerts), and Wake Lock API (to keep the screen active during Drive Mode). You can revoke these permissions at any time via your device settings.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}

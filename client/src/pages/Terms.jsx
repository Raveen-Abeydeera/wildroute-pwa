import { useNavigate } from 'react-router-dom';

export default function Terms() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full bg-[#f0f2f5] dark:bg-[#0e191b] font-sans text-[#1a535b] dark:text-white transition-colors duration-300 flex flex-col">

            {/* Header */}
            <header className="flex items-center px-6 pt-8 pb-6 sticky top-0 z-20 bg-[#f0f2f5]/80 dark:bg-[#0e191b]/80 backdrop-blur-md">
                <button onClick={() => navigate(-1)} className="bg-white dark:bg-[#162527]/80 p-2 rounded-xl border border-gray-200 dark:border-[#2a3f41]/50 hover:bg-gray-100 dark:hover:bg-[#1a535b]/20 transition-colors">
                    <span className="material-symbols-outlined block">arrow_back_ios_new</span>
                </button>
                <div className="flex-1 ml-4">
                    <h1 className="text-xl font-extrabold tracking-tight uppercase">Terms & Conditions</h1>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 px-6 pb-12 overflow-y-auto">
                <div className="bg-white dark:bg-[#162527]/80 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-[#2a3f41]/30 space-y-6">
                    <p className="text-sm opacity-80 leading-relaxed">Last updated: March 2026</p>

                    <section>
                        <h2 className="font-bold text-lg mb-2">1. Acceptance of Terms</h2>
                        <p className="text-sm opacity-80 leading-relaxed">
                            By accessing and using the WildRoute application, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not use our service.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-bold text-lg mb-2">2. User Safety and Responsibility</h2>
                        <p className="text-sm opacity-80 leading-relaxed">
                            WildRoute is intended as a community-driven early warning system. <strong>You must not rely solely on this application for your personal safety.</strong> Always exercise caution in wildlife zones. Do not actively approach or provoke wildlife to capture images for this application.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-bold text-lg mb-2">3. Accuracy of Information</h2>
                        <p className="text-sm opacity-80 leading-relaxed">
                            While we strive to provide accurate real-time data, sightings are user-generated. We do not guarantee the absolute accuracy, completeness, or timeliness of the location data or alerts provided by the app.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-bold text-lg mb-2">4. User Account and Data</h2>
                        <p className="text-sm opacity-80 leading-relaxed">
                            You are responsible for maintaining the confidentiality of your account. You agree to provide an accurate emergency contact number upon registration. Abuse of the reporting system (false sightings) will result in immediate account termination.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}

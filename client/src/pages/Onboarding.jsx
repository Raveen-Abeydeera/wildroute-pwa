import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const slides = [
    {
        id: 1,
        icon: 'security',
        title: 'Stay Safe',
        description: 'Real-time monitoring and safety alerts for elephant-dense regions to protect both humans and wildlife.',
        image: 'https://images.unsplash.com/photo-1581852017103-68accd557203?q=80&w=1000&auto=format&fit=crop'
    },
    {
        id: 2,
        icon: 'alt_route',
        title: 'Smart Routing',
        description: 'Avoid the red, follow the green. Our system reroutes you around active elephant crossings.',
        image: 'https://images.unsplash.com/photo-1544666324-460d3d664c01?q=80&w=1000&auto=format&fit=crop'
    },
    {
        id: 3,
        icon: 'share_location',
        title: 'Community Driven',
        description: 'Report sightings to earn points and help fellow rangers navigate safely.',
        image: 'https://images.unsplash.com/photo-1503919005314-30d93d07d823?q=80&w=1000&auto=format&fit=crop'
    }
];

export default function Onboarding() {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            navigate('/signup'); // Finish onboarding -> Go to Sign Up
        }
    };

    return (
        <div className="relative h-screen w-full flex flex-col bg-white dark:bg-[#101214] font-sans text-gray-900 dark:text-white overflow-hidden transition-colors duration-300">

            {/* Top Bar */}
            <div className="flex items-center justify-between p-6 z-20">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#19664d] rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-lg">nature</span>
                    </div>
                    <span className="text-xs font-bold tracking-widest uppercase text-gray-500 dark:opacity-70">WildRoute</span>
                </div>
                <button onClick={() => navigate('/signup')} className="text-gray-400 dark:text-[#9bbbbf] text-sm font-bold hover:text-[#19664d] dark:hover:text-white transition-colors">
                    Skip
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col justify-center px-6 z-10 relative">

                {/* Image Card */}
                <div className="relative w-full aspect-[4/5] bg-gray-100 dark:bg-[#1B1E20] border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl mb-8 group">
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-in-out"
                        style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent dark:from-[#101214] dark:via-transparent dark:to-transparent"></div>
                    </div>

                    {/* Floating Badge */}
                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-[#19664d]/90 backdrop-blur-md px-3 py-1 rounded-full border border-gray-200 dark:border-white/20 shadow-sm">
                        <span className="text-[10px] font-bold tracking-tighter uppercase flex items-center gap-1 text-[#19664d] dark:text-white">
                            <span className="material-symbols-outlined text-xs">{slides[currentSlide].icon}</span>
                            Feature {currentSlide + 1}
                        </span>
                    </div>
                </div>

                {/* Text Content */}
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-extrabold tracking-tight transition-all duration-300">
                        {slides[currentSlide].title}
                    </h2>
                    <p className="text-gray-500 dark:text-[#9bbbbf] text-sm leading-relaxed max-w-xs mx-auto min-h-[60px]">
                        {slides[currentSlide].description}
                    </p>
                </div>

                {/* Dots Indicator */}
                <div className="flex w-full justify-center gap-2 py-8">
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            className={`h-1.5 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-8 bg-[#19664d]' : 'w-2 bg-gray-300 dark:bg-[#3c595d]'}`}
                        ></div>
                    ))}
                </div>

                {/* Action Button */}
                <button
                    onClick={handleNext}
                    className="w-full bg-[#19664d] hover:bg-[#14523d] text-white font-bold py-4 rounded-xl shadow-xl shadow-[#19664d]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mb-8"
                >
                    {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
                    <span className="material-symbols-outlined text-xl">arrow_forward</span>
                </button>

            </div>
        </div>
    );
}

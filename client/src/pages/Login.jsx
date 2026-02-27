import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isRangerLogin, setIsRangerLogin] = useState(false); // Toggle state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Dynamic Styles based on Role
  const themeColor = isRangerLogin ? 'bg-blue-900' : 'bg-[#1a535b]';
  const themeColorHover = isRangerLogin ? 'hover:bg-blue-800' : 'hover:bg-[#154249]';
  const themeRing = isRangerLogin ? 'focus:ring-blue-900' : 'focus:ring-[#1a535b]';
  const themeText = isRangerLogin ? 'text-blue-900' : 'text-[#1a535b]';
  const themeBorder = isRangerLogin ? 'dark:border-blue-900/30' : 'dark:border-[#1a535b]/30';

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Ranger Domain Validation Logic
    if (isRangerLogin && !formData.email.endsWith('@slwildlife.lk')) {
      setError('Ranger login requires an official @slwildlife.lk email address.');
      setLoading(false);
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://wildroute-pwa.onrender.com';
      const res = await axios.post(`${API_URL}/api/auth/login`, formData);
      const data = res.data;

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user)); // Store full user object including role

      // Redirect based on the role returned from Auth Routes
      // Note: Backend returns role in data.user.role
      if (data.user.role === 'ranger') {
        navigate('/ranger-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    // 1. UPDATE CONTAINER COLORS
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 overflow-hidden bg-gray-50 dark:bg-[#0e191b] font-sans text-gray-900 dark:text-white transition-colors duration-300">

      {/* Background Nature Pattern (Visible mainly in Dark Mode or low opacity in Light) */}
      <div className="absolute inset-0 opacity-10 dark:opacity-40 pointer-events-none" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=1000&auto=format&fit=crop")', backgroundSize: 'cover' }}></div>
      <div className={`absolute top-[-10%] right-[-10%] w-64 h-64 ${isRangerLogin ? 'bg-blue-900/10' : 'bg-[#1a535b]/10'} dark:bg-opacity-20 rounded-full blur-[100px] transition-colors duration-500`}></div>
      <div className={`absolute bottom-[-5%] left-[-5%] w-80 h-80 ${isRangerLogin ? 'bg-blue-600/10' : 'bg-[#81b29a]/10'} dark:bg-opacity-10 rounded-full blur-[100px] transition-colors duration-500`}></div>

      <div className="relative w-full max-w-[420px] z-10">
        <div className="flex flex-col items-center mb-10">
          <div className={`w-20 h-20 ${themeColor} rounded-xl flex items-center justify-center mb-6 shadow-lg overflow-hidden transition-colors duration-300`}>
            {isRangerLogin ? (
              <span className="material-symbols-outlined text-white text-[48px]">local_police</span>
            ) : (
              <img src="/pwa-192x192.png" alt="WildRoute" className="w-[52px] h-[52px] object-contain drop-shadow-md" />
            )}
          </div>
          <h1 className="text-gray-900 dark:text-white tracking-tight text-4xl font-extrabold leading-tight text-center">
            {isRangerLogin ? 'Ranger Portal' : 'Welcome back'}
          </h1>
          <p className="text-gray-500 dark:text-[#81b29a] text-base mt-2 text-center max-w-[280px]">
            {isRangerLogin ? 'Department of Wildlife Conservation' : 'Monitor movement. Ensure safety.'}
          </p>
        </div>

        {/* 2. UPDATE CARD COLORS */}
        <div className={`bg-white/80 dark:bg-[#0e191b]/70 backdrop-blur-md border border-gray-200 ${themeBorder} rounded-2xl p-8 shadow-2xl transition-all duration-300`}>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 dark:bg-red-500/20 dark:border-red-500/50 dark:text-red-200 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col gap-2">
              <label className="text-gray-600 dark:text-white/80 text-sm font-medium px-1">Email Address</label>
              <input
                name="email" type="email" required onChange={handleChange}
                className={`w-full rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 ${themeRing} border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/5 h-14 placeholder:text-gray-400 dark:placeholder:text-white/30 px-4 transition-all`}
                placeholder={isRangerLogin ? "officer@slwildlife.lk" : "ranger@wildlife.org"}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-gray-600 dark:text-white/80 text-sm font-medium">Password</label>
              <input
                name="password" type="password" required onChange={handleChange}
                className={`w-full rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 ${themeRing} border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/5 h-14 placeholder:text-gray-400 dark:placeholder:text-white/30 px-4 transition-all`}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className={`w-full ${themeColor} ${themeColorHover} text-white font-bold py-4 rounded-lg mt-4 shadow-lg shadow-opacity-20 transition-all active:scale-[0.98] disabled:opacity-50`}
            >
              {loading ? 'Verifying...' : (isRangerLogin ? 'Access Dashboard' : 'Sign In')}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10 flex flex-col items-center gap-3">
            {/* Ranger Toggle Button */}
            <button
              onClick={() => { setIsRangerLogin(!isRangerLogin); setError(''); }}
              className={`text-sm font-bold ${themeText} hover:underline transition-colors`}
            >
              {isRangerLogin ? '← Back to Public Login' : 'Are you a Ranger?'}
            </button>

            {!isRangerLogin && (
              <p className="text-gray-500 dark:text-white/50 text-sm">
                New to the expedition?
                <Link to="/signup" className={`text-[#1a535b] dark:text-[#81b29a] font-bold ml-1 hover:underline`}>Join us</Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
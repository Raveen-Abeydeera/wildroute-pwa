import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // --- FIXED: Use the correct API URL ---
      const apiUrl = import.meta.env.VITE_API_URL || 'https://wildroute-pwa.onrender.com';
      const res = await axios.post(`${apiUrl}/api/auth/login`, formData);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      console.error(err); // Good for debugging
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 overflow-hidden bg-gray-50 dark:bg-[#0e191b] font-sans text-gray-900 dark:text-white transition-colors duration-300">

      <div className="absolute inset-0 opacity-10 dark:opacity-40 pointer-events-none" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=1000&auto=format&fit=crop")', backgroundSize: 'cover' }}></div>
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-[#1a535b]/10 dark:bg-[#1a535b]/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-80 h-80 bg-[#81b29a]/10 dark:bg-[#81b29a]/10 rounded-full blur-[100px]"></div>

      <div className="relative w-full max-w-[420px] z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-[#1a535b] rounded-xl flex items-center justify-center mb-6 shadow-lg">
            <span className="material-symbols-outlined text-white text-[48px]">eco</span>
          </div>
          <h1 className="text-gray-900 dark:text-white tracking-tight text-4xl font-extrabold leading-tight text-center">Welcome back</h1>
          <p className="text-gray-500 dark:text-[#81b29a] text-base mt-2 text-center max-w-[280px]">
            Monitor movement. Ensure safety.
          </p>
        </div>

        <div className="bg-white/80 dark:bg-[#0e191b]/70 backdrop-blur-md border border-gray-200 dark:border-[#1a535b]/30 rounded-2xl p-8 shadow-2xl">

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
                className="w-full rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1a535b] border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/5 h-14 placeholder:text-gray-400 dark:placeholder:text-white/30 px-4 transition-all"
                placeholder="ranger@wildlife.org"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-gray-600 dark:text-white/80 text-sm font-medium">Password</label>
              <input
                name="password" type="password" required onChange={handleChange}
                className="w-full rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1a535b] border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/5 h-14 placeholder:text-gray-400 dark:placeholder:text-white/30 px-4 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-[#1a535b] hover:bg-[#154249] text-white font-bold py-4 rounded-lg mt-4 shadow-lg shadow-[#1a535b]/20 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-gray-500 dark:text-white/50 text-sm">
              New to the expedition?
              <Link to="/signup" className="text-[#1a535b] dark:text-[#81b29a] font-bold ml-1 hover:underline">Join us</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

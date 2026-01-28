import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullName: '', email: '', mobileNumber: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // --- FIXED: Use Render URL as the fallback (Not Localhost!) ---
      const apiUrl = import.meta.env.VITE_API_URL || 'https://wildroute-pwa.onrender.com';
      
      console.log("Signing up to:", apiUrl); 
      await axios.post(`${apiUrl}/api/auth/register`, formData);
      
      navigate('/login');
    } catch (err) {
      console.error("Signup Error:", err);
      
      // 1. Backend Error Message (e.g. "User already exists")
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } 
      // 2. Backend Error Key (e.g. Server Crashed)
      else if (err.response?.data?.error) {
        setError(err.response.data.error);
      }
      // 3. Network Error (e.g. Phone can't reach Internet)
      else {
        setError('Network Error: Could not connect to server.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-[#101214] px-6 transition-colors duration-300">
      <div className="w-full max-w-md space-y-8">

        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Join the Force</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Create your Ranger profile</p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#16181c] p-8 shadow-xl dark:shadow-none border border-gray-100 dark:border-gray-800">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* ERROR BOX */}
            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-center text-sm text-red-600 dark:text-red-400 break-words font-medium border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">Full Name</label>
              <input type="text" required className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#1d2125] p-3 text-gray-900 dark:text-white outline-none focus:border-[#19664d] focus:ring-1 focus:ring-[#19664d]" placeholder="John Doe" onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">Email</label>
              <input type="email" required className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#1d2125] p-3 text-gray-900 dark:text-white outline-none focus:border-[#19664d] focus:ring-1 focus:ring-[#19664d]" placeholder="ranger@wildroute.com" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">Mobile Number</label>
              <input type="tel" required className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#1d2125] p-3 text-gray-900 dark:text-white outline-none focus:border-[#19664d] focus:ring-1 focus:ring-[#19664d]" placeholder="0771234567" onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })} />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">Password</label>
              <input type="password" required className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#1d2125] p-3 text-gray-900 dark:text-white outline-none focus:border-[#19664d] focus:ring-1 focus:ring-[#19664d]" placeholder="••••••••" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            </div>

            <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#19664d] py-3.5 font-bold text-white shadow-lg hover:bg-[#14523d] active:scale-[0.98] disabled:opacity-50">
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account? <button onClick={() => navigate('/login')} className="font-bold text-[#19664d] hover:underline">Log In</button>
          </p>
        </div>
      </div>
    </div>
  );
}

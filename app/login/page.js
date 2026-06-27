'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', rememberMe: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message);
      
      login(data.user, data.accessToken);
      router.push('/');
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-900">
      <div className="bg-slate-800 p-8 rounded-xl w-[360px] text-slate-100 shadow-xl border border-slate-700">
        <h2 className="text-center mb-6 text-2xl font-bold text-sky-400">DevPulse Login</h2>
        
        {error && <p className="!text-red-400 mb-4 text-center text-sm">{error}</p>}
        
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            className="w-full p-3 mb-4 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-colors"
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-3 mb-4 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-colors"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <label className="flex items-center mb-4 text-sm cursor-pointer text-slate-300 hover:text-white transition-colors">
            <input
              type="checkbox"
              name="rememberMe"
              checked={form.rememberMe}
              onChange={handleChange}
              className="mr-2 rounded border-slate-700 bg-slate-900 text-sky-400 focus:ring-sky-400 focus:ring-offset-slate-800"
            />
            Remember Me
          </label>
          <button
            className="w-full p-3 bg-sky-400 hover:bg-sky-500 text-slate-900 border-none rounded-lg font-bold cursor-pointer transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="mt-6 flex flex-col gap-3 text-center text-[13px]">
          <Link href="/forgot-password" className="text-slate-400 hover:text-slate-300 transition-colors">
            Forgot password?
          </Link>
          <p className="text-slate-400 m-0">
            No account? <Link href="/register" className="text-white hover:text-sky-400 transition-colors font-medium">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

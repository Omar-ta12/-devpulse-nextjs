'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';

const passwordRules = (password) => [
  { test: password.length >= 8, text: 'At least 8 characters' },
  { test: /[A-Z]/.test(password), text: 'One uppercase letter' },
  { test: /[0-9]/.test(password), text: 'One number' },
  { test: /[!@#$%^&*]/.test(password), text: 'One special character (!@#$%^&*)' },
];

const RegisterPage = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const failedRules = passwordRules(form.password).filter(r => !r.test);
    if (failedRules.length > 0) return setError(failedRules[0].text);

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
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

  const rules = passwordRules(form.password);

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-900">
      <div className="bg-slate-800 p-8 rounded-xl w-[360px] text-slate-100 shadow-xl border border-slate-700">
        <h2 className="text-center mb-6 text-2xl font-bold text-sky-400">Create Account</h2>
        
        {error && <p className="!text-red-400 mb-4 text-center text-sm">{error}</p>}
        
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            className="w-full p-3 mb-4 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-colors"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-3 mb-4 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-colors"
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <div className="relative mb-2">
            <input
              className="w-full p-3 pr-16 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-colors"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              onFocus={() => setShowRules(true)}
              required
            />
            <span
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-200 text-[13px] select-none transition-colors"
            >
              {showPassword ? 'Hide' : 'Show'}
            </span>
          </div>

          {showRules && (
            <ul className="list-none p-0 m-0 mb-4 text-[12px] flex flex-col gap-1">
              {rules.map((rule, i) => (
                <li key={i} className={`flex items-center gap-1.5 ${rule.test ? '!text-green-400' : '!text-slate-400'}`}>
                  <span>{rule.test ? '✓' : '○'}</span> {rule.text}
                </li>
              ))}
            </ul>
          )}

          <button
            className="w-full p-3 mt-2 bg-sky-400 hover:bg-sky-500 text-slate-900 border-none rounded-lg font-bold cursor-pointer transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <p className="mt-6 text-center text-[13px] text-slate-300">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-white font-bold underline underline-offset-4 hover:text-sky-400 transition-colors"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

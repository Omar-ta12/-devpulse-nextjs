'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

const passwordRules = (password) => [
  { test: password.length >= 8, text: 'At least 8 characters' },
  { test: /[A-Z]/.test(password), text: 'One uppercase letter' },
  { test: /[0-9]/.test(password), text: 'One number' },
  { test: /[!@#$%^&*]/.test(password), text: 'One special character (!@#$%^&*)' },
];

const ResetPasswordPage = () => {
  const params = useParams();
  const token = params.token;
  const router = useRouter();
  
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const failedRules = passwordRules(password).filter(r => !r.test);
    if (failedRules.length > 0) return setError(failedRules[0].text);

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message);
      
      setMessage(data.message);
      setTimeout(() => router.push('/login'), 2000);
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const rules = passwordRules(password);

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-900">
      <div className="bg-slate-800 p-8 rounded-xl w-[360px] text-slate-100 shadow-xl border border-slate-700">
        <h2 className="text-center mb-6 text-2xl font-bold text-sky-400">Reset Password</h2>
        
        {error && <p className="!text-red-400 mb-4 text-center text-sm">{error}</p>}
        {message && <p className="!text-green-400 mb-4 text-center text-sm">{message} Redirecting to login...</p>}
        
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="relative mb-2">
            <input
              className="w-full p-3 pr-16 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-colors"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

'use client';

import { useState } from 'react';
import Link from 'next/link';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message);
      setMessage(data.message);
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-900">
      <div className="bg-slate-800 p-8 rounded-xl w-[360px] text-slate-100 shadow-xl border border-slate-700">
        <h2 className="text-center mb-2 text-2xl font-bold text-sky-400">Forgot Password</h2>
        <p className="text-slate-400 text-sm text-center mb-6 leading-relaxed">
          Enter your email and we'll send you a reset link.
        </p>
        
        {error && <p className="!text-red-400 mb-4 text-center text-sm">{error}</p>}
        {message && <p className="!text-green-400 mb-4 text-center text-sm">{message}</p>}
        
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            className="w-full p-3 mb-4 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-colors"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            className="w-full p-3 bg-sky-400 hover:bg-sky-500 text-slate-900 border-none rounded-lg font-bold cursor-pointer transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        
        <p className="mt-5 text-center text-sm">
          <Link href="/login" className="text-sky-400 hover:text-sky-300 transition-colors">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

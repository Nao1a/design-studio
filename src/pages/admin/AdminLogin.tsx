import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, ArrowLeft, KeyRound, Check } from 'lucide-react';
import dnaBitmap from '../../assets/dna.jpeg';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccessMsg('');

      await login({ email, password });
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    setEmail('admin@aau-designstudio.edu.et');
    setPassword('AdminPass123!');
  };

  return (
    <div className="min-h-screen bg-[#F4F4F6] text-slate-900 flex items-center justify-center p-4 sm:p-8 lg:p-12 font-sans selection:bg-slate-900 selection:text-white">
      {/* Top back navigation */}
      <div className="fixed top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-colors bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Public Site
        </Link>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-200/90 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left Form Column */}
        <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative z-10 bg-white">
          {/* Minimalist Logo Mark */}
          <div className="flex items-center gap-2 mb-8">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-slate-950">
              <rect x="3" y="4" width="7" height="16" rx="2" fill="currentColor" />
              <rect x="14" y="8" width="7" height="12" rx="2" fill="currentColor" />
            </svg>
            <span className="font-display font-bold text-sm tracking-tight text-slate-900 uppercase">
              AAU BioDesign Studio
            </span>
          </div>

          {/* Heading & Subtitle */}
          <div className="mb-8">
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-950 tracking-tight mb-2">
              Sign In
            </h1>
            <p className="text-sm text-slate-500 font-normal">
              Continue to access your control dashboard
            </p>
          </div>

          {/* Error & Success Messages */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-slate-700" />
              <p>{error}</p>
            </div>
          )}
          {successMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 text-xs flex items-start gap-2.5">
              <Check className="w-4 h-4 shrink-0 mt-0.5 text-slate-700" />
              <p>{successMsg}</p>
            </div>
          )}

          {/* Institutional SSO / Quick Fill Option */}
          <div className="space-y-2.5 mb-6">
            <button
              type="button"
              onClick={handleQuickFill}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-slate-200/90 hover:border-slate-300 bg-white text-xs font-semibold text-slate-800 transition-all shadow-2xs hover:bg-slate-50/80 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-slate-600" />
              <span>Auto-fill Demo Admin Login</span>
            </button>
          </div>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Or Continue With Credentials
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:border-slate-800 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => alert('Default admin password is: AdminPass123!')}
                  className="text-[11px] font-medium text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:border-slate-800 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-full bg-slate-950 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Right Column: User's Bitmap Dither DNA Picture (Pure edge-to-edge with no caption) */}
        <div className="hidden lg:flex lg:col-span-6 bg-black relative overflow-hidden items-center justify-center select-none border-l border-slate-900">
          <img
            src={dnaBitmap}
            alt="Biomedical DNA Bitmap Dither"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>
    </div>
  );
};

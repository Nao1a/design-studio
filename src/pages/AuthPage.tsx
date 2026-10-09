import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  AlertCircle,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  Clock,
  Lock,
  Mail,
  User,
  Hash,
} from 'lucide-react';
import dnaBitmap from '../assets/dna.jpeg';

export const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialTab =
    searchParams.get('tab') === 'register' || searchParams.get('tab') === 'signup'
      ? 'register'
      : searchParams.get('tab') === 'admin'
      ? 'admin'
      : 'login';

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'admin'>(initialTab);

  const { login, register, isAdmin, isMember } = useAuth();
  const navigate = useNavigate();

  // Member Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Admin Login State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Member Sign Up State (clean: name, studentId, email, password, confirmPassword)
  const [regForm, setRegForm] = useState({
    name: '',
    studentId: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Feedback states
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPendingNotice, setIsPendingNotice] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  // If already logged in, redirect appropriately
  useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    } else if (isMember) {
      navigate('/portal');
    }
  }, [isAdmin, isMember, navigate]);

  // Handle Member Login
  const handleMemberLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMessage('');
      setIsPendingNotice(false);

      await login({ email: loginEmail, password: loginPassword });
      navigate('/portal');
    } catch (err: any) {
      const response = err.response?.data;
      if (response?.isPending) {
        setIsPendingNotice(true);
        setErrorMessage(
          response.message ||
            'Your account is pending verification by the studio administrator. You will be able to log in once approved.'
        );
      } else {
        setErrorMessage(response?.message || err.message || 'Invalid email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Admin Login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMessage('');
      setIsPendingNotice(false);

      await login({ email: adminEmail, password: adminPassword });
      navigate('/admin');
    } catch (err: any) {
      const response = err.response?.data;
      setErrorMessage(response?.message || err.message || 'Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Member Sign Up
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMessage('');
      setIsPendingNotice(false);

      if (!regForm.name || !regForm.studentId || !regForm.email || !regForm.password) {
        setErrorMessage('Please fill in all required fields.');
        setLoading(false);
        return;
      }

      if (regForm.password !== regForm.confirmPassword) {
        setErrorMessage('Passwords do not match. Please re-enter your password.');
        setLoading(false);
        return;
      }

      await register({
        name: regForm.name,
        studentId: regForm.studentId,
        email: regForm.email,
        password: regForm.password,
      });

      setRegSuccess(true);
    } catch (err: any) {
      const response = err.response?.data;
      setErrorMessage(response?.message || err.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminQuickFill = () => {
    setAdminEmail('admin@aau-designstudio.edu.et');
    setAdminPassword('AdminPass123!');
  };

  return (
    <div className="min-h-screen bg-[#F4F4F6] text-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans selection:bg-slate-900 selection:text-white">
      {/* Top back navigation */}
      <div className="fixed top-5 left-5 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-600 hover:text-slate-950 transition-colors bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200/90 shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Public Site
        </Link>
      </div>

      {/* Main Card Container */}
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-200/90 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left Column: Forms */}
        <div className="lg:col-span-7 p-7 sm:p-10 lg:p-12 flex flex-col justify-center relative z-10 bg-white">
          {/* Studio Brand Header */}
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-7 h-7 rounded-lg bg-slate-950 text-white flex items-center justify-center font-bold text-xs tracking-wider">
              AAU
            </div>
            <div>
              <span className="font-display font-bold text-sm tracking-tight text-slate-900 block leading-tight">
                Biomedical Design Studio
              </span>
              <p className="text-[11px] text-slate-500 font-medium">Addis Ababa University</p>
            </div>
          </div>

          {/* Portal Switcher Tabs */}
          <div className="flex items-center p-1 bg-slate-100/90 rounded-2xl mb-6 border border-slate-200/70">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMessage('');
                setIsPendingNotice(false);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMessage('');
                setIsPendingNotice(false);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('admin');
                setErrorMessage('');
                setIsPendingNotice(false);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3 h-3" />
              Admin
            </button>
          </div>

          {/* Alert / Notice Display */}
          {errorMessage && (
            <div
              className={`mb-5 p-4 rounded-2xl text-xs flex items-start gap-3 border ${
                isPendingNotice
                  ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                  : 'bg-rose-50/80 border-rose-200 text-rose-900'
              }`}
            >
              {isPendingNotice ? (
                <Clock className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              )}
              <div>
                <p className="font-semibold mb-0.5">
                  {isPendingNotice ? 'Account Verification Pending' : 'Error'}
                </p>
                <p className="leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 1: MEMBER LOGIN */}
          {/* ========================================================= */}
          {activeTab === 'login' && (
            <div>
              <div className="mb-6">
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-950 tracking-tight mb-1.5">
                  Member Sign In
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-normal">
                  Log in to submit biomedical project ideas, track proposal feedback, and request studio resources.
                </p>
              </div>

              <form onSubmit={handleMemberLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:border-slate-800 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700">Password</label>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:border-slate-800 transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-full bg-slate-950 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </button>
                </div>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Already a member but don't have an online account?</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="font-semibold text-slate-900 hover:underline cursor-pointer"
                >
                  Sign Up →
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: MEMBER SIGN UP (Full Name, ID Number, Email, Password, Confirm Password) */}
          {/* ========================================================= */}
          {activeTab === 'register' && (
            <div>
              {regSuccess ? (
                <div className="py-6 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-2xl text-slate-900 mb-2">
                      Sign Up Successful!
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                      Your account has been created successfully.
                      <strong className="block text-slate-900 mt-2 font-semibold">
                        Your account must be verified by the Studio Administrator before you can log in.
                      </strong>
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left text-xs max-w-md mx-auto space-y-1.5 text-slate-700">
                    <p>
                      <strong>Member Name:</strong> {regForm.name}
                    </p>
                    <p>
                      <strong>ID Number:</strong> {regForm.studentId}
                    </p>
                    <p>
                      <strong>Email:</strong> {regForm.email}
                    </p>
                    <p>
                      <strong>Status:</strong>{' '}
                      <span className="inline-flex items-center gap-1 text-amber-700 font-semibold px-2 py-0.5 rounded-full bg-amber-100/70 text-[11px]">
                        <Clock className="w-3 h-3" /> Pending Admin Verification
                      </span>
                    </p>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setRegSuccess(false);
                        setActiveTab('login');
                      }}
                      className="px-6 py-2.5 rounded-full bg-slate-950 text-white text-xs font-semibold hover:bg-black transition-colors cursor-pointer"
                    >
                      Go to Sign In
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-5">
                    <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-950 tracking-tight mb-1">
                      Member Sign Up
                    </h1>
                    <p className="text-xs text-slate-500 font-normal">
                      Register your member account. Once submitted, your account will be verified by the admin before login is permitted.
                    </p>
                  </div>

                  <form onSubmit={handleRegister} className="space-y-3.5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Abebe Bikila"
                          value={regForm.name}
                          onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-800"
                        />
                      </div>
                    </div>

                    {/* ID Number */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        ID Number * <span className="text-slate-400 font-normal">(e.g. UGR/1234/12)</span>
                      </label>
                      <div className="relative">
                        <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. UGR/1234/12"
                          value={regForm.studentId}
                          onChange={(e) => setRegForm({ ...regForm, studentId: e.target.value })}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-800"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="email"
                          required
                          placeholder="Enter your email address"
                          value={regForm.email}
                          onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-800"
                        />
                      </div>
                    </div>

                    {/* Password & Confirm Password */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Password *</label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                          <input
                            type="password"
                            required
                            placeholder="Create password"
                            value={regForm.password}
                            onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-800"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password *</label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                          <input
                            type="password"
                            required
                            placeholder="Confirm password"
                            value={regForm.confirmPassword}
                            onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-800"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-[11px] text-slate-600 flex items-start gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-700 shrink-0 mt-0.5" />
                      <span>
                        Note: After sign up, the studio administrator must verify your account before you will be able to log in.
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-full bg-slate-950 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                  </form>

                  <div className="mt-4 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
                    <span>Already have your account verified? </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('login')}
                      className="font-semibold text-slate-900 hover:underline cursor-pointer"
                    >
                      Sign In here
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: ADMIN LOGIN */}
          {/* ========================================================= */}
          {activeTab === 'admin' && (
            <div>
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 text-white text-[11px] font-semibold mb-2">
                  <Shield className="w-3 h-3 text-slate-300" />
                  Administrative Access Only
                </div>
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-950 tracking-tight mb-1.5">
                  Faculty & Admin CMS
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-normal">
                  Verify member accounts, evaluate student proposals, and update studio content.
                </p>
              </div>

              {/* Institutional Quick-Fill */}
              <div className="mb-5">
                <button
                  type="button"
                  onClick={handleAdminQuickFill}
                  className="w-full flex items-center justify-center gap-2.5 px-4 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100/80 text-xs font-semibold text-slate-800 transition-all cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5 text-slate-600" />
                  <span>Auto-fill Demo Admin Login</span>
                </button>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Admin Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="admin@aau-designstudio.edu.et"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:border-slate-800 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Admin Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:border-slate-800 transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-full bg-slate-950 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? 'Authenticating Admin...' : 'Sign In to Admin CMS'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right Column: DNA Bitmap */}
        <div className="hidden lg:flex lg:col-span-5 bg-black relative overflow-hidden items-center justify-center select-none border-l border-slate-900">
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

export default AuthPage;

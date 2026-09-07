import React, { useEffect, useRef, useState } from 'react';
import {
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  ArrowLeft,
  KeyRound,
  Check,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import { ThemeToggle } from '../common/ThemeToggle';

// ---------------------------------------------------------------------------
// Google Sign-In
//
// We deliberately do NOT use google.accounts.id.prompt() (One Tap). Google
// silently suppresses One Tap after a user dismisses it once, when third-party
// cookies are blocked, and in private windows - the button then appears to do
// nothing at all. google.accounts.id.renderButton() has none of those limits,
// so we render Google's real button and lay it invisibly over our styled one.
// ---------------------------------------------------------------------------

const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim();
const GOOGLE_CLIENT_ID_VALID = /^[0-9A-Za-z_-]+\.apps\.googleusercontent\.com$/.test(GOOGLE_CLIENT_ID);
const GSI_SRC = 'https://accounts.google.com/gsi/client';

let gsiPromise: Promise<void> | null = null;

const loadGoogleScript = (): Promise<void> => {
  if (gsiPromise) return gsiPromise;
  gsiPromise = new Promise<void>((resolve, reject) => {
    if ((window as any).google?.accounts?.id) { resolve(); return; }
    const id = 'google-gsi-script';
    let script = document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = id;
      script.src = GSI_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script.addEventListener('load', () => resolve(), { once: true });
    script.addEventListener(
      'error',
      () => {
        gsiPromise = null; // allow a retry on the next mount
        reject(new Error('Google Identity Services could not be loaded. Check your internet connection or ad blocker.'));
      },
      { once: true }
    );
    if ((window as any).google?.accounts?.id) resolve();
  });
  return gsiPromise;
};

interface GoogleAuthButtonProps {
  theme: string;
  label?: string;
  onCredential: (credential: string) => void;
  onError: (message: string) => void;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ theme, label = 'Continue with Google', onCredential, onError }) => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  // Keep the latest callbacks without re-running the effect on every render.
  const callbacksRef = useRef({ onCredential, onError });
  callbacksRef.current = { onCredential, onError };

  useEffect(() => {
    let cancelled = false;

    if (!GOOGLE_CLIENT_ID) {
      setStatus('error');
      setErrorMessage('Google Sign-In is not configured. Add VITE_GOOGLE_CLIENT_ID to your .env (and to Vercel), then rebuild.');
      return;
    }
    if (!GOOGLE_CLIENT_ID_VALID) {
      setStatus('error');
      setErrorMessage('VITE_GOOGLE_CLIENT_ID is invalid. It must be the Web OAuth Client ID ending in .apps.googleusercontent.com');
      return;
    }

    loadGoogleScript()
      .then(() => {
        if (cancelled || !hostRef.current) return;
        const google = (window as any).google;
        if (!google?.accounts?.id) throw new Error('Google Identity Services is unavailable.');

        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response: any) => {
            if (!response?.credential) {
              callbacksRef.current.onError('Google did not return a sign-in credential. Please try again.');
              return;
            }
            callbacksRef.current.onCredential(response.credential);
          },
          auto_select: false,
          cancel_on_tap_outside: true,
          ux_mode: 'popup'
        });

        const measured = Math.round(wrapRef.current?.getBoundingClientRect().width || 320);
        hostRef.current.innerHTML = '';
        google.accounts.id.renderButton(hostRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: Math.min(Math.max(measured, 200), 400) // Google caps the width at 400px
        });
        setStatus('ready');
      })
      .catch((e: any) => {
        if (cancelled) return;
        setStatus('error');
        setErrorMessage(e?.message || 'Google Sign-In could not be loaded.');
        console.error('[GoogleAuthButton]', e);
      });

    return () => { cancelled = true; };
  }, []);

  return (
    <div ref={wrapRef} className="relative w-full">
      <style>{`
        .tah-gsi-overlay > div,
        .tah-gsi-overlay iframe { width: 100% !important; height: 100% !important; }
      `}</style>

      {/* Visible, themed button. Purely presentational when Google is ready. */}
      <button
        type="button"
        disabled={status === 'loading'}
        onClick={() => { if (status === 'error') onError(errorMessage); }}
        className={`w-full py-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2.5 transition-all ${
          theme === 'dark'
            ? 'border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200'
            : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-sm'
        } ${status === 'loading' ? 'opacity-60 cursor-wait' : ''}`}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        <span>{status === 'ready' ? label : status === 'loading' ? 'Loading Google…' : 'Google Sign-In unavailable'}</span>
      </button>

      {/* Google's real button, transparent and stretched over the one above.
          This node must never be unmounted, otherwise the button Google
          rendered into it would be thrown away. */}
      <div
        ref={hostRef}
        className={`tah-gsi-overlay absolute inset-0 overflow-hidden opacity-0 ${status === 'ready' ? '' : 'pointer-events-none'}`}
        style={{ colorScheme: 'light' }}
      />
    </div>
  );
};

export const AuthPages: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    theme,
    login,
    register,
    requestPasswordReset,
    verifyPasswordResetOtp,
    resendPasswordResetOtp,
    resetPassword,
    resendVerificationEmail,
    showToast,
    signInWithGoogle
  } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resending, setResending] = useState(false);
  const [otp, setOtp] = useState('');
  const [verificationPurpose, setVerificationPurpose] = useState<'registration'|'password-reset'>('registration');

  // While the verification screen is open, watch for the person opening the
  // link in their email. The link is handled by the backend in another tab, so
  // polling is what lets this tab move on without a manual reload.
  useEffect(() => {
    if (currentView !== 'auth-verify' || verificationPurpose === 'password-reset') return;
    const pending = (email || localStorage.getItem('tah_verify_email') || '').trim();
    if (!pending) return;

    let stopped = false;
    const check = async () => {
      try {
        const base = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
        const res = await fetch(`${base}/auth/verification-status?email=${encodeURIComponent(pending)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (stopped || !data?.verified) return;
        stopped = true;
        localStorage.removeItem('tah_verify_email');
        localStorage.removeItem('tah_verify_purpose');
        showToast('Email verified successfully. Please sign in to continue.');
        setCurrentView('auth-login');
      } catch { /* offline or backend asleep - just try again next tick */ }
    };

    const timer = setInterval(check, 4000);
    void check();
    return () => { stopped = true; clearInterval(timer); };
  }, [currentView, verificationPurpose, email]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const resetToken = params.get('resetToken');
    const resetEmail = params.get('email');
    if (resetToken) {
      localStorage.setItem('tah_reset_token', resetToken);
      if (resetEmail) { localStorage.setItem('tah_reset_email', resetEmail); setEmail(resetEmail); }
      setCurrentView('auth-reset');
    }
    const savedEmail = localStorage.getItem('tah_verify_email') || localStorage.getItem('tah_reset_email') || '';
    if (savedEmail) setEmail(savedEmail);
    const purpose = localStorage.getItem('tah_verify_purpose');
    if (purpose === 'password-reset') setVerificationPurpose('password-reset');
    else if (purpose === 'registration') setVerificationPurpose('registration');
  }, [setCurrentView]);

  // Warm up the Google script early so the button is ready by the time it renders.
  useEffect(() => { void loadGoogleScript().catch(() => { /* surfaced by GoogleAuthButton */ }); }, []);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      showToast('Please agree to the Terms & Conditions');
      return;
    }
    if (password && confirmPassword && password !== confirmPassword) {
      showToast('Passwords do not match');
      return;
    }
    void register(name, email, phone, password);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Clean sign in for user entered credentials or standard accounts
    void login(email, password);
  };


  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { showToast('Please enter your email address.'); return; }
    localStorage.setItem('tah_reset_email', email.trim().toLowerCase());
    localStorage.setItem('tah_verify_purpose', 'password-reset');
    setVerificationPurpose('password-reset');
    await requestPasswordReset(email.trim());
    setCurrentView('auth-verify');
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = email.trim() || localStorage.getItem('tah_verify_email') || localStorage.getItem('tah_reset_email') || '';
    if (!targetEmail || !/^\d{6}$/.test(otp.trim())) { showToast('Enter the 6-digit OTP sent to your email.'); return; }
    // Only the password-reset flow uses an OTP. Email verification is link-only.
    const token = await verifyPasswordResetOtp(targetEmail, otp.trim());
    if (token) setCurrentView('auth-reset');
  };

  const handleResendEmail = async () => {
    const targetEmail = email.trim() || localStorage.getItem('tah_verify_email') || localStorage.getItem('tah_reset_email') || '';
    if (!targetEmail) { showToast('Please enter your email address.'); return; }
    setResending(true);
    if (verificationPurpose === 'password-reset') await resendPasswordResetOtp(targetEmail);
    else await resendVerificationEmail(targetEmail);
    setResending(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && confirmNewPassword && newPassword !== confirmNewPassword) { showToast('Passwords do not match'); return; }
    await resetPassword(newPassword);
    setCurrentView('auth-login');
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8 transition-colors duration-200 ${
        theme === 'dark' ? 'bg-[#070b16] text-white' : 'bg-[#f8fafc] text-slate-900'
      }`}
    >
      {/* Top Navbar Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between py-2">
        <div onClick={() => setCurrentView('landing')} className="cursor-pointer">
          <Logo size="md" theme={theme} />
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setCurrentView('landing')}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl border transition-colors ${
              theme === 'dark'
                ? 'border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white'
                : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700 shadow-sm'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Portal</span>
          </button>
        </div>
      </div>

      {/* Main Form Center Area */}
      <div className="flex-1 flex items-center justify-center my-6">
        {/* ========================================================================= */}
        {/* VIEW 1: REGISTER */}
        {/* ========================================================================= */}
        {currentView === 'auth-register' && (
          <div className="max-w-4xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 rounded-3xl shadow-2xl overflow-hidden border border-slate-800/80">
            {/* Left Visual Column */}
            <div
              className={`md:col-span-5 p-8 flex flex-col justify-between relative overflow-hidden ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-blue-950 via-slate-900 to-[#070b16] text-white border-r border-slate-800'
                  : 'bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white'
              }`}
            >
              <div className="relative z-10 space-y-4">
                <Logo size="sm" theme="dark" />

                <div className="pt-4">
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
                    Begin Your Journey of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Human Capability Development.</span>
                  </h2>
                  <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                    Learn. Grow. Lead. Transform your future with the right skills.
                  </p>
                </div>

                {/* Glowing Brain & Doorway Visual Illustration */}
                <div className="relative my-6 py-6 flex items-center justify-center">
                  <div className="relative w-40 h-40 rounded-full bg-gradient-to-tr from-cyan-500/20 via-blue-500/20 to-purple-500/20 flex items-center justify-center border border-cyan-400/30 shadow-[0_0_40px_rgba(6,182,212,0.2)]">
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-16 h-16 rounded-2xl bg-indigo-600/40 border border-indigo-400/50 flex items-center justify-center shadow-lg backdrop-blur-md">
                        <Sparkles className="w-8 h-8 text-cyan-300 animate-pulse" />
                      </div>
                      <span className="text-[10px] font-mono text-cyan-300 mt-2 font-bold uppercase tracking-wider">22 Capabilities</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom 3 Stats */}
              <div className="relative z-10 pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className="text-base font-black text-cyan-400">22+</div>
                  <div className="text-[9px] text-slate-400 uppercase font-medium">Programs</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className="text-base font-black text-blue-400">5000+</div>
                  <div className="text-[9px] text-slate-400 uppercase font-medium">Learners</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className="text-base font-black text-indigo-400">100+</div>
                  <div className="text-[9px] text-slate-400 uppercase font-medium">Mentors</div>
                </div>
              </div>
            </div>

            {/* Right Form Column */}
            <div className={`md:col-span-7 p-8 sm:p-10 flex flex-col justify-center ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-white'}`}>
              <div className="mb-6">
                <h3 className="text-2xl font-extrabold tracking-tight">Create Account</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Join thousands of learners building their future.
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-3.5">
                <div>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Full Name"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        theme === 'dark'
                          ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500'
                          : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Email Address"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        theme === 'dark'
                          ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500'
                          : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="Mobile Number"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        theme === 'dark'
                          ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500'
                          : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Password"
                      className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        theme === 'dark'
                          ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500'
                          : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Confirm Password"
                      className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        theme === 'dark'
                          ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500'
                          : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms-check"
                    checked={agreeTerms}
                    onChange={e => setAgreeTerms(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <label htmlFor="terms-check" className="text-xs text-slate-400">
                    I agree to the <span className="text-blue-500 hover:underline cursor-pointer">Terms & Conditions</span> and <span className="text-blue-500 hover:underline cursor-pointer">Privacy Policy</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <span>Create Account</span>
                </button>

                <div className="relative my-4 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-700/60" /></div>
                  <span className="relative px-3 text-[11px] uppercase font-bold text-slate-400 bg-white dark:bg-[#0f172a]">OR</span>
                </div>

                <GoogleAuthButton
                  theme={theme}
                  onCredential={(credential) => { void signInWithGoogle(credential); }}
                  onError={(message) => showToast(message)}
                />

                <div className="text-center text-xs text-slate-400 pt-3">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setCurrentView('auth-login')}
                    className="text-blue-500 font-bold hover:underline"
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: LOGIN */}
        {/* ========================================================================= */}
        {currentView === 'auth-login' && (
          <div className="max-w-4xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 rounded-3xl shadow-2xl overflow-hidden border border-slate-800/80">
            {/* Left Visual Column */}
            <div
              className={`md:col-span-5 p-8 flex flex-col justify-between relative overflow-hidden ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-indigo-950 via-slate-900 to-[#070b16] text-white border-r border-slate-800'
                  : 'bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white'
              }`}
            >
              <div className="relative z-10 space-y-4">
                <Logo size="sm" theme="dark" />

                <div className="pt-4">
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
                    Welcome Back!
                  </h2>
                  <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                    Glad to see you again. Let's continue your learning journey.
                  </p>
                </div>

                {/* Backpacker gazing into glowing purple doorway */}
                <div className="relative my-8 py-6 flex items-center justify-center">
                  <div className="relative w-44 h-48 rounded-2xl bg-gradient-to-b from-indigo-950/80 to-[#04070e] border border-indigo-500/30 flex flex-col items-center justify-center p-4 overflow-hidden shadow-2xl">
                    <div className="w-16 h-28 rounded-t-full border border-cyan-400/80 shadow-[0_0_30px_rgba(6,182,212,0.5)] bg-gradient-to-b from-cyan-200/50 via-indigo-600/30 to-transparent flex items-center justify-center mb-2">
                      <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
                    </div>
                    <div className="w-20 h-1.5 bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Bottom 3 Stats */}
              <div className="relative z-10 pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className="text-base font-black text-cyan-400">22+</div>
                  <div className="text-[9px] text-slate-400 uppercase font-medium">Programs</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className="text-base font-black text-blue-400">5000+</div>
                  <div className="text-[9px] text-slate-400 uppercase font-medium">Learners</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className="text-base font-black text-indigo-400">100+</div>
                  <div className="text-[9px] text-slate-400 uppercase font-medium">Mentors</div>
                </div>
              </div>
            </div>

            {/* Right Form Column */}
            <div className={`md:col-span-7 p-8 sm:p-10 flex flex-col justify-center ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-white'}`}>
              <div className="mb-6">
                <h3 className="text-2xl font-extrabold tracking-tight">Login to Your Account</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Access your personalized learning dashboard.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Email Address"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        theme === 'dark'
                          ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500'
                          : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Password"
                      className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        theme === 'dark'
                          ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500'
                          : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-400">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span>Remember Me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setCurrentView('auth-forgot')}
                    className="text-blue-500 font-semibold hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <span>Login</span>
                </button>

                <div className="relative my-4 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-700/60" /></div>
                  <span className="relative px-3 text-[11px] uppercase font-bold text-slate-400 bg-white dark:bg-[#0f172a]">OR</span>
                </div>

                <GoogleAuthButton
                  theme={theme}
                  onCredential={(credential) => { void signInWithGoogle(credential); }}
                  onError={(message) => showToast(message)}
                />

                <div className="text-center text-xs text-slate-400 pt-3">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setCurrentView('auth-register')}
                    className="text-blue-500 font-bold hover:underline"
                  >
                    Register
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: FORGOT PASSWORD */}
        {/* ========================================================================= */}
        {currentView === 'auth-forgot' && (
          <div className={`max-w-md w-full mx-auto p-8 sm:p-10 rounded-3xl shadow-2xl border text-center ${
            theme === 'dark' ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            {/* Glowing 3D Padlock visual */}
            <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl" />
              <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-blue-500 p-0.5 shadow-xl flex items-center justify-center">
                <div className="w-full h-full bg-slate-900/90 rounded-[22px] flex items-center justify-center">
                  <Lock className="w-9 h-9 text-blue-400" />
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-black tracking-tight">Forgot Your Password?</h3>
            <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
              Enter your registered email address and we'll send you a password reset link.
            </p>

            <form onSubmit={handleSendReset} className="mt-6 space-y-4 text-left">
              <div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      theme === 'dark'
                        ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Send Reset Link</span>
              </button>

              <div className="text-center pt-3">
                <button
                  type="button"
                  onClick={() => setCurrentView('auth-login')}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Login</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 4: EMAIL VERIFICATION */}
        {/* ========================================================================= */}
        {currentView === 'auth-verify' && (
          <div className={`max-w-md w-full mx-auto p-8 sm:p-10 rounded-3xl shadow-2xl border text-center ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl" />
              <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-xl flex items-center justify-center">
                <div className="w-full h-full bg-slate-900/90 rounded-[22px] flex items-center justify-center"><CheckCircle2 className="w-10 h-10 text-emerald-400" /></div>
              </div>
            </div>
            <h3 className="text-2xl font-black tracking-tight">{verificationPurpose === 'password-reset' ? 'Verify Reset OTP' : 'Check Your Email'}</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">{verificationPurpose === 'password-reset' ? 'Enter the 6-digit OTP sent to your registered email to continue.' : 'We sent you a verification link. Open the email and tap the Verify Email button — this page will continue on its own.'}</p>
            <div className="my-4 px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 dark:bg-slate-800/60 dark:border-slate-700 text-xs font-mono text-cyan-600 dark:text-cyan-300 inline-block max-w-full truncate">{email || 'your@email.com'}</div>

            {verificationPurpose !== 'password-reset' && (
              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 mb-2">
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>Waiting for you to open the link…</span>
              </div>
            )}

            {verificationPurpose === 'password-reset' && (
              <>
                <form onSubmit={handleVerifyOtp} className="mt-4 space-y-3 text-left">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-1.5">6-Digit Code</label>
                    <input value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,'').slice(0,6))} inputMode="numeric" maxLength={6} placeholder="000000" className={`w-full text-center tracking-[0.5em] font-black text-xl py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500 ${theme==='dark'?'bg-slate-800 border-slate-700 text-white':'bg-slate-50 border-slate-200 text-slate-900'}`} />
                  </div>
                  <button type="submit" className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 shadow-lg transition-all">Verify Code</button>
                </form>
                <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-800/40 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400">The code expires in 10 minutes. Maximum 5 attempts per code.</div>
              </>
            )}
            <div className="text-xs text-slate-400 pt-4 flex items-center justify-center gap-1">
              <span>Didn't receive it?</span>
              <button type="button" onClick={handleResendEmail} disabled={resending} className="text-blue-500 font-bold hover:underline ml-1 inline-flex items-center gap-1">{resending && <RefreshCw className="w-3 h-3 animate-spin" />}<span>Resend</span></button>
            </div>
            <div className="pt-4"><button type="button" onClick={()=>setCurrentView('auth-login')} className="text-xs font-semibold text-slate-400 hover:text-slate-200 inline-flex items-center gap-1.5"><ArrowLeft className="w-3.5 h-3.5" />Back to Login</button></div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 5: RESET PASSWORD */}
        {/* ========================================================================= */}
        {currentView === 'auth-reset' && (
          <div className={`max-w-md w-full mx-auto p-8 sm:p-10 rounded-3xl shadow-2xl border text-center ${
            theme === 'dark' ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            {/* Glowing lock with **** */}
            <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl" />
              <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-blue-500 p-0.5 shadow-xl flex items-center justify-center">
                <div className="w-full h-full bg-slate-900/90 rounded-[22px] flex flex-col items-center justify-center">
                  <Lock className="w-7 h-7 text-indigo-400" />
                  <span className="text-[10px] font-mono font-black text-cyan-300 tracking-widest mt-0.5">****</span>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-black tracking-tight">Create New Password</h3>
            <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
              Your new password must be different from previously used passwords.
            </p>

            <form onSubmit={handleResetPassword} className="mt-6 space-y-4 text-left">
              <div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      theme === 'dark'
                        ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmNewPassword}
                    onChange={e => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirm New Password"
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      theme === 'dark'
                        ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Strength Meter */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-400">Password Strength</span>
                  <span className="text-emerald-400">Strong</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-full rounded-full" />
                </div>
              </div>

              {/* 4 Checklist Requirements */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-800/40 dark:border-slate-700/60 space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                  <span>Use 8 or more characters</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                  <span>Include uppercase & lowercase letters</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                  <span>Include a number</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                  <span>Include a special character</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Update Password</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentView('auth-login')}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Login</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Footer copyright */}
      <div className="text-center text-xs text-slate-500 py-3">
        © {new Date().getFullYear()} ThinkAHead Learning Hub. All Rights Reserved. Institute of Human Capability Development & Research (IHCDR).
      </div>
    </div>
  );
};

import React, { useState, useRef } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SignUpScreen: React.FC = () => {
  const { setActiveScreen, signup, loginWithGoogle, openModal } = useApp();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGoogleAlarmRed, setIsGoogleAlarmRed] = useState(false);
  const googleBtnRef = useRef<HTMLButtonElement>(null);

  const handleVerifyNow = () => {
    setIsGoogleAlarmRed(true);
    googleBtnRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    googleBtnRef.current?.focus();
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    setError(null);
    setIsGoogleAlarmRed(false);
    const res = await loginWithGoogle();
    setGoogleLoading(false);
    if (!res.success) {
      setError(res.error || 'Please get verified');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await signup(firstName, lastName, username, email, password);
      if (!res.success && res.error) {
        setError(res.error);
      }
    } catch {
      setError('An error occurred while creating your account. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen min-h-[100dvh] flex flex-col justify-between bg-[#fbf9f4] text-[#1a1c16] relative overflow-y-auto overscroll-contain">
      {/* Top curved olive header matching wireframe with safe area top */}
      <div className="relative w-full bg-[#3e462d] text-white pt-[max(1.5rem,env(safe-area-inset-top))] pb-10 rounded-b-[44px] shadow-xs flex flex-col items-center">
      </div>

      {/* Main Form Area */}
      <div className="flex-1 px-6 sm:px-8 py-4 flex flex-col justify-center max-w-md mx-auto w-full">
        {/* Title & subtitle */}
        <div className="text-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
            Get Started on <span className="italic font-serif font-black text-[#3e462d]">RetrieveIT</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-2 max-w-xs mx-auto leading-relaxed">
            Create an account to be part of the community that turns lost into found.
          </p>
        </div>

        {/* Error Alert / Verification Message */}
        {error && (
          <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs sm:text-sm rounded-xl flex items-center justify-between gap-2 font-medium">
            <div className="flex items-center gap-2">
              <AlertCircle size={17} className="shrink-0 text-emerald-600" />
              <span>
                {error.includes('popup-closed') || error.includes('Firebase') || error.includes('auth/') || error === 'Please get verified'
                  ? 'Please get verified'
                  : error}
              </span>
            </div>
            {(error.includes('popup-closed') || error.includes('Firebase') || error.includes('auth/') || error === 'Please get verified') && (
              <button
                type="button"
                onClick={handleVerifyNow}
                className="text-xs underline font-semibold text-emerald-800 hover:text-emerald-950 cursor-pointer shrink-0 py-0.5 px-1"
              >
                Verify now
              </button>
            )}
          </div>
        )}

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* First Name & Last Name side by side */}
          <div className="grid grid-cols-2 gap-2.5">
            <input
              type="text"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                setIsGoogleAlarmRed(false);
              }}
              placeholder="First Name"
              required
              className="w-full px-3.5 py-3 min-h-[48px] bg-white border border-[#dfdbcf] rounded-xl text-[15px] sm:text-sm placeholder:text-zinc-400 focus:outline-none focus:border-[#3e462d] focus:ring-1 focus:ring-[#3e462d] transition-all"
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                setIsGoogleAlarmRed(false);
              }}
              placeholder="Last Name"
              required
              className="w-full px-3.5 py-3 min-h-[48px] bg-white border border-[#dfdbcf] rounded-xl text-[15px] sm:text-sm placeholder:text-zinc-400 focus:outline-none focus:border-[#3e462d] focus:ring-1 focus:ring-[#3e462d] transition-all"
            />
          </div>

          {/* Choose Username */}
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ''));
              setIsGoogleAlarmRed(false);
            }}
            placeholder="Choose a username"
            required
            autoCapitalize="none"
            autoCorrect="off"
            className="w-full px-3.5 py-3 min-h-[48px] bg-white border border-[#dfdbcf] rounded-xl text-[15px] sm:text-sm placeholder:text-zinc-400 focus:outline-none focus:border-[#3e462d] focus:ring-1 focus:ring-[#3e462d] transition-all"
          />

          {/* Email */}
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setIsGoogleAlarmRed(false);
            }}
            placeholder="Enter your email"
            required
            className="w-full px-3.5 py-3 min-h-[48px] bg-white border border-[#dfdbcf] rounded-xl text-[15px] sm:text-sm placeholder:text-zinc-400 focus:outline-none focus:border-[#3e462d] focus:ring-1 focus:ring-[#3e462d] transition-all"
          />

          {/* Create a Password */}
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setIsGoogleAlarmRed(false);
            }}
            placeholder="Create a Password"
            required
            className="w-full px-3.5 py-3 min-h-[48px] bg-white border border-[#dfdbcf] rounded-xl text-[15px] sm:text-sm placeholder:text-zinc-400 focus:outline-none focus:border-[#3e462d] focus:ring-1 focus:ring-[#3e462d] transition-all"
          />

          {/* Terms & Privacy note */}
          <p className="text-[11px] text-zinc-400 text-center px-2 mt-1 leading-snug">
            By signing up you agree to our{' '}
            <button
              type="button"
              onClick={() => openModal('about_us')}
              className="text-zinc-700 underline font-medium hover:text-black cursor-pointer py-0.5"
            >
              Terms
            </button>{' '}
            and{' '}
            <button
              type="button"
              onClick={() => openModal('about_us')}
              className="text-zinc-700 underline font-medium hover:text-black cursor-pointer py-0.5"
            >
              Privacy Policy
            </button>
            .
          </p>

          {/* Create Account Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 min-h-[48px] mt-1 bg-[#11130e] hover:bg-[#23261d] active:scale-[0.99] text-white font-semibold text-xs tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>CREATING ACCOUNT...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        {/* Google Authentication */}
        <div className="mt-3 flex flex-col gap-2.5">
          <div className="relative flex py-1 items-center">
            <div className="grow border-t border-[#e5e1d6]"></div>
            <span className="shrink mx-3 text-[11px] text-zinc-400 font-medium uppercase tracking-wider">or</span>
            <div className="grow border-t border-[#e5e1d6]"></div>
          </div>

          <button
            ref={googleBtnRef}
            type="button"
            disabled={googleLoading}
            onClick={handleGoogleSignUp}
            className={`w-full py-3 px-4 min-h-[48px] bg-white hover:bg-zinc-50 rounded-xl text-xs font-semibold text-zinc-700 flex items-center justify-center gap-2.5 transition-all shadow-2xs cursor-pointer disabled:opacity-60 ${
              isGoogleAlarmRed
                ? 'border-2 border-red-600 ring-4 ring-red-500/25 shadow-md shadow-red-500/10 animate-pulse'
                : 'border border-[#ded8cb]'
            }`}
          >
            {googleLoading ? (
              <Loader2 size={16} className="animate-spin text-zinc-600" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>{googleLoading ? 'Registering...' : 'Register with Google'}</span>
          </button>
        </div>
      </div>

      {/* Footer link to Sign In with safe area bottom */}
      <div className="pt-2 pb-[max(1.75rem,calc(env(safe-area-inset-bottom)+1rem))] text-center text-xs text-zinc-500">
        <span>Already have an account? </span>
        <button
          onClick={() => setActiveScreen('login')}
          className="font-bold text-[#11130e] hover:underline cursor-pointer py-1 px-1"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

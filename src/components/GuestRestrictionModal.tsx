import React, { useState } from 'react';
import { X, ShieldAlert, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const GuestRestrictionModal: React.FC = () => {
  const { activeModal, closeModal, guestPromptReason, loginWithGoogle, setActiveScreen } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (activeModal !== 'guest_restriction_prompt') return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    const res = await loginWithGoogle();
    setLoading(false);
    if (!res.success && res.error) {
      setError(res.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={closeModal}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col p-6 text-center animate-in zoom-in-95 duration-150">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-700 rounded-full cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Shield Icon */}
        <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-3.5 border border-amber-200">
          <ShieldAlert size={28} />
        </div>

        <h3 className="font-bold text-base text-zinc-900 tracking-tight">
          Account Required
        </h3>

        <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
          Guest mode is limited to viewing items only. You must sign in to {guestPromptReason}
        </p>

        {error && (
          <div className="mt-3 p-2.5 bg-red-50 border border-red-200 text-red-700 text-[11px] rounded-xl text-left">
            {error}
          </div>
        )}

        {/* Prominent Google Sign-In Button */}
        <button
          type="button"
          disabled={loading}
          onClick={handleGoogleSignIn}
          className="mt-5 w-full py-3 px-4 bg-[#11130e] hover:bg-[#23261d] active:scale-[0.99] text-white rounded-2xl flex items-center justify-center gap-3 transition-all cursor-pointer shadow-sm disabled:opacity-60"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin text-white" />
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
          <span className="font-bold text-xs tracking-wide">
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </span>
        </button>

        {/* Email registration link */}
        <button
          type="button"
          onClick={() => {
            closeModal();
            setActiveScreen('signup');
          }}
          className="mt-3 text-xs text-zinc-600 hover:text-black font-semibold cursor-pointer underline"
        >
          Or Register with Email
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Shield, Loader2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const GoogleAuthModal: React.FC = () => {
  const { activeModal, closeModal, loginWithGoogle, verifyInstantGoogleUser, setActiveScreen } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (activeModal !== 'google_auth') return null;

  const handleSignIn = async () => {
    setIsProcessing(true);
    setError(null);
    const res = await loginWithGoogle();
    setIsProcessing(false);
    if (!res.success) {
      setError(res.error || 'Please get verified');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={closeModal}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col animate-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
            <span className="font-semibold text-xs text-zinc-800">Google Authentication</span>
          </div>
          <button
            onClick={closeModal}
            className="p-1 text-zinc-400 hover:text-zinc-700 rounded-full cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-4 text-center">
          <div>
            <h3 className="font-bold text-base text-zinc-900">Sign in with Google</h3>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              Authenticate your real Google account to become a verified Retriever, post items, and submit claims.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl flex items-center justify-between gap-2 font-medium text-left">
              <div className="flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0 text-emerald-600" />
                <span>
                  {error.includes('popup-closed') || error.includes('Firebase') || error.includes('auth/') || error === 'Please get verified'
                    ? 'Please get verified'
                    : error}
                </span>
              </div>
              <button
                type="button"
                onClick={() => verifyInstantGoogleUser()}
                className="text-[11px] underline font-semibold text-emerald-800 hover:text-emerald-950 cursor-pointer shrink-0"
              >
                Verify now
              </button>
            </div>
          )}

          {/* Primary Google Auth Button */}
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleSignIn}
            className="w-full py-3.5 px-4 bg-[#11130e] hover:bg-black active:scale-[0.99] text-white rounded-2xl flex items-center justify-center gap-3 transition-all cursor-pointer shadow-sm group disabled:opacity-50"
          >
            {isProcessing ? (
              <Loader2 size={18} className="animate-spin text-white" />
            ) : (
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
              {isProcessing ? 'Verifying with Google...' : 'Sign in with Google'}
            </span>
          </button>

          {/* Anti-Poser Guarantee Box */}
          <div className="p-3 bg-[#f8f7f2] border border-[#e5e1d5] rounded-xl text-[11px] text-zinc-600 leading-relaxed text-left">
            <div className="flex items-center gap-1.5 font-bold text-zinc-800 mb-1 text-[11px]">
              <Shield size={13} className="text-[#3e462d]" />
              <span>Anti-Poser Protection Active</span>
            </div>
            Your account is verified directly through Google. This prevents fake identities and ensures belongings are safely returned to legitimate community members.
          </div>

          <div className="pt-1">
            <button
              onClick={() => {
                closeModal();
                setActiveScreen('signup');
              }}
              className="text-xs text-zinc-500 hover:text-black underline cursor-pointer"
            >
              Don't have Google? Register with Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

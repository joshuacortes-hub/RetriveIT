import React, { useState } from 'react';
import { X, ShieldCheck, Upload, CheckCircle2, AlertCircle, Camera, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const IdentityVerificationModal: React.FC = () => {
  const { activeModal, closeModal, currentUser, isGuest, loginWithGoogle } = useApp();
  const [googleLoading, setGoogleLoading] = useState(false);

  if (activeModal !== 'identity_verification') return null;

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    await loginWithGoogle();
    setGoogleLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={closeModal}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-[#fcfbf7] rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 bg-[#3e462d] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-200 flex items-center justify-center font-bold">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h2 className="font-bold text-sm">Identity Verification</h2>
              <p className="text-[10px] text-white/70">Campus Trust &amp; Safety Tier</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1 hover:bg-white/10 rounded-full text-white/80 hover:text-white cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {isGuest ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-bold text-xs text-amber-900">Verification Requires Account</h3>
                <p className="text-[11px] text-amber-700 leading-relaxed mt-1">
                  You are currently browsing in Guest Mode. Please sign in with Google to establish your verified Retriever status.
                </p>
              </div>

              <button
                type="button"
                disabled={googleLoading}
                onClick={handleGoogleSignIn}
                className="w-full py-2.5 px-4 bg-[#11130e] hover:bg-black text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{googleLoading ? 'Verifying...' : 'Sign in with Google to Verify'}</span>
              </button>
            </div>
          ) : (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h3 className="font-bold text-xs text-emerald-900">Identity Verified</h3>
                <p className="text-[11px] text-emerald-700 leading-snug">
                  {currentUser?.firstName || 'User'} has an active verified badge. You can claim items and contact finders without restriction.
                </p>
              </div>
            </div>
          )}

          {/* Details */}
          <div className="bg-white p-4 rounded-2xl border border-[#ebe6dc] flex flex-col gap-3">
            <h4 className="font-bold text-xs text-zinc-800 uppercase tracking-wider">
              Verification Credentials
            </h4>
            <div className="flex flex-col gap-2 text-xs">
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">Verified Name:</span>
                <span className="font-semibold text-zinc-800">
                  {currentUser && !isGuest ? `${currentUser.firstName} ${currentUser.lastName}` : 'Guest Member'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">Document Type:</span>
                <span className="font-semibold text-zinc-800">
                  {isGuest ? 'Pending Account Sign-in' : 'Verified Google Account / Student ID'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">Trust Level:</span>
                <span className={`font-bold flex items-center gap-1 ${isGuest ? 'text-zinc-400' : 'text-emerald-600'}`}>
                  <span>{isGuest ? 'Guest Level (Viewing Only)' : 'Level 1 Highest Trust'}</span>
                  {!isGuest && <CheckCircle2 size={13} />}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-500">High-Value Item Claims:</span>
                <span className="font-bold text-zinc-800">
                  {isGuest ? 'Disabled in Guest Mode' : 'Enabled (Laptops, Phones, Jewelry)'}
                </span>
              </div>
            </div>
          </div>

          {/* Benefits summary */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#ebe6dc] text-xs text-zinc-600 leading-relaxed">
            <h4 className="font-bold text-zinc-800 mb-1">Why get verified?</h4>
            <p className="text-[11px] text-zinc-500">
              Verified retrievers get a gold badge on their profile, faster claim approvals, and higher karma standing in the community.
            </p>
          </div>

          <button
            onClick={closeModal}
            className="w-full py-2.5 bg-[#11130e] text-white text-xs font-bold rounded-xl hover:bg-black transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

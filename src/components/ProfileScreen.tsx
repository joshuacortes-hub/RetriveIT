import React from 'react';
import { ArrowLeft, CheckCircle2, Mail, Edit3, Award, ShieldCheck, Lock, HelpCircle, ChevronRight, Clock, Shield, LogIn, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBar } from './StatusBar';
import { BottomNav } from './BottomNav';

export const ProfileScreen: React.FC = () => {
  const {
    currentUser,
    setActiveScreen,
    logout,
    openModal,
    items,
    isGuest,
    loginWithGoogle,
  } = useApp();

  const [googleLoading, setGoogleLoading] = React.useState(false);

  const userItems = items.filter(
    (it) => !isGuest && currentUser && (it.authorEmail === currentUser.email || it.authorId === currentUser.id)
  );

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    await loginWithGoogle();
    setGoogleLoading(false);
  };

  return (
    <div className="w-full min-h-screen min-h-[100dvh] flex flex-col justify-between bg-[#fcfbf7] text-[#1a1c16] relative overflow-hidden">
      {/* Top Olive Header with safe area top */}
      <div className="bg-[#3e462d] text-white pt-[max(0.6rem,env(safe-area-inset-top))] pb-6 px-5 shadow-sm">
        <StatusBar dark />

        {/* Top actions */}
        <div className="flex items-center justify-between mt-2">
          <button
            onClick={() => setActiveScreen('home')}
            aria-label="Back"
            className="p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} strokeWidth={2.4} />
          </button>
          {!isGuest ? (
            <button
              onClick={logout}
              className="text-xs text-white/90 hover:text-white font-medium hover:underline cursor-pointer"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => setActiveScreen('login')}
              className="text-xs text-white/90 hover:text-white font-medium hover:underline cursor-pointer flex items-center gap-1"
            >
              <LogIn size={13} />
              <span>Sign In</span>
            </button>
          )}
        </div>

        {/* User Name & Status */}
        <div className="mt-4 flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white">
              {isGuest ? 'Guest Mode' : `${currentUser?.firstName} ${currentUser?.lastName}`}
            </h1>
            {!isGuest && currentUser?.isVerified && (
              <div className="w-5 h-5 rounded-full bg-[#eab308] flex items-center justify-center text-[#3e462d]">
                <CheckCircle2 size={15} strokeWidth={3} className="text-white fill-[#eab308]" />
              </div>
            )}
          </div>
          {!isGuest && currentUser?.username && (
            <span className="text-xs text-white/75 font-mono mt-0.5">@{currentUser.username}</span>
          )}
        </div>

        {/* Email Bar or Guest Status */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-white/90">
            <Mail size={15} />
            <span className="font-light">{isGuest ? 'Access Level' : 'Email'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/80 font-mono text-[11px] truncate max-w-[200px]">
              {isGuest ? 'Viewing Only (Unverified)' : currentUser?.email}
            </span>
            {!isGuest && (
              <button
                onClick={() => openModal('edit_email')}
                className="p-1 bg-[#4d5638] hover:bg-[#596441] text-[#bbf7d0] rounded-md transition-colors cursor-pointer"
                title="Edit email"
              >
                <Edit3 size={13} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Profile Body */}
      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
        {/* Guest Mode Callout Card with Google Sign In */}
        {isGuest && (
          <div className="p-4 bg-white border border-[#dfdbcf] rounded-2xl shadow-xs text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#3e462d]/10 text-[#3e462d] flex items-center justify-center mb-2.5">
              <Shield size={24} />
            </div>
            <h3 className="font-bold text-sm text-zinc-900">Verify Your Account</h3>
            <p className="text-xs text-zinc-600 mt-1 max-w-xs leading-relaxed">
              Sign in with your Google account to post lost belongings, submit claim verifications, and earn community Retriever Points.
            </p>

            <button
              type="button"
              disabled={googleLoading}
              onClick={handleGoogleSignIn}
              className="mt-4 w-full py-3 bg-[#11130e] hover:bg-black text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2.5 cursor-pointer shadow-sm transition-all"
            >
              {googleLoading ? (
                <Loader2 size={16} className="animate-spin text-white" />
              ) : (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              )}
              <span>Sign in with Google</span>
            </button>

            <button
              onClick={() => setActiveScreen('signup')}
              className="mt-2.5 text-xs text-zinc-500 hover:text-black underline cursor-pointer"
            >
              Or Register with Email
            </button>
          </div>
        )}

        {/* ACCOUNT Section */}
        <div>
          <h2 className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase mb-3">
            ACCOUNT
          </h2>

          <div className="flex flex-col gap-2.5">
            {/* 1. Retrievers Points Card */}
            <button
              onClick={() => {
                if (isGuest) {
                  openModal('guest_restriction_prompt');
                } else {
                  openModal('retrievers_points');
                }
              }}
              className="w-full p-4 bg-[#11130e] hover:bg-[#23261d] text-white rounded-xl flex items-center justify-between transition-all cursor-pointer shadow-xs group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-[#eab308]">
                  <Award size={20} />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs tracking-wide">Retrievers Points</span>
                    <span className="bg-[#eab308] text-[#11130e] text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                      {isGuest ? '0 pts' : `${currentUser?.points || 0} pts`}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    {isGuest ? 'Sign in to earn points' : 'View your Retrievers Points & Rewards'}
                  </p>
                </div>
              </div>
              <ChevronRight size={16} className="text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* 2. Identity Verification Card */}
            <button
              onClick={() => openModal('identity_verification')}
              className="w-full p-3.5 bg-white hover:bg-zinc-50 border border-[#e5e0d5] rounded-xl flex items-center justify-between transition-all cursor-pointer shadow-2xs group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck size={18} />
                </div>
                <div className="text-left">
                  <span className="font-bold text-xs text-zinc-800">Identity Verification</span>
                  <p className="text-[10px] text-zinc-500 mt-0.5">
                    {isGuest ? 'Requires verified account' : 'View verification credentials'}
                  </p>
                </div>
              </div>
              <ChevronRight size={16} className="text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* 3. Account Security Card */}
            <button
              onClick={() => openModal('account_security')}
              className="w-full p-3.5 bg-white hover:bg-zinc-50 border border-[#e5e0d5] rounded-xl flex items-center justify-between transition-all cursor-pointer shadow-2xs group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center">
                  <Lock size={18} />
                </div>
                <div className="text-left">
                  <span className="font-bold text-xs text-zinc-800">Account Security</span>
                  <p className="text-[10px] text-zinc-500 mt-0.5">
                    Change your password &amp; 2FA
                  </p>
                </div>
              </div>
              <ChevronRight size={16} className="text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* 4. Help & Support Card */}
            <button
              onClick={() => openModal('help_support')}
              className="w-full p-3.5 bg-white hover:bg-zinc-50 border border-[#e5e0d5] rounded-xl flex items-center justify-between transition-all cursor-pointer shadow-2xs group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <HelpCircle size={18} />
                </div>
                <div className="text-left">
                  <span className="font-bold text-xs text-zinc-800">Help &amp; Support</span>
                  <p className="text-[10px] text-zinc-500 mt-0.5">
                    Need Help? Chat with Support
                  </p>
                </div>
              </div>
              <ChevronRight size={16} className="text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div>
          <h2 className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase mb-2.5">
            Recent Activity
          </h2>

          <div className="bg-white border border-[#e5e0d5] rounded-xl divide-y divide-zinc-100 overflow-hidden shadow-2xs">
            {userItems.length > 0 ? (
              userItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => openModal('item_detail', item)}
                  className="p-3 flex items-center justify-between hover:bg-zinc-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-10 h-10 object-cover rounded-lg bg-zinc-100"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase text-[#3e462d]">
                          {item.type}
                        </span>
                        <span className="text-[10px] text-zinc-400">• {item.date}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-zinc-800 line-clamp-1">{item.title}</h4>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.status === 'CLAIMED' || item.status === 'FOUND'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-zinc-400">
                <Clock size={16} className="mx-auto mb-1 text-zinc-300" />
                {isGuest
                  ? 'Sign in to see your posted belongings and reward history.'
                  : 'No posts yet. Report a lost or found item to see your activity here!'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

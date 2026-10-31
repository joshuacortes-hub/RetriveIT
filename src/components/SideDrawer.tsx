import React from 'react';
import { ChevronRight, LogOut, Home, HelpCircle, Info, ShieldCheck, User as UserIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SideDrawer: React.FC = () => {
  const {
    isDrawerOpen,
    closeDrawer,
    setActiveScreen,
    openModal,
    logout,
    currentUser,
    isGuest,
    loginWithGoogle,
  } = useApp();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer content matching wireframe with safe area insets */}
      <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between pt-[max(1.75rem,env(safe-area-inset-top))] pb-[max(1.75rem,env(safe-area-inset-bottom))] px-6 z-10 animate-in slide-in-from-left duration-200">
        <div>
          {/* Logo Title matching wireframe: *RetrieveIT* */}
          <div className="pt-4 pb-6 text-center border-b border-zinc-100">
            <h2 className="text-2xl font-bold font-serif italic text-zinc-900 tracking-tight">
              RetrieveIT
            </h2>
            {currentUser && !isGuest ? (
              <p className="text-xs text-zinc-500 mt-1">
                Logged in as <span className="font-bold text-zinc-800">{currentUser.firstName}</span>{' '}
                {currentUser.username && <span className="text-[11px] text-zinc-400 font-mono">(@{currentUser.username})</span>}
              </p>
            ) : (
              <div className="mt-3">
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full uppercase">
                  Guest Mode (Viewing only)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    closeDrawer();
                    loginWithGoogle();
                  }}
                  className="mt-3 w-full py-2 px-3 bg-[#11130e] hover:bg-black text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Sign in with Google</span>
                </button>
              </div>
            )}
          </div>

          {/* Navigation links matching wireframe */}
          <nav className="mt-6 flex flex-col divide-y divide-zinc-100">
            {/* Home */}
            <button
              onClick={() => {
                setActiveScreen('home');
                closeDrawer();
              }}
              className="py-3.5 flex items-center justify-between text-xs font-semibold text-zinc-800 hover:text-black transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Home size={16} className="text-[#3e462d]" />
                <span>Home</span>
              </div>
              <ChevronRight size={16} className="text-zinc-400" />
            </button>

            {/* Profile */}
            <button
              onClick={() => {
                setActiveScreen('profile');
                closeDrawer();
              }}
              className="py-3.5 flex items-center justify-between text-xs font-semibold text-zinc-800 hover:text-black transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <UserIcon size={16} className="text-[#3e462d]" />
                <span>My Profile &amp; Points</span>
              </div>
              <ChevronRight size={16} className="text-zinc-400" />
            </button>

            {/* Identity Verification */}
            <button
              onClick={() => {
                closeDrawer();
                if (isGuest) {
                  openModal('guest_restriction_prompt');
                } else {
                  openModal('identity_verification');
                }
              }}
              className="py-3.5 flex items-center justify-between text-xs font-semibold text-zinc-800 hover:text-black transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck size={16} className="text-[#3e462d]" />
                <span>Identity Verification</span>
              </div>
              <ChevronRight size={16} className="text-zinc-400" />
            </button>

            {/* Help & Support */}
            <button
              onClick={() => {
                openModal('help_support');
                closeDrawer();
              }}
              className="py-3.5 flex items-center justify-between text-xs font-semibold text-zinc-800 hover:text-black transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <HelpCircle size={16} className="text-[#3e462d]" />
                <span>Help &amp; Support</span>
              </div>
              <ChevronRight size={16} className="text-zinc-400" />
            </button>

            {/* About us */}
            <button
              onClick={() => {
                openModal('about_us');
                closeDrawer();
              }}
              className="py-3.5 flex items-center justify-between text-xs font-semibold text-zinc-800 hover:text-black transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Info size={16} className="text-[#3e462d]" />
                <span>About us</span>
              </div>
              <ChevronRight size={16} className="text-zinc-400" />
            </button>
          </nav>
        </div>

        {/* Sign Out at bottom matching wireframe */}
        <div className="pt-4 border-t border-zinc-100">
          {isGuest ? (
            <button
              onClick={() => {
                closeDrawer();
                logout();
              }}
              className="w-full py-2.5 text-xs font-semibold text-zinc-700 hover:text-black flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut size={16} />
              <span>Exit Guest Mode / Sign In</span>
            </button>
          ) : (
            <button
              onClick={logout}
              className="w-full py-2.5 text-xs font-semibold text-zinc-600 hover:text-red-600 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

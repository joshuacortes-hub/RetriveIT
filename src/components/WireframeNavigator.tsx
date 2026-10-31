import React, { useState } from 'react';
import { Layers, ChevronUp, Check, Shield, X, LogIn, ExternalLink } from 'lucide-react';
import { useApp, ScreenName } from '../context/AppContext';

export const FloatingPrototypeMenu: React.FC = () => {
  const {
    activeScreen,
    setActiveScreen,
    currentUser,
    openModal,
    openDrawer,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [showBackendInfo, setShowBackendInfo] = useState(false);

  const screenOptions: { id: ScreenName | 'drawer'; label: string; figNum: string }[] = [
    { id: 'login', label: 'Login Screen', figNum: 'Screen 1' },
    { id: 'signup', label: 'Get Started (Sign Up)', figNum: 'Screen 2' },
    { id: 'home', label: 'Home Feed & Grid', figNum: 'Screen 3' },
    { id: 'create_post', label: 'Create New Post', figNum: 'Screen 4' },
    { id: 'drawer', label: 'Side Drawer Menu', figNum: 'Screen 5' },
    { id: 'profile', label: 'Profile & Retriever Points', figNum: 'Screen 6' },
    { id: 'messages', label: 'Messages & Chat', figNum: 'Screen 7' },
    { id: 'notifications', label: 'Notifications Screen', figNum: 'Screen 8' },
  ];

  const handleSelectScreen = (opt: { id: ScreenName | 'drawer' }) => {
    setIsOpen(false);
    if (opt.id === 'drawer') {
      setActiveScreen('home');
      setTimeout(() => openDrawer(), 100);
    } else {
      setActiveScreen(opt.id as ScreenName);
    }
  };

  return (
    <>
      {/* Discreet floating button positioned safely above the bottom navigation bar */}
      <div className="fixed bottom-[max(4.75rem,calc(env(safe-area-inset-bottom)+4.25rem))] left-3 z-40 select-none">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#232819]/90 hover:bg-[#232819] text-[#e8e4dc] hover:text-white text-[11px] font-medium rounded-full shadow-lg border border-[#3e462d]/80 backdrop-blur-md transition-all cursor-pointer"
          title="Switch prototype screens"
        >
          <Layers size={13} className="text-[#bbf7d0]" />
          <span>Screen: <strong>{screenOptions.find((s) => s.id === activeScreen)?.figNum || 'Feed'}</strong></span>
          <ChevronUp size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Screen Switcher Popover */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4">
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
          />

          <div className="relative w-full max-w-sm bg-[#232819] text-white rounded-3xl p-4 shadow-2xl border border-[#3e462d] z-10 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#3e462d]">
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-[#bbf7d0]" />
                <h3 className="font-bold text-xs tracking-wide">Figma Wireframe Screens</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-zinc-400 hover:text-white rounded-full cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-2 flex flex-col divide-y divide-[#323924] max-h-72 overflow-y-auto">
              {screenOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectScreen(opt)}
                  className={`w-full py-2.5 px-2 text-left flex items-center justify-between text-xs hover:bg-[#323924] rounded-lg transition-colors cursor-pointer ${
                    activeScreen === opt.id ? 'text-[#bbf7d0] font-bold bg-[#323924]/60' : 'text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] text-zinc-400 font-mono w-14">{opt.figNum}</span>
                    <span>{opt.label}</span>
                  </div>
                  {activeScreen === opt.id && <Check size={14} className="text-[#bbf7d0]" />}
                </button>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-[#3e462d] flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowBackendInfo(true);
                }}
                className="flex items-center gap-1.5 text-[11px] text-[#bbf7d0] hover:underline font-medium cursor-pointer"
              >
                <Shield size={12} />
                <span>Google Auth &amp; Backend Specs</span>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  openModal('google_auth');
                }}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white text-[11px] rounded-lg font-medium cursor-pointer"
              >
                Test Google Sign In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backend & Google Auth Modal */}
      {showBackendInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowBackendInfo(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />
          <div className="relative w-full max-w-md bg-[#fcfbf7] rounded-3xl p-5 shadow-2xl z-10 border border-[#ebe6dc] text-zinc-900 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-[#3e462d]" />
                <h3 className="font-bold text-sm text-zinc-900">Google Authentication &amp; Backend</h3>
              </div>
              <button
                onClick={() => setShowBackendInfo(false)}
                className="p-1 text-zinc-400 hover:text-zinc-700 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-3 flex flex-col gap-3 text-xs text-zinc-700 leading-relaxed">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <h4 className="font-bold text-emerald-900 text-xs mb-1">
                  ✓ Google Authentication Supported
                </h4>
                <p className="text-emerald-800 text-[11px] leading-relaxed">
                  Yes, Google authentication is fully supported for registration and account access on both Login and Get Started screens.
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#ebe6dc]">
                <h4 className="font-bold text-zinc-900 mb-1.5 text-xs">Production Backend Stack:</h4>
                <ul className="flex flex-col gap-1.5 text-[11px] text-zinc-600 list-disc list-inside">
                  <li><strong>Firebase Auth / Google Identity Services:</strong> Seamless one-click Google Sign-In.</li>
                  <li><strong>Cloud Firestore:</strong> Real-time storage of items, claims, and status updates.</li>
                  <li><strong>Cloud Storage:</strong> Direct photo uploads of found items.</li>
                  <li><strong>WebSockets / Snapshots:</strong> Live messaging between finders and owners.</li>
                </ul>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => {
                    setShowBackendInfo(false);
                    openModal('google_auth');
                  }}
                  className="px-4 py-2 bg-[#3e462d] text-white text-xs font-bold rounded-xl hover:bg-[#343b26] cursor-pointer"
                >
                  Open Google Sign-In Sheet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

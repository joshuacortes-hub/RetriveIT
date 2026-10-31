import React from 'react';
import { Home, PlusCircle, User as UserIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeScreen, setActiveScreen, isGuest, triggerGuestRestriction } = useApp();

  return (
    <nav
      aria-label="Bottom Navigation"
      className="w-full bg-[#fcfbf7] border-t border-[#eae5dc] px-8 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] flex items-center justify-between z-20 shadow-xs"
    >
      {/* Home tab */}
      <button
        onClick={() => setActiveScreen('home')}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-0.5 transition-colors cursor-pointer ${
          activeScreen === 'home' ? 'text-[#3d442c]' : 'text-zinc-400 hover:text-zinc-600'
        }`}
      >
        <Home size={22} strokeWidth={activeScreen === 'home' ? 2.5 : 1.8} />
        <span className="text-[11px] font-medium tracking-tight mt-0.5">Home</span>
      </button>

      {/* Post tab */}
      <button
        onClick={() => {
          if (isGuest) {
            triggerGuestRestriction('post items. Only verified accounts can submit lost or found reports to prevent fake listings.');
          } else {
            setActiveScreen('create_post');
          }
        }}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-0.5 transition-colors cursor-pointer ${
          activeScreen === 'create_post' ? 'text-[#3d442c]' : 'text-zinc-400 hover:text-zinc-600'
        }`}
      >
        <PlusCircle size={22} strokeWidth={activeScreen === 'create_post' ? 2.5 : 1.8} />
        <span className="text-[11px] font-medium tracking-tight mt-0.5">Post</span>
      </button>

      {/* Profile tab */}
      <button
        onClick={() => setActiveScreen('profile')}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-0.5 transition-colors cursor-pointer ${
          activeScreen === 'profile' ? 'text-[#3d442c]' : 'text-zinc-400 hover:text-zinc-600'
        }`}
      >
        <UserIcon size={22} strokeWidth={activeScreen === 'profile' ? 2.5 : 1.8} />
        <span className="text-[11px] font-medium tracking-tight mt-0.5">Profile</span>
      </button>
    </nav>
  );
};

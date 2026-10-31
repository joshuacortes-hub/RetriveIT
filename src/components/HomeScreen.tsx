import React, { useState, useMemo } from 'react';
import { Menu, MessageSquare, Search, Bell, X, Shield, PlusCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBar } from './StatusBar';
import { BottomNav } from './BottomNav';
import { Item, ItemType, ItemStatus } from '../types';

export const HomeScreen: React.FC = () => {
  const {
    items,
    openDrawer,
    setActiveScreen,
    openModal,
    unreadCount,
    isGuest,
    loginWithGoogle,
    triggerGuestRestriction,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'LOST' | 'FOUND' | 'UNCLAIMED'>('ALL');
  const [googleLoading, setGoogleLoading] = useState(false);

  // Filter items based on search and selected filter
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedFilter === 'ALL') return true;
      if (selectedFilter === 'LOST') return item.type === 'LOST';
      if (selectedFilter === 'FOUND') return item.type === 'FOUND';
      if (selectedFilter === 'UNCLAIMED') return item.status === 'UNCLAIMED';

      return true;
    });
  }, [items, searchQuery, selectedFilter]);

  const getStatusColor = (status: ItemStatus) => {
    switch (status) {
      case 'UNCLAIMED':
        return 'text-[#dc2626]';
      case 'UNFOUND':
        return 'text-[#dc2626]';
      case 'FOUND':
        return 'text-[#16a34a]';
      case 'CLAIMED':
        return 'text-[#059669]';
      default:
        return 'text-zinc-600';
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    await loginWithGoogle();
    setGoogleLoading(false);
  };

  return (
    <div className="w-full min-h-screen min-h-[100dvh] flex flex-col justify-between bg-[#fcfbf7] text-[#1a1c16] relative overflow-hidden">
      {/* Top Header Section with safe area top */}
      <div className="bg-[#3e462d] text-white pt-[max(0.6rem,env(safe-area-inset-top))] pb-3.5 px-4 shadow-sm z-10">
        <StatusBar dark />

        {/* Top App Bar: Menu ☰, Search Bar, Chat 💬 */}
        <div className="flex items-center justify-between gap-2.5 mt-2">
          {/* Hamburger button */}
          <button
            onClick={openDrawer}
            aria-label="Open menu"
            className="p-1.5 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <Menu size={24} strokeWidth={2.3} />
          </button>

          {/* Search Bar */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
              <Search size={15} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="search your belong.."
              className="w-full pl-8 pr-7 py-1.5 bg-white text-zinc-900 placeholder:text-zinc-400 text-xs rounded-full border-none focus:outline-none focus:ring-2 focus:ring-white/40 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Messages button */}
          <button
            onClick={() => {
              if (isGuest) {
                triggerGuestRestriction('access direct messaging. Sign in with Google to chat securely.');
              } else {
                setActiveScreen('messages');
              }
            }}
            aria-label="Messages"
            className="p-1.5 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer relative"
          >
            <MessageSquare size={22} strokeWidth={2} />
          </button>
        </div>

        {/* Category filter pills */}
        <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar text-[11px] pb-0.5">
          {(['ALL', 'LOST', 'FOUND', 'UNCLAIMED'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-all cursor-pointer ${
                selectedFilter === filter
                  ? 'bg-white text-[#3e462d] shadow-xs font-semibold'
                  : 'bg-white/15 text-white/90 hover:bg-white/25'
              }`}
            >
              {filter === 'ALL'
                ? 'All Items'
                : filter === 'LOST'
                ? 'Lost Items'
                : filter === 'FOUND'
                ? 'Found Items'
                : 'Unclaimed'}
            </button>
          ))}
        </div>
      </div>

      {/* Guest Mode Restriction Notice & Google Sign-In Banner */}
      {isGuest && (
        <div className="bg-[#f2efe6] border-b border-[#dfdbcf] px-4 py-2.5 flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-zinc-700">
            <Shield size={16} className="text-[#3e462d] shrink-0" />
            <div className="text-[11px] leading-tight">
              <span className="font-bold text-zinc-900">Guest Mode (Viewing only)</span>
              <p className="text-[10px] text-zinc-500">Sign in to post or claim belongings</p>
            </div>
          </div>

          <button
            type="button"
            disabled={googleLoading}
            onClick={handleGoogleSignIn}
            className="px-3 py-1.5 bg-white hover:bg-zinc-50 border border-[#cfc9bb] rounded-xl text-[11px] font-bold text-zinc-800 flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all shrink-0"
          >
            {googleLoading ? (
              <Loader2 size={13} className="animate-spin text-zinc-600" />
            ) : (
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
            <span>Sign in with Google</span>
          </button>
        </div>
      )}

      {/* Main Grid of Items */}
      <div className="flex-1 overflow-y-auto px-0 bg-[#fcfbf7]">
        {filteredItems.length === 0 ? (
          <div className="py-24 px-6 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-[#3e462d]/10 text-[#3e462d] flex items-center justify-center mb-4">
              <PlusCircle size={32} strokeWidth={1.5} />
            </div>
            <h3 className="font-bold text-base text-zinc-900">No items posted yet</h3>
            <p className="text-xs text-zinc-500 mt-1.5 max-w-xs leading-relaxed">
              {isGuest
                ? 'Sign in with your Google account to report a lost belonging or turn in something you found.'
                : 'Be the first to turn lost into found! Post a lost item or report a discovered belonging.'}
            </p>

            {isGuest ? (
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="mt-5 px-5 py-2.5 bg-[#11130e] hover:bg-black text-white text-xs font-bold rounded-2xl flex items-center gap-2 cursor-pointer shadow-sm transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                <span>Sign in with Google to Post</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveScreen('create_post')}
                className="mt-5 px-6 py-2.5 bg-[#3e462d] hover:bg-[#343b26] text-white text-xs font-bold rounded-2xl flex items-center gap-2 cursor-pointer shadow-sm transition-all"
              >
                <span>+ Post a New Item</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 divide-x divide-y divide-[#ebe6dc] border-b border-[#ebe6dc]">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between p-3.5 bg-white/70 hover:bg-white transition-colors group"
              >
                {/* Header row: Date and Status */}
                <div className="flex items-center justify-between text-[10px] pb-2 border-b border-[#f2ede4]">
                  <span className="text-zinc-500 font-medium">{item.date}</span>
                  <span className={`font-semibold tracking-tight uppercase ${getStatusColor(item.status)}`}>
                    Status: {item.status}
                  </span>
                </div>

                {/* Item Image */}
                <div
                  onClick={() => openModal('item_detail', item)}
                  className="my-3.5 flex items-center justify-center h-28 w-full cursor-pointer overflow-hidden rounded-lg bg-zinc-50/70 p-1"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                </div>

                {/* Footer of Card: Bold Item Type & See Details */}
                <div className="text-center pt-1 border-t border-[#f2ede4] flex flex-col items-center">
                  <h3 className="font-extrabold text-xs tracking-wider text-zinc-900 uppercase">
                    {item.type === 'FOUND' ? 'FOUND ITEM' : 'LOST ITEM'}
                  </h3>
                  <button
                    onClick={() => openModal('item_detail', item)}
                    className="text-[11px] text-zinc-500 hover:text-black font-medium mt-0.5 cursor-pointer hover:underline"
                  >
                    See Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Notification Bell */}
      <button
        onClick={() => {
          if (isGuest) {
            triggerGuestRestriction('view notifications. Sign in with Google to receive real-time updates.');
          } else {
            setActiveScreen('notifications');
          }
        }}
        aria-label="Notifications"
        className="absolute bottom-[max(4.75rem,calc(env(safe-area-inset-bottom)+4.25rem))] right-4 w-12 h-12 bg-[#3e462d] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#343b26] active:scale-95 transition-all cursor-pointer z-30"
      >
        <Bell size={20} />
        {!isGuest && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#dc2626] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

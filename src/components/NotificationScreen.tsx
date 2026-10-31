import React from 'react';
import { ArrowLeft, Bell, Check, MessageSquare, Award, ShieldAlert, CheckCircle, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBar } from './StatusBar';
import { AppNotification } from '../types';

export const NotificationScreen: React.FC = () => {
  const {
    notifications,
    setActiveScreen,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    openModal,
    items,
  } = useApp();

  const handleNotificationClick = (n: AppNotification) => {
    markNotificationAsRead(n.id);
    if (n.itemId) {
      const it = items.find((i) => i.id === n.itemId);
      if (it) {
        openModal('item_detail', it);
        return;
      }
    }
    if (n.targetScreen === 'messages') {
      setActiveScreen('messages');
    } else if (n.targetScreen === 'profile') {
      setActiveScreen('profile');
    } else {
      setActiveScreen('home');
    }
  };

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'message':
        return <MessageSquare size={16} className="text-blue-600" />;
      case 'points':
        return <Award size={16} className="text-[#eab308]" />;
      case 'claim':
        return <CheckCircle size={16} className="text-emerald-600" />;
      case 'verification':
        return <Check size={16} className="text-[#3e462d]" />;
      default:
        return <Bell size={16} className="text-zinc-600" />;
    }
  };

  return (
    <div className="w-full min-h-screen min-h-[100dvh] flex flex-col justify-between bg-[#fcfbf7] text-[#1a1c16] relative overflow-hidden">
      {/* Top Olive Bar matching wireframe with safe area top */}
      <div className="bg-[#3e462d] text-white pt-[max(0.6rem,env(safe-area-inset-top))] pb-3.5 px-4 shadow-xs">
        <StatusBar dark />
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveScreen('home')}
              aria-label="Back"
              className="p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft size={20} strokeWidth={2.4} />
            </button>
            <h1 className="font-semibold text-sm tracking-wide">Notification</h1>
          </div>
          <button
            onClick={markAllNotificationsAsRead}
            className="text-[11px] text-white/80 hover:text-white underline cursor-pointer"
          >
            Mark all read
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 divide-y divide-[#ece8df]">
        {notifications.length === 0 ? (
          <div className="py-20 text-center text-zinc-400 text-xs">
            <Bell size={24} className="mx-auto mb-2 opacity-40" />
            No notifications yet
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`py-3 px-3 flex items-start justify-between gap-3 rounded-xl transition-colors cursor-pointer ${
                notif.read ? 'hover:bg-white/80 opacity-75' : 'bg-white shadow-2xs font-medium'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-900 leading-snug">{notif.title}</h3>
                  <p className="text-[11px] text-zinc-600 mt-0.5 leading-relaxed">
                    {notif.description}
                  </p>
                  <span className="text-[9px] text-zinc-400 mt-1 block">{notif.timestamp}</span>
                </div>
              </div>

              {!notif.read && (
                <span className="w-2 h-2 rounded-full bg-[#3e462d] shrink-0 mt-2" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

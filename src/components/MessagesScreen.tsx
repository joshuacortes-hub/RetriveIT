import React, { useState } from 'react';
import { ArrowLeft, Search, MessageSquare, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBar } from './StatusBar';

export const MessagesScreen: React.FC = () => {
  const {
    conversations,
    setActiveScreen,
    openChatWithUser,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter((c) =>
    c.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen min-h-[100dvh] flex flex-col justify-between bg-[#fcfbf7] text-[#1a1c16] relative overflow-hidden">
      {/* Top Olive Bar matching wireframe with safe area top */}
      <div className="bg-[#3e462d] text-white pt-[max(0.6rem,env(safe-area-inset-top))] pb-3.5 px-4 shadow-xs">
        <StatusBar dark />
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => setActiveScreen('home')}
            aria-label="Back"
            className="p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} strokeWidth={2.4} />
          </button>
          <h1 className="font-semibold text-sm tracking-wide">Messages</h1>
        </div>
      </div>

      {/* Search Bar matching wireframe: 🔍 Search conversations */}
      <div className="px-4 py-3 bg-white border-b border-[#ece8df]">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
            <Search size={14} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations"
            className="w-full pl-8.5 pr-8 py-2 bg-[#f4f2ec] border border-[#dfdbd1] rounded-xl text-xs placeholder:text-zinc-400 focus:outline-none focus:border-[#3e462d] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-zinc-400 hover:text-zinc-600"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Conversations List matching wireframe tile */}
      <div className="flex-1 overflow-y-auto px-4 py-3 divide-y divide-[#ece8df]">
        {filteredConversations.length === 0 ? (
          <div className="py-16 text-center text-zinc-400 text-xs">
            <MessageSquare size={24} className="mx-auto mb-2 opacity-40" />
            No conversations found
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() =>
                openChatWithUser({
                  id: conv.participantId,
                  name: conv.participantName,
                  email: conv.participantEmail,
                })
              }
              className="py-3 px-2 flex items-center justify-between hover:bg-white rounded-xl transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                {/* Avatar with letter matching wireframe: 'J' in light olive circle */}
                <div className="w-11 h-11 rounded-full bg-[#dbe2c8] text-[#3e462d] font-bold text-sm flex items-center justify-center shrink-0 border border-[#c4cdad]">
                  {conv.participantName.charAt(0).toUpperCase()}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-xs text-zinc-900">{conv.participantName}</h3>
                    {/* Yellow pill Retriever badge matching wireframe */}
                    <span className="bg-[#fef08a] text-[#854d0e] text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                      {conv.participantRole || 'Retriever'}
                    </span>
                  </div>
                  {/* Message snippet matching "Ikaw naka kita sir?..." */}
                  <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5 group-hover:text-zinc-700">
                    {conv.lastMessage}
                  </p>
                  {/* Date matching "March 15, 2026" */}
                  <span className="text-[10px] text-zinc-400 block mt-0.5">{conv.timestamp}</span>
                </div>
              </div>

              {conv.unreadCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#3e462d]" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

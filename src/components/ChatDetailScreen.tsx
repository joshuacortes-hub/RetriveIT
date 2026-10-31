import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Paperclip, MapPin, CheckCheck, Shield, Phone, MoreVertical } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBar } from './StatusBar';

export const ChatDetailScreen: React.FC = () => {
  const {
    selectedConversationId,
    conversations,
    messages,
    sendMessage,
    setActiveScreen,
    currentUser,
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === selectedConversationId);
  const convMessages = selectedConversationId ? messages[selectedConversationId] || [] : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [convMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || !selectedConversationId) return;
    sendMessage(selectedConversationId, inputVal);
    setInputVal('');
  };

  const handleSendLocation = () => {
    if (!selectedConversationId) return;
    sendMessage(selectedConversationId, '📍 Meetup Location: North Campus Student Center Lost & Found Desk');
  };

  return (
    <div className="w-full min-h-screen min-h-[100dvh] flex flex-col justify-between bg-[#fcfbf7] text-[#1a1c16] relative overflow-hidden">
      {/* Top Olive Bar with safe area top */}
      <div className="bg-[#3e462d] text-white pt-[max(0.6rem,env(safe-area-inset-top))] pb-3 px-4 shadow-xs">
        <StatusBar dark />
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveScreen('messages')}
              aria-label="Back to messages"
              className="p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft size={20} strokeWidth={2.4} />
            </button>
            <div className="w-8 h-8 rounded-full bg-[#dbe2c8] text-[#3e462d] font-bold text-xs flex items-center justify-center">
              {activeConv?.participantName.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-bold text-xs tracking-wide">
                  {activeConv?.participantName || 'Chat'}
                </h1>
                <span className="bg-[#fef08a] text-[#854d0e] text-[8px] font-extrabold px-1.5 py-0.2 rounded-full uppercase">
                  {activeConv?.participantRole || 'Retriever'}
                </span>
              </div>
              <p className="text-[10px] text-white/70">Online • Verified community member</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => alert(`Connecting call with ${activeConv?.participantName}...`)}
              className="p-1.5 hover:bg-white/10 rounded-full text-white/90"
              title="Call"
            >
              <Phone size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="bg-[#f2efe6] px-4 py-2 border-b border-[#e2ddd3] flex items-center justify-between text-[11px] text-zinc-600">
        <div className="flex items-center gap-1.5">
          <Shield size={13} className="text-[#3e462d]" />
          <span>Keep transactions on campus or public verified areas.</span>
        </div>
        <button
          onClick={handleSendLocation}
          className="text-[10px] font-bold text-[#3e462d] underline cursor-pointer"
        >
          Share Campus Desk
        </button>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5">
        {convMessages.map((msg) => {
          const isMe = msg.senderId === currentUser?.id || msg.senderId === 'usr_current';
          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[80%] ${
                isMe ? 'self-end items-end' : 'self-start items-start'
              }`}
            >
              <div
                className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                  isMe
                    ? 'bg-[#3e462d] text-white rounded-br-xs'
                    : 'bg-white text-zinc-900 border border-[#e5e0d5] rounded-bl-xs'
                }`}
              >
                {msg.text}
              </div>
              <div className="flex items-center gap-1 mt-0.5 px-1 text-[9px] text-zinc-400">
                <span>{msg.timestamp}</span>
                {isMe && <CheckCheck size={11} className="text-zinc-400" />}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Bar with Android safe area bottom */}
      <form
        onSubmit={handleSend}
        className="p-3 pb-[max(0.75rem,calc(env(safe-area-inset-bottom)+0.5rem))] bg-white border-t border-[#ece8df] flex items-center gap-2"
      >
        <button
          type="button"
          onClick={() => alert('Photo attachments are supported. You can select an item image to share in chat.')}
          className="p-2 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100 cursor-pointer"
        >
          <Paperclip size={18} />
        </button>

        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Write a message..."
          className="flex-1 py-2 px-3.5 bg-[#f4f2ec] border border-[#dfdbd1] rounded-full text-xs placeholder:text-zinc-400 focus:outline-none focus:border-[#3e462d]"
        />

        <button
          type="submit"
          disabled={!inputVal.trim()}
          className="p-2 bg-[#3e462d] hover:bg-[#343b26] disabled:opacity-40 text-white rounded-full transition-colors cursor-pointer shadow-xs"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

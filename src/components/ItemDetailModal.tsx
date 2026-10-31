import React, { useState } from 'react';
import { X, MapPin, Calendar, Tag, ShieldCheck, MessageSquare, CheckCircle, Share2, Award, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Item, ItemStatus } from '../types';

export const ItemDetailModal: React.FC = () => {
  const {
    activeModal,
    closeModal,
    selectedModalItem,
    claimItem,
    markItemResolved,
    openChatWithUser,
    currentUser,
    openModal,
    isGuest,
    triggerGuestRestriction,
    loginWithGoogle,
  } = useApp();

  const [claimNote, setClaimNote] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (activeModal !== 'item_detail' || !selectedModalItem) return null;

  const item = selectedModalItem;
  const isAuthor = currentUser?.id === item.authorId || currentUser?.email === item.authorEmail;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimNote.trim()) {
      alert('Please describe unique identifying details to verify ownership.');
      return;
    }
    claimItem(item.id, claimNote);
    setIsClaiming(false);
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={closeModal}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-[#fcfbf7] rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[88dvh] pb-[max(0.5rem,env(safe-area-inset-bottom))] animate-in zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-[#3e462d] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20">
              {item.type} ITEM
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                item.status === 'CLAIMED' || item.status === 'FOUND'
                  ? 'bg-emerald-500/20 text-emerald-200'
                  : 'bg-amber-500/20 text-amber-200'
              }`}
            >
              Status: {item.status}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleShare}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white/90"
              title="Share Link"
            >
              <Share2 size={16} />
            </button>
            <button
              onClick={closeModal}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white/90 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {/* Item Photo */}
          <div className="w-full h-52 bg-white rounded-2xl border border-[#ebe6dc] p-3 flex items-center justify-center shadow-2xs overflow-hidden">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {copiedLink && (
            <div className="p-2 bg-emerald-50 text-emerald-700 text-xs rounded-lg text-center font-medium">
              Link copied to clipboard!
            </div>
          )}

          {/* Title & Metadata */}
          <div>
            <h2 className="text-lg font-bold text-zinc-900 leading-snug">{item.title}</h2>

            <div className="flex flex-wrap gap-3 mt-2.5 text-xs text-zinc-600">
              <div className="flex items-center gap-1">
                <Calendar size={13} className="text-[#3e462d]" />
                <span>Reported: {item.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Tag size={13} className="text-[#3e462d]" />
                <span>{item.category}</span>
              </div>
            </div>

            <div className="flex items-start gap-1.5 mt-2 text-xs text-zinc-700 bg-white p-2.5 rounded-xl border border-[#ebe6dc]">
              <MapPin size={15} className="text-[#3e462d] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-zinc-800">Location:</span> {item.location}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#ebe6dc]">
            <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1.5">
              Description &amp; Details
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed whitespace-pre-wrap">{item.details}</p>
          </div>

          {/* Poster / Finder Info */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#ebe6dc] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#dbe2c8] text-[#3e462d] font-bold text-sm flex items-center justify-center">
                {item.authorName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-xs text-zinc-900">{item.authorName}</h4>
                  <span className="bg-[#fef08a] text-[#854d0e] text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase">
                    Retriever
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500">Verified Retriever • 98% Trust Score</p>
              </div>
            </div>

            {!isAuthor && (
              <button
                onClick={() => {
                  if (isGuest) {
                    triggerGuestRestriction('contact the finder. Sign in with Google to chat securely.');
                  } else {
                    closeModal();
                    openChatWithUser(
                      {
                        id: item.authorId,
                        name: item.authorName,
                        email: item.authorEmail,
                      },
                      item
                    );
                  }
                }}
                className="px-3 py-1.5 bg-[#3e462d] text-white text-xs font-medium rounded-xl hover:bg-[#343b26] flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <MessageSquare size={13} />
                <span>Chat</span>
              </button>
            )}
          </div>

          {/* Guest notice banner inside item detail */}
          {isGuest && (
            <div className="p-3 bg-[#f2efe6] border border-[#dfdbcf] rounded-2xl flex flex-col gap-2 text-center">
              <p className="text-xs text-zinc-700 font-medium">
                Viewing as Guest • Sign in with Google to claim this item or contact the finder.
              </p>
              <button
                type="button"
                onClick={() => {
                  closeModal();
                  loginWithGoogle();
                }}
                className="w-full py-2 bg-[#11130e] hover:bg-black text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Sign in with Google</span>
              </button>
            </div>
          )}

          {/* Claim flow interactive panel */}
          {isClaiming ? (
            <form onSubmit={handleClaimSubmit} className="bg-white p-4 rounded-2xl border border-[#3e462d] shadow-sm flex flex-col gap-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#3e462d]">
                <ShieldCheck size={16} />
                <span>Verify Your Ownership</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-snug">
                To prevent fraud, describe details that only the true owner would know:
              </p>
              <textarea
                value={claimNote}
                onChange={(e) => setClaimNote(e.target.value)}
                placeholder="Example: Lock screen photo, serial number, cards inside..."
                rows={3}
                required
                className="w-full p-2.5 bg-[#fcfbf7] border border-[#dfdbcf] rounded-xl text-xs placeholder:text-zinc-400 focus:outline-none focus:border-[#3e462d]"
              />
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsClaiming(false)}
                  className="px-3 py-1.5 text-xs text-zinc-600 hover:text-black font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#11130e] text-white text-xs font-bold rounded-xl hover:bg-black cursor-pointer shadow-xs"
                >
                  Submit Claim Verification
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center gap-2 pt-2">
              {item.status !== 'CLAIMED' && !isAuthor && (
                <button
                  onClick={() => {
                    if (isGuest) {
                      triggerGuestRestriction('claim items. Sign in with Google to prove ownership.');
                    } else {
                      setIsClaiming(true);
                    }
                  }}
                  className="flex-1 py-3 bg-[#11130e] hover:bg-[#23261d] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99] transition-all"
                >
                  <ShieldCheck size={16} />
                  <span>Claim This Item</span>
                </button>
              )}

              {isAuthor && item.status !== 'CLAIMED' && (
                <button
                  onClick={() => {
                    markItemResolved(item.id);
                    closeModal();
                  }}
                  className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
                >
                  <CheckCircle size={16} />
                  <span>Mark as Resolved / Claimed</span>
                </button>
              )}

              {item.status === 'CLAIMED' && (
                <div className="flex-1 py-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl flex items-center justify-center gap-2 border border-emerald-200">
                  <CheckCircle size={16} />
                  <span>Item Verified &amp; Claimed</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

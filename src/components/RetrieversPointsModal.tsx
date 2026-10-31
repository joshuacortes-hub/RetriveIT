import React, { useState } from 'react';
import { X, Award, Coffee, BookOpen, Gift, CheckCircle, Sparkles, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

export const RetrieversPointsModal: React.FC = () => {
  const { activeModal, closeModal, currentUser } = useApp();
  const [redeemed, setRedeemed] = useState<string | null>(null);

  if (activeModal !== 'retrievers_points') return null;

  const points = currentUser?.points ?? 0;

  const rewards = [
    {
      id: 'rew_1',
      title: '$5 Campus Coffee Voucher',
      cost: 150,
      icon: <Coffee size={18} className="text-amber-700" />,
      desc: 'Valid at all University cafeteria cafes & Starbucks',
    },
    {
      id: 'rew_2',
      title: '$15 Bookstore Gift Card',
      cost: 300,
      icon: <BookOpen size={18} className="text-blue-700" />,
      desc: 'Redeemable on textbooks, stationery, and supplies',
    },
    {
      id: 'rew_3',
      title: 'RetrieveIT Official Hoodie',
      cost: 500,
      icon: <Gift size={18} className="text-purple-700" />,
      desc: 'Exclusive embroidered champion retriever apparel',
    },
  ];

  const handleRedeem = (rewardId: string, cost: number) => {
    if (points < cost) {
      alert('You need more points to redeem this reward!');
      return;
    }
    setRedeemed(rewardId);
    confetti({ particleCount: 75, spread: 80, origin: { y: 0.5 } });
    setTimeout(() => setRedeemed(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={closeModal}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#fcfbf7] rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 bg-[#11130e] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#eab308] text-[#11130e] flex items-center justify-center font-bold">
              <Award size={18} />
            </div>
            <div>
              <h2 className="font-bold text-sm">Retrievers Points</h2>
              <p className="text-[10px] text-zinc-400">Community Loyalty &amp; Good Karma</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
          {/* Points summary card */}
          <div className="p-4 bg-gradient-to-br from-[#3e462d] to-[#272c1c] text-white rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] text-white/70 uppercase font-bold tracking-wider">
                Current Balance
              </span>
              <div className="text-3xl font-extrabold text-[#eab308] mt-0.5 tracking-tight flex items-baseline gap-1.5">
                <span>{points}</span>
                <span className="text-xs text-white/80 font-normal">points</span>
              </div>
              <p className="text-[10px] text-white/60 mt-1">Tier: Level 3 Gold Retriever</p>
            </div>

            <div className="w-16 h-16 rounded-full border-4 border-[#eab308]/40 bg-white/10 flex flex-col items-center justify-center text-center">
              <Sparkles size={18} className="text-[#eab308]" />
              <span className="text-[9px] font-bold text-white mt-0.5">Top 5%</span>
            </div>
          </div>

          {/* How to earn points */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#ebe6dc]">
            <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <TrendingUp size={14} className="text-[#3e462d]" />
              <span>How to Earn Points</span>
            </h3>
            <ul className="text-xs text-zinc-600 flex flex-col gap-1.5">
              <li className="flex items-center justify-between">
                <span>Hand over a found item to owner</span>
                <span className="font-bold text-emerald-600">+100 pts</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Submit a detailed lost/found post</span>
                <span className="font-bold text-emerald-600">+25 pts</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Complete Identity Verification</span>
                <span className="font-bold text-emerald-600">+100 pts</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Daily community check-in</span>
                <span className="font-bold text-emerald-600">+5 pts</span>
              </li>
            </ul>
          </div>

          {/* Rewards Store */}
          <div>
            <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider mb-2.5">
              Rewards Marketplace
            </h3>
            <div className="flex flex-col gap-2.5">
              {rewards.map((rew) => (
                <div
                  key={rew.id}
                  className="p-3 bg-white border border-[#ebe6dc] rounded-2xl flex items-center justify-between shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0">
                      {rew.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-zinc-900">{rew.title}</h4>
                      <p className="text-[10px] text-zinc-500">{rew.desc}</p>
                      <span className="text-[11px] font-bold text-[#3e462d]">
                        {rew.cost} points
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRedeem(rew.id, rew.cost)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      redeemed === rew.id
                        ? 'bg-emerald-600 text-white'
                        : points >= rew.cost
                        ? 'bg-[#11130e] hover:bg-black text-white'
                        : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                    }`}
                  >
                    {redeemed === rew.id ? 'Claimed!' : 'Redeem'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

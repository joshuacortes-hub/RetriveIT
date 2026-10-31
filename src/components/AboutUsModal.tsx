import React from 'react';
import { X, Heart, Shield, Users, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AboutUsModal: React.FC = () => {
  const { activeModal, closeModal } = useApp();

  if (activeModal !== 'about_us') return null;

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
        <div className="px-5 py-4 bg-[#3e462d] text-white flex items-center justify-between">
          <div>
            <h2 className="font-bold text-sm italic font-serif text-lg tracking-wide">About RetrieveIT</h2>
            <p className="text-[10px] text-white/70">Turning lost into found together</p>
          </div>
          <button
            onClick={closeModal}
            className="p-1 hover:bg-white/10 rounded-full text-white/80 hover:text-white cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 text-xs text-zinc-700 leading-relaxed">
          <div className="p-4 bg-white rounded-2xl border border-[#ebe6dc] shadow-2xs">
            <h3 className="font-bold text-sm text-zinc-900 mb-1.5 flex items-center gap-1.5">
              <Heart size={16} className="text-red-500 fill-red-500" />
              <span>Our Community Mission</span>
            </h3>
            <p className="text-zinc-600 leading-relaxed text-[11px]">
              RetrieveIT was created to eliminate the frustration of lost belongings. Every day, valuable items—wallets, smartphones, laptops, keys, and IDs—are left behind in lecture halls, cafeterias, libraries, and transit stations. RetrieveIT empowers honest finders (&quot;Retrievers&quot;) to quickly reunite items with their rightful owners.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-2xl border border-[#ebe6dc] shadow-2xs">
              <Users size={16} className="text-[#3e462d] mb-1" />
              <h4 className="font-bold text-xs text-zinc-900">4,200+</h4>
              <p className="text-[10px] text-zinc-500">Active Campus Retrievers</p>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-[#ebe6dc] shadow-2xs">
              <Sparkles size={16} className="text-[#eab308] mb-1" />
              <h4 className="font-bold text-xs text-zinc-900">92.4%</h4>
              <p className="text-[10px] text-zinc-500">Successful Return Rate</p>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border border-[#ebe6dc] text-[11px] text-zinc-600">
            <h4 className="font-bold text-zinc-800 mb-1 flex items-center gap-1.5">
              <Shield size={14} className="text-[#3e462d]" />
              <span>Privacy &amp; Community Standards</span>
            </h4>
            <p>
              We protect your privacy. Contact details are never exposed publicly; communications take place via secure encrypted in-app messaging.
            </p>
          </div>

          <button
            onClick={closeModal}
            className="w-full py-2.5 bg-[#11130e] text-white text-xs font-bold rounded-xl hover:bg-black transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

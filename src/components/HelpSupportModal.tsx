import React, { useState } from 'react';
import { X, HelpCircle, MessageCircle, FileText, ExternalLink, ShieldCheck, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HelpSupportModal: React.FC = () => {
  const { activeModal, closeModal, openChatWithUser } = useApp();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  if (activeModal !== 'help_support') return null;

  const faqs = [
    {
      q: 'How does RetrieveIT prevent false claims?',
      a: 'We use verification prompts where claimants must supply identifying traits (lock screen photo, unique scratches, internal contents, or serial numbers). For high-value items, identity verification is required.',
    },
    {
      q: 'Where is the official campus handover point?',
      a: 'The central Student Union Lost & Found desk (Open Mon-Fri 8am-6pm) provides a safe, monitored location with staff who log item handovers.',
    },
    {
      q: 'What do I get for returning someone’s lost belonging?',
      a: 'Retrievers earn karma points that can be redeemed for campus cafe vouchers, bookstore discounts, and community badges, plus any cash reward posted by the owner.',
    },
    {
      q: 'Can I post anonymously?',
      a: 'Yes, you can turn on guest or alias mode, but having a verified Retriever badge increases community response speed and trust.',
    },
  ];

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
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-200 flex items-center justify-center font-bold">
              <HelpCircle size={18} />
            </div>
            <div>
              <h2 className="font-bold text-sm">Help &amp; Support</h2>
              <p className="text-[10px] text-white/70">Community Safety &amp; Guides</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1 hover:bg-white/10 rounded-full text-white/80 hover:text-white cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {/* Live Support Banner */}
          <div className="p-4 bg-white border border-[#ebe6dc] rounded-2xl flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <MessageCircle size={18} />
              </div>
              <div>
                <h3 className="font-bold text-xs text-zinc-900">Live Support Chat</h3>
                <p className="text-[10px] text-zinc-500">Available 24/7 for lost item escalation</p>
              </div>
            </div>
            <button
              onClick={() => {
                closeModal();
                openChatWithUser({
                  id: 'usr_support',
                  name: 'RetrieveIT Support Team',
                  email: 'support@retrieveit.app',
                });
              }}
              className="px-3 py-1.5 bg-[#3e462d] text-white text-xs font-bold rounded-xl hover:bg-[#343b26] cursor-pointer"
            >
              Start Chat
            </button>
          </div>

          {/* FAQs */}
          <div>
            <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider mb-2">
              Frequently Asked Questions
            </h3>
            <div className="flex flex-col gap-2">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[#ebe6dc] rounded-2xl overflow-hidden shadow-2xs"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full p-3.5 text-left text-xs font-bold text-zinc-800 flex items-center justify-between hover:bg-zinc-50 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="text-zinc-400 text-sm ml-2">{activeFaq === idx ? '−' : '+'}</span>
                  </button>
                  {activeFaq === idx && (
                    <div className="px-3.5 pb-3.5 pt-1 text-xs text-zinc-600 leading-relaxed border-t border-zinc-100 bg-[#fcfbf7]/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Mail, Check, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const EditEmailModal: React.FC = () => {
  const { activeModal, closeModal, currentUser, updateEmail } = useApp();
  const [newEmail, setNewEmail] = useState(currentUser?.email || '');
  const [error, setError] = useState<string | null>(null);

  if (activeModal !== 'edit_email') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newEmail.includes('@') || !newEmail.includes('.')) {
      setError('Please provide a valid email address.');
      return;
    }

    updateEmail(newEmail.trim().toLowerCase());
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={closeModal}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col animate-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-[#3e462d]" />
            <h3 className="font-bold text-xs text-zinc-900">Update Account Email</h3>
          </div>
          <button onClick={closeModal} className="text-zinc-400 hover:text-zinc-600 cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-3">
          {error && (
            <div className="p-2 bg-red-50 text-red-700 text-[11px] rounded-lg flex items-center gap-1.5">
              <AlertCircle size={13} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold text-zinc-600 block mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-[#fcfbf7] border border-[#dfdbcf] rounded-xl text-xs focus:outline-none focus:border-[#3e462d]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-3 py-1.5 text-xs text-zinc-600 hover:text-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#11130e] hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Save Email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

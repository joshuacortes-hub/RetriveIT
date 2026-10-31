import React, { useState } from 'react';
import { X, Lock, Shield, Smartphone, Key, Check, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AccountSecurityModal: React.FC = () => {
  const { activeModal, closeModal } = useApp();
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [twoFactor, setTwoFactor] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (activeModal !== 'account_security') return null;

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!currentPass || !newPass || !confirmPass) {
      setErrorMsg('Please fill out all password fields.');
      return;
    }
    if (newPass.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }
    if (newPass !== confirmPass) {
      setErrorMsg('New passwords do not match.');
      return;
    }

    setSuccessMsg('Your password has been successfully updated!');
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    setTimeout(() => setSuccessMsg(null), 3000);
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
        <div className="px-5 py-4 bg-[#3e462d] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold">
              <Lock size={18} />
            </div>
            <div>
              <h2 className="font-bold text-sm">Account Security</h2>
              <p className="text-[10px] text-white/70">Passwords &amp; Authentication</p>
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
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <Check size={16} className="text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle size={16} className="text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Change Password Form */}
          <form onSubmit={handlePasswordChange} className="bg-white p-4 rounded-2xl border border-[#ebe6dc] flex flex-col gap-3">
            <h3 className="font-bold text-xs text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
              <Key size={14} className="text-[#3e462d]" />
              <span>Change Password</span>
            </h3>

            <div>
              <label className="text-[11px] font-semibold text-zinc-600 block mb-1">Current Password</label>
              <input
                type="password"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-[#fcfbf7] border border-[#dfdbcf] rounded-xl text-xs focus:outline-none focus:border-[#3e462d]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-zinc-600 block mb-1">New Password</label>
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-[#fcfbf7] border border-[#dfdbcf] rounded-xl text-xs focus:outline-none focus:border-[#3e462d]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-zinc-600 block mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-[#fcfbf7] border border-[#dfdbcf] rounded-xl text-xs focus:outline-none focus:border-[#3e462d]"
              />
            </div>

            <button
              type="submit"
              className="mt-1 py-2 bg-[#11130e] hover:bg-black text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
            >
              Update Password
            </button>
          </form>

          {/* 2FA Toggle */}
          <div className="bg-white p-4 rounded-2xl border border-[#ebe6dc] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <Smartphone size={16} />
              </div>
              <div>
                <h4 className="font-bold text-xs text-zinc-800">Two-Factor Authentication</h4>
                <p className="text-[10px] text-zinc-500">Require OTP code for logging into new devices</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setTwoFactor(!twoFactor)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                twoFactor ? 'bg-[#3e462d]' : 'bg-zinc-300'
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform absolute top-1 ${
                  twoFactor ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

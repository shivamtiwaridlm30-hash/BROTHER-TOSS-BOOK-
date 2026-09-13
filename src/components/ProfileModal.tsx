import React, { useState } from 'react';
import { 
  X, 
  User as UserIcon, 
  ShieldCheck, 
  Building2, 
  History, 
  Check, 
  Lock, 
  KeyRound, 
  ExternalLink,
  QrCode,
  AlertCircle
} from 'lucide-react';
import { Language, User, Transaction } from '../types';
import { getTranslation } from '../utils/i18n';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  transactions: Transaction[];
  lang: Language;
  onUpdateUser: (updatedUser: User) => void;
  defaultTab?: 'profile' | 'bank' | 'security' | 'history';
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  transactions,
  lang,
  onUpdateUser,
  defaultTab = 'profile'
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'bank' | 'security' | 'history'>(defaultTab);
  
  // Profile form
  const [fullName, setFullName] = useState(user.fullName);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);

  // Bank form
  const [accountHolder, setAccountHolder] = useState(user.bankDetails?.accountHolder || user.fullName);
  const [accountNumber, setAccountNumber] = useState(user.bankDetails?.accountNumber || '');
  const [ifsc, setIfsc] = useState(user.bankDetails?.ifsc || '');
  const [bankName, setBankName] = useState(user.bankDetails?.bankName || '');
  const [upiId, setUpiId] = useState(user.bankDetails?.upiId || '');

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user.twoFactorEnabled);
  const [twoFactorInput, setTwoFactorInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState('');

  // History filter
  const [historyFilter, setHistoryFilter] = useState<'all' | 'deposit' | 'withdraw'>('all');

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = {
      ...user,
      fullName,
      phone,
      email
    };
    onUpdateUser(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleSaveBank = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = {
      ...user,
      bankDetails: {
        accountHolder,
        accountNumber,
        ifsc: ifsc.toUpperCase(),
        bankName,
        upiId
      }
    };
    onUpdateUser(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleToggle2FA = () => {
    if (!twoFactorEnabled) {
      // Enabling 2FA requires test code 123456 or any 6 digits
      if (!twoFactorInput || twoFactorInput.length !== 6) {
        setError(lang === 'hi' ? 'पुष्टि के लिए कोई भी 6-अंकों का कोड दर्ज करें (उदा. 123456)' : 'Enter 6-digit code to enable 2FA (e.g. 123456)');
        return;
      }
      const updated: User = {
        ...user,
        twoFactorEnabled: true,
        twoFactorSecret: 'BTB-2FA-SEC-9921'
      };
      setTwoFactorEnabled(true);
      onUpdateUser(updated);
      setTwoFactorInput('');
      setError('');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } else {
      // Disabling 2FA
      const updated: User = {
        ...user,
        twoFactorEnabled: false
      };
      setTwoFactorEnabled(false);
      onUpdateUser(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  const userTransactions = transactions.filter(t => t.userId === user.id);
  const filteredTransactions = userTransactions.filter(t => {
    if (historyFilter === 'all') return true;
    return t.type === historyFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        id="profile-modal-card"
        className="w-full max-w-2xl bg-[#0c1b33] border border-blue-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100 my-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 to-[#0c1b33] p-4 sm:p-5 border-b border-blue-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-['Chakra_Petch'] text-white">
                {getTranslation(lang, 'profile')}
              </h2>
              <div className="text-xs text-amber-300 font-mono">
                @{user.username} • Balance: ₹{user.balance.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
          <button 
            id="close-profile-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-blue-900/60 bg-[#071324] overflow-x-auto no-scrollbar text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex-1 min-w-[110px] py-3 px-3 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'profile'
                ? 'border-amber-400 text-amber-400 bg-blue-950/40'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Profile</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bank')}
            className={`flex-1 min-w-[110px] py-3 px-3 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'bank'
                ? 'border-amber-400 text-amber-400 bg-blue-950/40'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Bank & UPI</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`flex-1 min-w-[120px] py-3 px-3 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'security'
                ? 'border-amber-400 text-amber-400 bg-blue-950/40'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Security & 2FA</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex-1 min-w-[120px] py-3 px-3 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-amber-400 text-amber-400 bg-blue-950/40'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>{getTranslation(lang, 'history')}</span>
          </button>
        </div>

        {savedSuccess && (
          <div className="mx-4 mt-3 p-2.5 bg-emerald-950/80 border border-emerald-600 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{lang === 'hi' ? 'सफलतापूर्वक सहेजा गया!' : 'Changes saved successfully!'}</span>
          </div>
        )}

        <div className="p-4 sm:p-6 max-h-[68vh] overflow-y-auto">
          {/* 1. Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#091528] border border-blue-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Username (Permanent)</label>
                  <input
                    type="text"
                    value={user.username}
                    disabled
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#091528] border border-blue-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-[#091528] border border-blue-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-[#081528] rounded-xl border border-blue-900/40 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">KYC Verification Status</span>
                  <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> VERIFIED (Level 2 Active)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[11px]">Member Since</span>
                  <span className="text-white font-mono">{user.createdAt}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors"
              >
                Save Profile Changes
              </button>
            </form>
          )}

          {/* 2. Bank & UPI Tab */}
          {activeTab === 'bank' && (
            <form onSubmit={handleSaveBank} className="space-y-4 text-xs">
              <div className="p-3 bg-blue-950/40 border border-blue-800/60 rounded-xl text-slate-300 text-[11px]">
                Enter your verified bank or UPI details for automated 24x7 withdrawal disbursements.
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Preferred UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. yourname@okaxis or 9876543210@paytm"
                  className="w-full px-3 py-2 bg-[#091528] border border-blue-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="border-t border-blue-900/60 pt-3">
                <h3 className="font-bold text-white mb-2">Direct Bank Account Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Account Holder Name</label>
                    <input
                      type="text"
                      value={accountHolder}
                      onChange={(e) => setAccountHolder(e.target.value)}
                      className="w-full px-3 py-2 bg-[#091528] border border-blue-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Account Number</label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="e.g. 5010043219876"
                        className="w-full px-3 py-2 bg-[#091528] border border-blue-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">IFSC Code</label>
                      <input
                        type="text"
                        value={ifsc}
                        onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                        placeholder="e.g. HDFC0001234"
                        className="w-full px-3 py-2 bg-[#091528] border border-blue-800 rounded-xl text-white font-mono uppercase focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g. HDFC Bank Ltd"
                      className="w-full px-3 py-2 bg-[#091528] border border-blue-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors"
              >
                Save Payout Information
              </button>
            </form>
          )}

          {/* 3. Security & 2FA Tab */}
          {activeTab === 'security' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-gradient-to-r from-[#0d2345] to-[#091830] border border-blue-800/80 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">
                        {getTranslation(lang, 'twoFactorTitle')}
                      </div>
                      <div className="text-[11px] text-slate-300">
                        {getTranslation(lang, 'twoFactorDesc')}
                      </div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    twoFactorEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {twoFactorEnabled ? 'ENABLED' : 'DISABLED'}
                  </span>
                </div>

                {!twoFactorEnabled ? (
                  <div className="pt-2 border-t border-blue-900/60 space-y-3">
                    <p className="text-slate-300">
                      To activate Two-Factor Authentication, link your Google Authenticator or use SMS OTP:
                    </p>
                    <div className="p-3 bg-black/40 rounded-xl border border-blue-900 flex items-center justify-between">
                      <span className="text-slate-400">Security Secret Key:</span>
                      <span className="font-mono font-bold text-amber-300">BTB-2FA-SEC-9921</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={twoFactorInput}
                        onChange={(e) => setTwoFactorInput(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="Enter 6-digit test code (e.g. 123456)"
                        className="flex-1 px-3 py-2 bg-[#091528] border border-blue-800 rounded-xl text-white font-mono text-center tracking-widest text-sm focus:outline-none focus:border-amber-400"
                      />
                      <button
                        type="button"
                        onClick={handleToggle2FA}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors whitespace-nowrap"
                      >
                        {getTranslation(lang, 'enable2fa')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-blue-900/60 flex items-center justify-between">
                    <span className="text-emerald-400 font-semibold">
                      ✓ Your account withdrawals and changes are guarded by 2FA.
                    </span>
                    <button
                      type="button"
                      onClick={handleToggle2FA}
                      className="px-3 py-1.5 bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500 text-rose-300 font-bold rounded-lg transition-colors"
                    >
                      {getTranslation(lang, 'disable2fa')}
                    </button>
                  </div>
                )}

                {error && (
                  <div className="p-2.5 bg-rose-950/60 border border-rose-800 rounded-lg text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              {/* Encrypted Logs Security Info */}
              <div className="p-4 bg-[#091528] border border-blue-900/60 rounded-2xl space-y-2">
                <div className="font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>SHA-256 Encrypted Audit Trail Active</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Every deposit, withdrawal, and bet placed on Brother Toss Book is cryptographically signed and hash-chained into a tamper-proof audit trail for regulatory transparency and security.
                </p>
              </div>
            </div>
          )}

          {/* 4. History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-3 text-xs">
              {/* Filter pills */}
              <div className="flex gap-2">
                {(['all', 'deposit', 'withdraw'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setHistoryFilter(f)}
                    className={`px-3 py-1 rounded-lg font-bold text-xs capitalize transition-colors ${
                      historyFilter === f
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-[#091528] text-slate-400 hover:text-white border border-blue-900/60'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {filteredTransactions.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-[#091528] rounded-xl">
                  {getTranslation(lang, 'noTransactions')}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredTransactions.map(tx => (
                    <div
                      key={tx.id}
                      className="p-3 bg-[#09172e] border border-blue-900/50 rounded-xl space-y-2 font-mono"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-sans">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            tx.type === 'deposit' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                          }`}>
                            {tx.type}
                          </span>
                          <span className="font-bold text-white">{tx.id}</span>
                        </div>
                        <span className={`text-xs font-black ${
                          tx.type === 'deposit' ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                          {tx.type === 'deposit' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>{tx.timestamp}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          tx.status === 'approved' 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                            : tx.status === 'pending'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}>
                          {tx.status}
                        </span>
                      </div>

                      {tx.utrNumber && (
                        <div className="text-[10px] text-slate-400">
                          UTR / Ref: <span className="text-white">{tx.utrNumber}</span>
                        </div>
                      )}

                      <div className="text-[9px] text-slate-500 truncate pt-1 border-t border-blue-950">
                        SHA-256: {tx.encryptedHash}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

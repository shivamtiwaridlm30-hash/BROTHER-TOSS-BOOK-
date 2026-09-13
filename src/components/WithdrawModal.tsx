import React, { useState } from 'react';
import { 
  X, 
  ArrowUpRight, 
  Building2, 
  Smartphone, 
  ShieldCheck, 
  AlertCircle, 
  Lock, 
  Check, 
  Clock 
} from 'lucide-react';
import { Language, User, Transaction } from '../types';
import { getTranslation } from '../utils/i18n';
import { createEncryptedRecord } from '../utils/crypto';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  lang: Language;
  onWithdrawSuccess: (transaction: Transaction, newBalance: number) => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  user,
  lang,
  onWithdrawSuccess
}) => {
  const [method, setMethod] = useState<'upi' | 'bank'>('upi');
  const [amount, setAmount] = useState<string>('1000');
  const [upiId, setUpiId] = useState(user.bankDetails?.upiId || '');
  const [holderName, setHolderName] = useState(user.bankDetails?.accountHolder || user.fullName);
  const [accountNumber, setAccountNumber] = useState(user.bankDetails?.accountNumber || '');
  const [ifsc, setIfsc] = useState(user.bankDetails?.ifsc || '');
  const [bankName, setBankName] = useState(user.bankDetails?.bankName || '');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successTxn, setSuccessTxn] = useState<Transaction | null>(null);

  const parsedAmount = parseInt(amount, 10) || 0;

  const handleQuickAmount = (val: number) => {
    setAmount(val.toString());
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedAmount < 500) {
      setError(lang === 'hi' ? 'न्यूनतम निकासी राशि ₹500 है' : 'Minimum withdrawal is ₹500');
      return;
    }
    if (parsedAmount > user.balance) {
      setError(lang === 'hi' ? 'अपर्याप्त बैलेंस! आपके पास केवल ₹' + user.balance + ' है' : 'Insufficient balance! You have ₹' + user.balance);
      return;
    }

    if (method === 'upi' && (!upiId || !upiId.includes('@'))) {
      setError(lang === 'hi' ? 'कृपया सही UPI ID दर्ज करें' : 'Please enter valid UPI ID');
      return;
    }

    if (method === 'bank') {
      if (!accountNumber || accountNumber.length < 8) {
        setError(lang === 'hi' ? 'कृपया सही बैंक खाता संख्या दर्ज करें' : 'Please enter valid Account Number');
        return;
      }
      if (!ifsc || ifsc.length < 4) {
        setError(lang === 'hi' ? 'कृपया सही IFSC कोड दर्ज करें' : 'Please enter valid IFSC code');
        return;
      }
    }

    if (user.twoFactorEnabled) {
      if (!twoFactorCode || twoFactorCode.trim().length !== 6) {
        setError(lang === 'hi' ? 'कृपया 6-अंकों का 2FA सुरक्षा कोड दर्ज करें' : 'Please enter 6-digit 2FA security code');
        return;
      }
    }

    setSubmitting(true);
    setError('');

    const txnId = `WDR-${Math.floor(10000 + Math.random() * 90000)}`;
    const { hash } = await createEncryptedRecord(txnId, user.id, parsedAmount, 'withdraw');

    const newTxn: Transaction = {
      id: txnId,
      userId: user.id,
      username: user.username,
      type: 'withdraw',
      amount: parsedAmount,
      method: method === 'upi' ? 'upi_qr' : 'bank_transfer',
      upiId: method === 'upi' ? upiId : undefined,
      bankInfo: method === 'bank' ? `${bankName} (${accountNumber}) IFSC: ${ifsc.toUpperCase()}` : undefined,
      status: 'pending',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      encryptedHash: hash
    };

    setTimeout(() => {
      setSubmitting(false);
      const newBal = user.balance - parsedAmount;
      setSuccessTxn(newTxn);
      onWithdrawSuccess(newTxn, newBal);
    }, 800);
  };

  const handleResetAndClose = () => {
    setSuccessTxn(null);
    setTwoFactorCode('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        id="withdraw-modal-card"
        className="relative w-full max-w-xl my-auto bg-[#0c1b33] border border-rose-900/50 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-950 via-[#220a11] to-[#0c1b33] p-4 sm:p-5 border-b border-rose-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-['Chakra_Petch'] text-white">
                  {getTranslation(lang, 'withdrawTitle')}
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  24x7 IMPS
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {getTranslation(lang, 'withdrawSub')}
              </p>
            </div>
          </div>
          <button 
            id="close-withdraw-btn"
            onClick={handleResetAndClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successTxn ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400">
              <Check className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {lang === 'hi' ? 'विड्रॉल अनुरोध दर्ज हो गया है!' : 'Withdrawal Request Submitted!'}
              </h3>
              <p className="text-sm text-slate-300 mt-1">
                {lang === 'hi' 
                  ? `₹${successTxn.amount.toLocaleString('en-IN')} का विड्रॉल प्रोसेस किया जा रहा है। 5-15 मिनट में आपके बैंक/UPI में ट्रांसफर हो जाएगा।`
                  : `Your withdrawal of ₹${successTxn.amount.toLocaleString('en-IN')} is being processed. It will be credited within 5-15 minutes.`}
              </p>
            </div>

            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700/60 text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Withdrawal ID:</span>
                <span className="text-amber-400 font-bold">{successTxn.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount:</span>
                <span className="text-rose-400 font-bold">₹{successTxn.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Remaining Balance:</span>
                <span className="text-emerald-400 font-bold">₹{user.balance.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="text-yellow-400 font-bold">PROCESSING (PENDING ADMIN)</span>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 break-all">
                <span className="text-slate-500">Encrypted SHA-256 Audit Hash:</span><br />
                {successTxn.encryptedHash}
              </div>
            </div>

            <button
              id="done-withdraw-btn"
              onClick={handleResetAndClose}
              className="w-full py-2.5 rounded-xl font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors"
            >
              {lang === 'hi' ? 'डैशबोर्ड पर वापस जाएं' : 'Back to Dashboard'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Balance Overview Card */}
            <div className="p-3 bg-gradient-to-r from-blue-950 to-[#0c1f3d] rounded-xl border border-blue-800/60 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Available Balance</span>
                <span className="text-xl font-extrabold text-emerald-400 font-mono">
                  ₹{user.balance.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Withdrawal Fee</span>
                <span className="text-xs font-bold text-amber-300">₹0 (FREE 100%)</span>
              </div>
            </div>

            {/* Amount Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {getTranslation(lang, 'withdrawAmount')} <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-amber-400">
                  ₹
                </span>
                <input
                  id="withdraw-amount-input"
                  type="number"
                  min="500"
                  max={user.balance}
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-8 pr-4 py-2.5 bg-[#091528] border border-blue-800/60 rounded-xl text-white font-bold text-base focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              {/* Quick amount chips */}
              <div className="grid grid-cols-4 gap-2 mt-2">
                {[500, 1000, 2500, user.balance].map((val, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickAmount(val)}
                    className="py-1.5 px-2 rounded-lg bg-[#102344] hover:bg-blue-900/50 border border-blue-800/40 text-xs font-semibold text-slate-200"
                  >
                    {idx === 3 ? 'Max (All)' : `₹${val}`}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {getTranslation(lang, 'minWithdraw')}
              </span>
            </div>

            {/* Payout method */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {getTranslation(lang, 'payoutMethod')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('upi')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    method === 'upi'
                      ? 'bg-rose-600 text-white border-rose-400 shadow-md ring-2 ring-rose-500/30'
                      : 'bg-[#091528] text-slate-300 border-blue-900/60 hover:bg-blue-900/40'
                  }`}
                >
                  <Smartphone className="w-4 h-4" /> UPI Fast Transfer
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('bank')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    method === 'bank'
                      ? 'bg-rose-600 text-white border-rose-400 shadow-md ring-2 ring-rose-500/30'
                      : 'bg-[#091528] text-slate-300 border-blue-900/60 hover:bg-blue-900/40'
                  }`}
                >
                  <Building2 className="w-4 h-4" /> Bank Account (IMPS)
                </button>
              </div>
            </div>

            {/* Details based on method */}
            {method === 'upi' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {getTranslation(lang, 'withdrawUpiId')} <span className="text-rose-400">*</span>
                </label>
                <input
                  id="withdraw-upi-input"
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. 9876543210@paytm or user@okaxis"
                  className="w-full px-4 py-2.5 bg-[#091528] border border-blue-800/60 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-rose-500"
                  required
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {getTranslation(lang, 'accountHolder')} <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={holderName}
                    onChange={(e) => setHolderName(e.target.value)}
                    placeholder="Name as per Bank records"
                    className="w-full px-3 py-2 bg-[#091528] border border-blue-800/60 rounded-xl text-white text-sm focus:outline-none focus:border-rose-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {getTranslation(lang, 'accountNumber')} <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="Account Number"
                      className="w-full px-3 py-2 bg-[#091528] border border-blue-800/60 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-rose-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {getTranslation(lang, 'ifscCode')} <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={ifsc}
                      onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                      placeholder="e.g. SBIN0001234"
                      className="w-full px-3 py-2 bg-[#091528] border border-blue-800/60 rounded-xl text-white font-mono text-sm uppercase focus:outline-none focus:border-rose-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {getTranslation(lang, 'bankName')}
                  </label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g. HDFC Bank, SBI, ICICI"
                    className="w-full px-3 py-2 bg-[#091528] border border-blue-800/60 rounded-xl text-white text-sm focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            )}

            {/* 2FA Security check if enabled */}
            {user.twoFactorEnabled && (
              <div className="p-3 bg-amber-950/30 border border-amber-600/40 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                  <Lock className="w-4 h-4" /> 2FA Verification Required
                </div>
                <input
                  id="withdraw-2fa-input"
                  type="text"
                  maxLength={6}
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="Enter 6-digit 2FA code (e.g. 123456)"
                  className="w-full px-3 py-2 bg-[#091528] border border-amber-500/60 rounded-lg text-white font-mono text-sm tracking-widest text-center focus:outline-none"
                  required
                />
              </div>
            )}

            {error && (
              <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl flex items-center gap-2 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-900/50 p-2.5 rounded-xl border border-blue-900/30">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>
                {lang === 'hi'
                  ? 'सुरक्षित IMPS विड्रॉल। सीधे आपके सत्यापित खाते में जाएगा।'
                  : 'Automated IMPS payout directly into your verified bank or UPI.'}
              </span>
            </div>

            <button
              id="submit-withdraw-button"
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl font-bold font-['Chakra_Petch'] text-sm tracking-wide bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  {lang === 'hi' ? 'विड्रॉल प्रोसेस हो रहा है...' : 'Processing Payout...'}
                </>
              ) : (
                <>
                  <span>{getTranslation(lang, 'submitWithdraw')} (₹{parsedAmount})</span>
                  <ArrowUpRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

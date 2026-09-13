import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  X, 
  Copy, 
  Check, 
  QrCode, 
  Upload, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight,
  Clock,
  Sparkles,
  Building2,
  Smartphone
} from 'lucide-react';
import { Language, User, Transaction, PaymentSettings, DEFAULT_PAYMENT_SETTINGS } from '../types';
import { getTranslation } from '../utils/i18n';
import { createEncryptedRecord } from '../utils/crypto';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  lang: Language;
  paymentSettings?: PaymentSettings;
  onDepositSuccess: (transaction: Transaction) => void;
}

const QUICK_AMOUNTS = [100, 300, 500, 1000, 2000, 5000, 10000, 25000, 50000];

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  user,
  lang,
  paymentSettings = DEFAULT_PAYMENT_SETTINGS,
  onDepositSuccess
}) => {
  const [amount, setAmount] = useState<number>(1000);
  const [customInput, setCustomInput] = useState<string>('1000');
  const [paymentMethod, setPaymentMethod] = useState<'qr' | 'bank'>('qr');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [slipFile, setSlipFile] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successTxn, setSuccessTxn] = useState<Transaction | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const officialUpiId = paymentSettings.upiId || 'brothertossbook@okaxis';
  const merchantName = paymentSettings.merchantName || 'BROTHER TOSS BOOK';
  const isCustomImage = paymentSettings.mode === 'custom_image' && Boolean(paymentSettings.customQrImageUrl);

  // Generate dynamic QR code whenever the amount changes or UPI changes!
  useEffect(() => {
    if (!amount || amount <= 0) return;

    // Standard Indian NPCI UPI URI scheme with exact selected amount
    const upiUri = `upi://pay?pa=${officialUpiId}&pn=${encodeURIComponent(merchantName)}&am=${amount.toFixed(2)}&cu=INR&tn=BrotherToss_Deposit_${user.username}`;

    QRCode.toDataURL(upiUri, {
      width: 280,
      margin: 2,
      color: {
        dark: '#030712',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
      .then(url => {
        setQrDataUrl(url);
      })
      .catch(err => {
        console.error('Failed to generate QR code', err);
      });
  }, [amount, user.username, officialUpiId, merchantName]);

  const handleQuickSelect = (val: number) => {
    setAmount(val);
    setCustomInput(val.toString());
    setError('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = e.target.value.replace(/[^0-9]/g, '');
    setCustomInput(valStr);
    const num = parseInt(valStr, 10);
    if (!isNaN(num) && num > 0) {
      setAmount(num);
      setError('');
    } else {
      setAmount(0);
    }
  };

  const handleCopy = (text: string, type: 'upi' | 'bank') => {
    navigator.clipboard.writeText(text);
    if (type === 'upi') {
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    } else {
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount < 100) {
      setError(lang === 'hi' ? 'न्यूनतम डिपॉजिट राशि ₹100 है' : 'Minimum deposit amount is ₹100');
      return;
    }
    if (!utrNumber || utrNumber.trim().length < 6) {
      setError(lang === 'hi' ? 'कृपया सही 12-अंकों का UTR / रेफरेंस नंबर दर्ज करें' : 'Please enter valid 12-digit UTR / Reference number');
      return;
    }

    setSubmitting(true);
    setError('');

    const txnId = `TXN-${Math.floor(10000 + Math.random() * 90000)}`;
    const { hash } = await createEncryptedRecord(txnId, user.id, amount, 'deposit');

    const newTxn: Transaction = {
      id: txnId,
      userId: user.id,
      username: user.username,
      type: 'deposit',
      amount: amount,
      method: paymentMethod === 'qr' ? 'upi_qr' : 'bank_transfer',
      utrNumber: utrNumber.trim(),
      upiId: officialUpiId,
      slipUrl: slipFile || undefined,
      status: 'pending',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      encryptedHash: hash
    };

    setTimeout(() => {
      setSubmitting(false);
      setSuccessTxn(newTxn);
      onDepositSuccess(newTxn);
    }, 800);
  };

  const handleResetAndClose = () => {
    setSuccessTxn(null);
    setUtrNumber('');
    setSlipFile(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        id="deposit-modal-card"
        className="relative w-full max-w-xl my-auto bg-[#0c1b33] border border-blue-900/60 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-[#0a2718] to-[#0c1b33] p-4 sm:p-5 border-b border-emerald-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-['Chakra_Petch'] text-white">
                  {getTranslation(lang, 'depositTitle')}
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  INSTANT
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {getTranslation(lang, 'depositSub')}
              </p>
            </div>
          </div>
          <button 
            id="close-deposit-btn"
            onClick={handleResetAndClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success screen */}
        {successTxn ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 animate-bounce">
              <Check className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {lang === 'hi' ? 'डिपॉजिट अनुरोध सफलता से दर्ज हुआ!' : 'Deposit Request Submitted!'}
              </h3>
              <p className="text-sm text-slate-300 mt-1">
                {lang === 'hi' 
                  ? `₹${successTxn.amount.toLocaleString('en-IN')} का अनुरोध रिव्यू के लिए भेज दिया गया है। एडमिन द्वारा UTR सत्यापित होते ही 2 मिनट में बैलेंस क्रेडिट हो जाएगा।`
                  : `Your request for ₹${successTxn.amount.toLocaleString('en-IN')} has been sent. Balance will be credited automatically once UTR is verified by Admin.`}
              </p>
            </div>

            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700/60 text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Transaction ID:</span>
                <span className="text-amber-400 font-bold">{successTxn.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount:</span>
                <span className="text-emerald-400 font-bold">₹{successTxn.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">UTR / Ref:</span>
                <span className="text-white">{successTxn.utrNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="text-yellow-400 font-bold">PENDING APPROVAL</span>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 break-all">
                <span className="text-slate-500">Encrypted SHA-256 Audit Hash:</span><br />
                {successTxn.encryptedHash}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                id="done-deposit-btn"
                onClick={handleResetAndClose}
                className="w-full py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
              >
                {lang === 'hi' ? 'डैशबोर्ड पर वापस जाएं' : 'Back to Dashboard'}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Amount Selection Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  {getTranslation(lang, 'selectAmount')}
                </label>
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> 10% Extra Toss Bonus
                </span>
              </div>

              {/* Quick Amount Chips */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {QUICK_AMOUNTS.map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleQuickSelect(val)}
                    className={`py-2 px-3 rounded-xl text-sm font-bold transition-all border ${
                      amount === val
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-900/40 ring-2 ring-emerald-400/40 scale-[1.02]'
                        : 'bg-[#102344] text-slate-200 border-blue-900/40 hover:bg-blue-900/40'
                    }`}
                  >
                    ₹{val >= 1000 ? `${val / 1000}k` : val}
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              <div className="mt-3 flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-amber-400">
                    ₹
                  </span>
                  <input
                    id="custom-deposit-amount-input"
                    type="text"
                    value={customInput}
                    onChange={handleCustomChange}
                    placeholder="Enter custom amount (e.g. 1500)"
                    className="w-full pl-8 pr-4 py-2.5 bg-[#091528] border border-blue-800/60 rounded-xl text-white font-bold text-base focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Switcher */}
            <div className="flex rounded-xl p-1 bg-[#091528] border border-blue-900/60">
              <button
                type="button"
                onClick={() => setPaymentMethod('qr')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                  paymentMethod === 'qr'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" /> UPI Instant Dynamic QR
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('bank')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                  paymentMethod === 'bank'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4" /> Bank Account Transfer
              </button>
            </div>

            {/* DYNAMIC QR CODE BOX */}
            {paymentMethod === 'qr' ? (
              <div className="p-4 rounded-2xl bg-gradient-to-b from-[#09172e] to-[#0d2142] border border-emerald-500/30 text-center space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  {getTranslation(lang, 'qrWillShowFor')}{' '}
                  <span className="font-bold text-amber-300 text-sm">₹{amount.toLocaleString('en-IN')}</span>
                </div>

                {/* The QR Image */}
                <div className="relative mx-auto p-3 bg-white rounded-2xl shadow-xl inline-block">
                  {isCustomImage && paymentSettings.customQrImageUrl ? (
                    <img 
                      src={paymentSettings.customQrImageUrl} 
                      alt={`Merchant QR for ${merchantName}`} 
                      className="w-48 h-48 sm:w-52 sm:h-52 object-contain rounded-lg"
                    />
                  ) : qrDataUrl ? (
                    <img 
                      src={qrDataUrl} 
                      alt={`UPI QR for INR ${amount}`} 
                      className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
                    />
                  ) : (
                    <div className="w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center bg-slate-100 text-slate-400">
                      Generating QR...
                    </div>
                  )}
                  {/* Center branding badge */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900/90 border border-amber-400 px-2 py-0.5 rounded shadow text-[10px] font-black text-amber-300 tracking-wider">
                    BTB
                  </div>
                </div>

                <div className="text-center">
                  <span className="inline-block text-[11px] font-bold text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-700/50 mb-1">
                    {merchantName}
                  </span>
                  <p className="text-xs text-slate-300 font-medium">
                    {lang === 'hi' 
                      ? 'Google Pay, PhonePe, Paytm, BHIM या किसी भी UPI ऐप से स्कैन करें'
                      : 'Scan with Google Pay, PhonePe, Paytm, Cred, or any UPI app'}
                  </p>
                </div>

                {/* Official UPI ID Copy bar */}
                <div className="flex items-center justify-between p-2.5 bg-[#071120] rounded-xl border border-blue-900/60 text-xs">
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 block">{getTranslation(lang, 'upiId')}</span>
                    <span className="font-mono font-bold text-amber-300">{officialUpiId}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(officialUpiId, 'upi')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-950 hover:bg-blue-900 border border-blue-700/60 text-white font-semibold transition-colors"
                  >
                    {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedUpi ? getTranslation(lang, 'copied') : getTranslation(lang, 'copy')}
                  </button>
                </div>
              </div>
            ) : (
              /* Bank Account Details */
              <div className="p-4 rounded-2xl bg-[#09172e] border border-blue-900/60 space-y-2.5 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-blue-900/40">
                  <span className="text-slate-400">Account Name:</span>
                  <span className="font-bold text-white">{paymentSettings.bankAccountName || 'Brother Toss Book Services Ltd'}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-blue-900/40">
                  <span className="text-slate-400">Bank Name:</span>
                  <span className="font-bold text-white">{paymentSettings.bankName || 'Yes Bank Ltd'}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-blue-900/40">
                  <span className="text-slate-400">Account Number:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-300">{paymentSettings.accountNumber || '01239485762100'}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(paymentSettings.accountNumber || '01239485762100', 'bank')}
                      className="p-1 hover:bg-slate-800 rounded text-slate-300"
                    >
                      {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">IFSC Code:</span>
                  <span className="font-mono font-bold text-amber-300">{paymentSettings.ifscCode || 'YESB0000123'}</span>
                </div>
              </div>
            )}

            {/* Step 2: Verification Form */}
            <form onSubmit={handleSubmit} className="space-y-3 pt-1 border-t border-blue-900/40">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {getTranslation(lang, 'utrNumber')} <span className="text-rose-400">*</span>
                </label>
                <input
                  id="utr-input"
                  type="text"
                  maxLength={16}
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder={getTranslation(lang, 'utrPlaceholder')}
                  className="w-full px-4 py-2.5 bg-[#091528] border border-blue-800/60 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {lang === 'hi'
                    ? 'भुगतान के बाद अपनी UPI ऐप में दिखने वाला 12-अंकों का रेफरेंस नंबर डालें'
                    : 'Enter 12-digit transaction ID / UTR shown in your UPI payment receipt'}
                </span>
              </div>

              {/* Upload Screenshot */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {getTranslation(lang, 'uploadSlip')}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 px-4 rounded-xl border border-dashed border-blue-700/80 bg-[#091528]/80 hover:bg-[#0c1f3d] flex items-center justify-center gap-2 text-xs font-semibold text-slate-300 transition-colors"
                >
                  <Upload className="w-4 h-4 text-emerald-400" />
                  {slipFile 
                    ? (lang === 'hi' ? 'स्क्रीनशॉट चयनित ✓ (बदलें)' : 'Screenshot Selected ✓ (Change)') 
                    : (lang === 'hi' ? 'गैलरी से स्क्रीनशॉट चुनें' : 'Select Screenshot from Device')}
                </button>
              </div>

              {error && (
                <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl flex items-center gap-2 text-xs text-rose-300">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Security guarantee */}
              <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-900/50 p-2.5 rounded-xl border border-blue-900/30">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  {lang === 'hi' 
                    ? '256-बिट एन्क्रिप्टेड भुगतान गेटवे। कोई अतिरिक्त शुल्क नहीं।'
                    : '256-bit encrypted deposit channel. Zero convenience fees.'}
                </span>
              </div>

              <button
                id="submit-deposit-button"
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl font-bold font-['Chakra_Petch'] text-sm tracking-wide bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    {lang === 'hi' ? 'सत्यापित हो रहा है...' : 'Verifying & Submitting...'}
                  </>
                ) : (
                  <>
                    <span>{getTranslation(lang, 'submitDeposit')} (₹{amount})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

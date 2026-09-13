import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, 
  Upload, 
  Check, 
  Save, 
  RotateCcw, 
  Copy, 
  Sparkles, 
  Smartphone, 
  Building2, 
  AlertCircle, 
  Eye, 
  Trash2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { PaymentSettings, DEFAULT_PAYMENT_SETTINGS, Language } from '../types';

interface AdminQrSettingsProps {
  currentSettings: PaymentSettings;
  onSaveSettings: (settings: PaymentSettings) => void;
  lang: Language;
}

export const AdminQrSettings: React.FC<AdminQrSettingsProps> = ({
  currentSettings,
  onSaveSettings,
  lang
}) => {
  // Form state initialized from currentSettings
  const [upiId, setUpiId] = useState(currentSettings.upiId || 'brothertossbook@okaxis');
  const [merchantName, setMerchantName] = useState(currentSettings.merchantName || 'BROTHER TOSS BOOK');
  const [mode, setMode] = useState<'dynamic' | 'custom_image'>(currentSettings.mode || 'dynamic');
  const [customQrImageUrl, setCustomQrImageUrl] = useState(currentSettings.customQrImageUrl || '');
  
  // Bank details
  const [bankAccountName, setBankAccountName] = useState(currentSettings.bankAccountName || 'Brother Toss Book Services Ltd');
  const [bankName, setBankName] = useState(currentSettings.bankName || 'Yes Bank Ltd');
  const [accountNumber, setAccountNumber] = useState(currentSettings.accountNumber || '01239485762100');
  const [ifscCode, setIfscCode] = useState(currentSettings.ifscCode || 'YESB0000123');

  // Preview state
  const [previewAmount, setPreviewAmount] = useState<number>(1000);
  const [generatedPreviewQr, setGeneratedPreviewQr] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [imageError, setImageError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize when currentSettings changes
  useEffect(() => {
    setUpiId(currentSettings.upiId);
    setMerchantName(currentSettings.merchantName);
    setMode(currentSettings.mode);
    setCustomQrImageUrl(currentSettings.customQrImageUrl || '');
    setBankAccountName(currentSettings.bankAccountName);
    setBankName(currentSettings.bankName);
    setAccountNumber(currentSettings.accountNumber);
    setIfscCode(currentSettings.ifscCode);
  }, [currentSettings]);

  // Generate dynamic QR preview
  useEffect(() => {
    if (!upiId) return;
    const testUri = `upi://pay?pa=${upiId.trim()}&pn=${encodeURIComponent(merchantName.trim())}&am=${previewAmount.toFixed(2)}&cu=INR&tn=Deposit_Preview`;
    
    QRCode.toDataURL(testUri, {
      width: 260,
      margin: 2,
      color: {
        dark: '#030712',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
      .then(url => setGeneratedPreviewQr(url))
      .catch(err => console.error('Error generating preview QR:', err));
  }, [upiId, merchantName, previewAmount]);

  // Handle image file upload (converts to base64 data url)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError('');
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError(lang === 'hi' ? 'कृपया एक वैध इमेज फाइल (JPG, PNG) चुनें।' : 'Please upload a valid image file (JPG, PNG).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError(lang === 'hi' ? 'फाइल साइज 5MB से कम होना चाहिए।' : 'File size must be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCustomQrImageUrl(result);
        setMode('custom_image');
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiId.trim()) {
      alert(lang === 'hi' ? 'कृपया मान्य UPI ID दर्ज करें' : 'Please enter a valid UPI ID');
      return;
    }

    const updated: PaymentSettings = {
      upiId: upiId.trim(),
      merchantName: merchantName.trim() || 'BROTHER TOSS BOOK',
      mode,
      customQrImageUrl: customQrImageUrl.trim(),
      bankAccountName: bankAccountName.trim(),
      bankName: bankName.trim(),
      accountNumber: accountNumber.trim(),
      ifscCode: ifscCode.trim()
    };

    onSaveSettings(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Reset to default
  const handleReset = () => {
    if (window.confirm(lang === 'hi' ? 'क्या आप डिफ़ॉल्ट QR और बैंक सेटिंग्स रीस्टोर करना चाहते हैं?' : 'Reset to default BTB payment credentials?')) {
      setUpiId(DEFAULT_PAYMENT_SETTINGS.upiId);
      setMerchantName(DEFAULT_PAYMENT_SETTINGS.merchantName);
      setMode(DEFAULT_PAYMENT_SETTINGS.mode);
      setCustomQrImageUrl(DEFAULT_PAYMENT_SETTINGS.customQrImageUrl || '');
      setBankAccountName(DEFAULT_PAYMENT_SETTINGS.bankAccountName);
      setBankName(DEFAULT_PAYMENT_SETTINGS.bankName);
      setAccountNumber(DEFAULT_PAYMENT_SETTINGS.accountNumber);
      setIfscCode(DEFAULT_PAYMENT_SETTINGS.ifscCode);
      onSaveSettings(DEFAULT_PAYMENT_SETTINGS);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  return (
    <div className="bg-[#09172e] border border-blue-900/60 rounded-b-xl p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-950 via-[#0a2342] to-emerald-950 border border-emerald-500/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black font-['Chakra_Petch'] text-white">
                {lang === 'hi' ? 'QR कोड एवं UPI गेटवे प्रबंधन' : 'QR Code & UPI Gateway Management'}
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
                LIVE SYNC
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {lang === 'hi'
                ? 'यहाँ से बदला गया QR कोड और UPI ID सभी यूजर्स के डिपॉजिट पेज पर तुरंत दिखेगा।'
                : 'Any QR code, UPI ID, or bank detail updated here updates live instantly in all user deposit modals.'}
            </p>
          </div>
        </div>

        {saveSuccess && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-bold animate-bounce">
            <Check className="w-4 h-4" />
            {lang === 'hi' ? 'सफलतापूर्वक सेव हुआ!' : 'Changes Saved Successfully!'}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Settings Form */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-5">
          {/* QR Method Selector */}
          <div className="p-4 rounded-xl bg-[#071324] border border-blue-900/60 space-y-3">
            <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
              {lang === 'hi' ? '1. QR कोड मोड चुनें' : '1. Select QR Code Generation Mode'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setMode('dynamic')}
                className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  mode === 'dynamic'
                    ? 'bg-emerald-950/60 border-emerald-400 shadow-md shadow-emerald-950/50 ring-1 ring-emerald-400'
                    : 'bg-[#09172e] border-blue-900/40 hover:bg-blue-900/30 text-slate-400'
                }`}
              >
                <div className={`p-2 rounded-lg ${mode === 'dynamic' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <div className={`text-xs font-bold ${mode === 'dynamic' ? 'text-white' : 'text-slate-300'}`}>
                    Auto Dynamic UPI QR
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {lang === 'hi'
                      ? 'अमाउंट के साथ ऑटोमैटिक NPCI QR बनता है। यूजर को अमाउंट टाइप नहीं करना पड़ता।'
                      : 'Automatically embeds exact user deposit amount into the scan intent.'}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode('custom_image')}
                className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  mode === 'custom_image'
                    ? 'bg-emerald-950/60 border-emerald-400 shadow-md shadow-emerald-950/50 ring-1 ring-emerald-400'
                    : 'bg-[#09172e] border-blue-900/40 hover:bg-blue-900/30 text-slate-400'
                }`}
              >
                <div className={`p-2 rounded-lg ${mode === 'custom_image' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <div className={`text-xs font-bold ${mode === 'custom_image' ? 'text-white' : 'text-slate-300'}`}>
                    Custom Uploaded Standee QR
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {lang === 'hi'
                      ? 'अपना PhonePe, GPay, Paytm स्कैनर इमेज अपलोड करें।'
                      : 'Upload your merchant standee / scanner image directly.'}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* If Custom Image Mode: Upload UI */}
          {mode === 'custom_image' && (
            <div className="p-4 rounded-xl bg-[#071324] border border-blue-900/60 space-y-3">
              <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                {lang === 'hi' ? 'कस्टम QR कोड इमेज अपलोड करें' : 'Upload Custom Merchant QR Image'}
              </label>

              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload}
                className="hidden" 
              />

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-blue-700/60 hover:border-emerald-400 hover:bg-blue-950/40 transition-all rounded-xl p-5 text-center cursor-pointer group"
              >
                <Upload className="w-8 h-8 text-blue-400 group-hover:text-emerald-400 mx-auto mb-2 transition-colors" />
                <p className="text-xs font-bold text-white">
                  {lang === 'hi' ? 'नया QR इमेज चुनने के लिए क्लिक करें या यहाँ खींचें' : 'Click to browse or drop new QR code image'}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Supports PNG, JPG, WEBP (Max 5MB)
                </p>
              </div>

              {/* Or paste URL */}
              <div className="pt-2">
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  {lang === 'hi' ? 'या QR इमेज URL पेस्ट करें:' : 'Or paste direct Image URL:'}
                </label>
                <input 
                  type="url"
                  value={customQrImageUrl}
                  onChange={(e) => setCustomQrImageUrl(e.target.value)}
                  placeholder="https://example.com/my-merchant-qr.png"
                  className="w-full px-3 py-2 bg-[#091528] border border-blue-800/60 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              {imageError && (
                <div className="text-xs text-rose-400 font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> {imageError}
                </div>
              )}
            </div>
          )}

          {/* UPI ID & Merchant Name */}
          <div className="p-4 rounded-xl bg-[#071324] border border-blue-900/60 space-y-4">
            <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
              {lang === 'hi' ? '2. UPI और मर्चेंट विवरण' : '2. UPI VPA & Merchant Name'}
            </label>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  {lang === 'hi' ? 'आधिकारिक UPI ID (VPA)' : 'Official UPI ID (VPA)'} <span className="text-rose-400">*</span>
                </label>
                <span className="text-[10px] text-slate-400">e.g. brothertossbook@okaxis</span>
              </div>
              <div className="relative">
                <input
                  id="admin-upi-id-input"
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. yourname@okaxis"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#091528] border border-blue-800/60 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Quick Handle Suggestions */}
              <div className="flex items-center gap-1.5 mt-2 flex-wrap text-[10px]">
                <span className="text-slate-400">Quick suffixes:</span>
                {['@okaxis', '@okhdfcbank', '@paytm', '@ybl', '@ibl', '@sbi'].map(suffix => (
                  <button
                    key={suffix}
                    type="button"
                    onClick={() => {
                      const prefix = upiId.split('@')[0] || 'merchant';
                      setUpiId(`${prefix}${suffix}`);
                    }}
                    className="px-2 py-0.5 rounded bg-blue-900/40 hover:bg-blue-800 text-blue-200 border border-blue-700/50 transition-colors"
                  >
                    {suffix}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {lang === 'hi' ? 'मर्चेंट / प्राप्तकर्ता का नाम' : 'Payee / Merchant Display Name'} <span className="text-rose-400">*</span>
              </label>
              <input
                id="admin-merchant-name-input"
                type="text"
                value={merchantName}
                onChange={(e) => setMerchantName(e.target.value)}
                placeholder="e.g. BROTHER TOSS BOOK"
                required
                className="w-full px-3.5 py-2.5 bg-[#091528] border border-blue-800/60 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                {lang === 'hi' ? 'यह नाम यूजर के फोन में UPI ऐप पर दिखेगा।' : 'This display name will appear in user\'s UPI app on scanning.'}
              </p>
            </div>
          </div>

          {/* Bank Transfer Details */}
          <div className="p-4 rounded-xl bg-[#071324] border border-blue-900/60 space-y-3">
            <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
              {lang === 'hi' ? '3. बैंक ट्रांसफर (IMPS / NEFT) विवरण' : '3. Bank Account Transfer Details'}
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  {lang === 'hi' ? 'खाताधारक का नाम' : 'Beneficiary / Account Name'}
                </label>
                <input
                  type="text"
                  value={bankAccountName}
                  onChange={(e) => setBankAccountName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#091528] border border-blue-800/60 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  {lang === 'hi' ? 'बैंक का नाम' : 'Bank Name'}
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#091528] border border-blue-800/60 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  {lang === 'hi' ? 'खाता संख्या (Account Number)' : 'Account Number'}
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-[#091528] border border-blue-800/60 rounded-xl text-white text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  {lang === 'hi' ? 'IFSC कोड' : 'IFSC Code'}
                </label>
                <input
                  type="text"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-[#091528] border border-blue-800/60 rounded-xl text-white text-xs font-mono font-bold focus:outline-none focus:border-emerald-500 uppercase"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              id="save-qr-settings-btn"
              type="submit"
              className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black font-['Chakra_Petch'] text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{lang === 'hi' ? 'सेव करें और तुरंत लागू करें' : 'SAVE & APPLY QR SETTINGS'}</span>
            </button>

            <button
              id="reset-qr-settings-btn"
              type="button"
              onClick={handleReset}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'डिफ़ॉल्ट पर रीसेट' : 'Reset to Default'}</span>
            </button>
          </div>
        </form>

        {/* Right Column: Live User Preview Box */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-[#071324] border border-blue-900/60 space-y-3 sticky top-4">
            <div className="flex items-center justify-between pb-2 border-b border-blue-900/40">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white font-['Chakra_Petch'] uppercase tracking-wide">
                  {lang === 'hi' ? 'लाइव यूजर प्रीव्यू' : 'Live User Deposit Preview'}
                </span>
              </div>
              <span className="text-[10px] text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                {mode === 'custom_image' ? 'Custom Standee' : 'Dynamic UPI'}
              </span>
            </div>

            <p className="text-[11px] text-slate-400">
              {lang === 'hi' 
                ? 'यह कार्ड दिखाता है कि यूजर को डिपॉजिट करते समय QR कोड और UPI आईडी कैसे दिखेगा:'
                : 'This card renders in real time exactly what players see when making a deposit:'}
            </p>

            {/* Test amount quick toggles */}
            {mode === 'dynamic' && (
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 block font-semibold">
                  Test Scan Amount:
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {[500, 1000, 2000, 5000].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setPreviewAmount(val)}
                      className={`py-1 rounded text-[11px] font-bold border transition-colors ${
                        previewAmount === val
                          ? 'bg-emerald-600 text-white border-emerald-400'
                          : 'bg-[#091528] text-slate-300 border-blue-900/40 hover:bg-blue-900/40'
                      }`}
                    >
                      ₹{val}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* The Live Rendered Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#09172e] to-[#0d2142] border border-emerald-500/30 text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Deposit Amount:</span>
                <span className="font-bold text-amber-300 font-mono">₹{previewAmount.toLocaleString('en-IN')}</span>
              </div>

              {/* QR Container */}
              <div className="relative mx-auto p-3 bg-white rounded-2xl shadow-xl inline-block">
                {mode === 'custom_image' && customQrImageUrl ? (
                  <div className="relative">
                    <img 
                      src={customQrImageUrl} 
                      alt="Merchant Custom QR" 
                      className="w-44 h-44 sm:w-48 sm:h-48 object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setCustomQrImageUrl('');
                        setMode('dynamic');
                      }}
                      className="absolute -top-2 -right-2 p-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full shadow-lg"
                      title="Remove custom image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : generatedPreviewQr ? (
                  <img 
                    src={generatedPreviewQr} 
                    alt="Live UPI QR" 
                    className="w-44 h-44 sm:w-48 sm:h-48 object-contain"
                  />
                ) : (
                  <div className="w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center bg-slate-100 text-slate-400 text-xs">
                    Generating...
                  </div>
                )}

                {/* BTB Center Emblem */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900/90 border border-amber-400 px-2 py-0.5 rounded shadow text-[10px] font-black text-amber-300 tracking-wider">
                  BTB
                </div>
              </div>

              <div className="text-center">
                <div className="inline-block text-[11px] font-bold text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-700/50 mb-1">
                  {merchantName || 'BROTHER TOSS BOOK'}
                </div>
                <p className="text-[11px] text-slate-300">
                  Scan with GPay, PhonePe, Paytm, or BHIM
                </p>
              </div>

              {/* UPI ID preview with copy */}
              <div className="flex items-center justify-between p-2.5 bg-[#071120] rounded-xl border border-blue-900/60 text-xs">
                <div className="text-left min-w-0 pr-2">
                  <span className="text-[9px] text-slate-400 block uppercase">UPI ID (VPA)</span>
                  <span className="font-mono font-bold text-amber-300 truncate block">{upiId}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(upiId)}
                  className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded bg-blue-950 hover:bg-blue-900 border border-blue-700/60 text-white font-semibold text-[11px]"
                >
                  {copiedUpi ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedUpi ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Verification Note */}
            <div className="p-3 bg-blue-950/40 rounded-xl border border-blue-800/40 text-[11px] text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Security Assurance</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                When a user completes payment via this QR, they submit their 12-digit UTR number which appears in your <b>Manage Deposits & Withdrawals</b> queue for 1-click verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Lock, User as UserIcon, Phone, KeyRound, Sparkles, ShieldCheck } from 'lucide-react';
import { Language, User } from '../types';
import { getTranslation } from '../utils/i18n';
import { INITIAL_USER, INITIAL_ADMIN_USER } from '../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  lang: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  lang
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleDemoLogin = (userType: 'user' | 'admin') => {
    if (userType === 'user') {
      onLoginSuccess(INITIAL_USER);
    } else {
      onLoginSuccess(INITIAL_ADMIN_USER);
    }
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError(lang === 'hi' ? 'कृपया सभी आवश्यक फ़ील्ड भरें' : 'Please fill all required fields');
      return;
    }

    if (mode === 'login') {
      if (username.toLowerCase() === 'admin' || username.toLowerCase() === 'brother_admin') {
        onLoginSuccess(INITIAL_ADMIN_USER);
      } else {
        const loggedUser: User = {
          ...INITIAL_USER,
          username: username.trim(),
          fullName: fullName || username.trim()
        };
        onLoginSuccess(loggedUser);
      }
      onClose();
    } else {
      // Sign up
      if (!phone || phone.length < 10) {
        setError(lang === 'hi' ? 'कृपया सही 10-अंकों का मोबाइल नंबर दर्ज करें' : 'Please enter valid 10-digit mobile');
        return;
      }
      const newUser: User = {
        id: `usr_${Math.floor(1000 + Math.random() * 9000)}`,
        username: username.toLowerCase().replace(/\s+/g, '_'),
        fullName: fullName || username,
        phone: phone,
        email: `${username}@gmail.com`,
        balance: 500, // Welcome signup bonus!
        bonus: 250,
        exposure: 0,
        role: 'user',
        twoFactorEnabled: false,
        status: 'active',
        createdAt: new Date().toISOString().substring(0, 10)
      };
      onLoginSuccess(newUser);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div 
        id="auth-modal-card"
        className="w-full max-w-md bg-[#0c1b33] border border-blue-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 to-[#0c1b33] p-5 border-b border-blue-800/60 flex items-center justify-between">
          <div>
            <span className="text-xl font-black font-['Chakra_Petch'] text-amber-400 tracking-wide block">
              BROTHER TOSS BOOK
            </span>
            <span className="text-xs text-slate-400">
              {mode === 'login' ? 'Access your account & toss markets' : 'Create new member account with ₹500 welcome chips'}
            </span>
          </div>
          <button 
            id="close-auth-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-blue-900/60 bg-[#071324]">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-3 text-xs font-bold font-['Chakra_Petch'] tracking-wider uppercase transition-colors ${
              mode === 'login'
                ? 'text-amber-400 border-b-2 border-amber-400 bg-blue-950/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {getTranslation(lang, 'login')}
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(''); }}
            className={`flex-1 py-3 text-xs font-bold font-['Chakra_Petch'] tracking-wider uppercase transition-colors ${
              mode === 'signup'
                ? 'text-amber-400 border-b-2 border-amber-400 bg-blue-950/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {getTranslation(lang, 'signUp')} (+Bonus)
          </button>
        </div>

        {/* Quick Demo Login shortcuts matching screenshot */}
        <div className="p-4 bg-[#09172e] border-b border-blue-900/40 space-y-2">
          <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Instant One-Click Test Login:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('user')}
              className="py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Demo User (₹10,000)</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="py-2 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 text-purple-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Chief Admin Portal</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          {mode === 'signup' && (
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full pl-9 pr-3 py-2 bg-[#081528] border border-blue-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Username / Mobile</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="auth-username-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="demo_user201 or phone"
                className="w-full pl-9 pr-3 py-2 bg-[#081528] border border-blue-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                required
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Mobile Number (+91)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="9876543210"
                  className="w-full pl-9 pr-3 py-2 bg-[#081528] border border-blue-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="auth-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-[#081528] border border-blue-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-2.5 bg-rose-950/60 border border-rose-800 rounded-lg text-rose-300 text-xs">
              {error}
            </div>
          )}

          <button
            id="auth-submit-btn"
            type="submit"
            className="w-full py-2.5 rounded-xl font-bold font-['Chakra_Petch'] text-sm tracking-wider bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-amber-950/50 transition-colors"
          >
            {mode === 'login' ? getTranslation(lang, 'login') : `${getTranslation(lang, 'signUp')} & Get ₹500`}
          </button>

          <div className="text-center text-[11px] text-slate-400">
            {mode === 'login' ? (
              <span>
                Don't have an ID?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-amber-400 font-bold hover:underline"
                >
                  Create Brother Toss Book Account
                </button>
              </span>
            ) : (
              <span>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-amber-400 font-bold hover:underline"
                >
                  Login to existing account
                </button>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

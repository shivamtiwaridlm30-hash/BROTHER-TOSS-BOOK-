import React, { useState } from 'react';
import { 
  Home, 
  Info, 
  ChevronDown, 
  Bell, 
  Palette, 
  Shield, 
  LogOut, 
  User as UserIcon, 
  Wallet, 
  ArrowUpRight, 
  History,
  Lock
} from 'lucide-react';
import { Language, ThemeType, User } from '../types';
import { getTranslation } from '../utils/i18n';

interface NavbarProps {
  user: User;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  theme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
  unreadCount: number;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenHistory: () => void;
  onOpenAdmin: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  isAdminView: boolean;
  onToggleAdminView: () => void;
  onGoHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  lang,
  onLanguageChange,
  theme,
  onThemeChange,
  unreadCount,
  onOpenDeposit,
  onOpenWithdraw,
  onOpenNotifications,
  onOpenProfile,
  onOpenHistory,
  onOpenAdmin,
  onOpenAuth,
  onLogout,
  isAdminView,
  onToggleAdminView,
  onGoHome
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showBalInfo, setShowBalInfo] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0047b3] border-b border-[#00398f] shadow-md select-none text-white">
      {/* Top Navbar Row */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between gap-1.5 sm:gap-2 min-w-0">
        {/* Left: Home Icon + Brand Logo matching screenshot */}
        <div className="flex items-center gap-1 sm:gap-2.5 min-w-0 flex-shrink">
          <button 
            id="nav-home-btn"
            onClick={() => {
              if (isAdminView) onToggleAdminView();
              if (onGoHome) onGoHome();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="p-1 text-white hover:text-amber-200 transition-colors flex-shrink-0"
            title={getTranslation(lang, 'home')}
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
          </button>

          <div 
            onClick={() => {
              if (isAdminView) onToggleAdminView();
              if (onGoHome) onGoHome();
            }}
            className="cursor-pointer flex items-center min-w-0"
          >
            <div className="flex flex-col min-w-0">
              <div className="flex items-baseline gap-1">
                <span className="text-base sm:text-2xl font-black italic tracking-tighter text-[#ffde00] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] leading-none font-['Chakra_Petch'] whitespace-nowrap">
                  BROTHER<span className="text-white">TOSS</span>
                </span>
                <span className="text-[9px] sm:text-[11px] font-black uppercase bg-[#002f73] px-1 sm:px-1.5 py-0.5 rounded text-amber-300 border border-amber-400/40 tracking-wider">
                  BOOK
                </span>
              </div>
              <span className="hidden sm:block text-[9px] text-blue-100 font-medium tracking-wide truncate">
                India's #1 Toss &amp; Sports Exchange
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Exact screenshot financial indicators and SK/IN avatar */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Balance & Exposure readouts */}
          <div 
            onClick={() => setShowBalInfo(!showBalInfo)}
            className="cursor-pointer flex flex-col items-end text-[10px] sm:text-xs font-mono leading-tight text-white bg-[#00388d] sm:bg-transparent px-2 py-0.5 sm:py-0.5 rounded-lg sm:rounded-none border border-blue-400/20 sm:border-0"
          >
            <div className="flex items-center gap-1 font-bold">
              <span className="text-amber-300 font-black">Bal: ₹{Math.floor(user.balance).toLocaleString('en-IN')}</span>
              <Info className="w-3 h-3 text-blue-200 hover:text-white" />
            </div>
            <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-blue-100 font-sans">
              <span>Exp: <strong className="font-mono font-bold text-white">{user.exposure.toFixed(0)}</strong></span>
              <span className="hidden sm:inline font-medium truncate max-w-[80px]">@{user.username}</span>
            </div>
          </div>

          {/* Screenshot-exact white rounded avatar with "SK" on top and "IN" on bottom */}
          <div className="relative">
            <button
              id="user-profile-dropdown-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-8 h-8 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-950 flex flex-col items-center justify-center shadow-sm font-black text-[9px] leading-tight transition-transform active:scale-95"
              title="Account Menu"
            >
              <span className="tracking-tighter">{user.role === 'admin' ? 'AD' : 'SK'}</span>
              <div className="w-5 h-[1px] bg-slate-400 my-[1px]" />
              <span className="tracking-tighter text-slate-700">IN</span>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-[#002f73] border border-blue-400/40 rounded-xl shadow-2xl py-2 z-50 text-xs">
                <div className="px-3 py-2 border-b border-blue-800/80">
                  <div className="font-bold text-white truncate">{user.fullName}</div>
                  <div className="text-[11px] text-[#ffde00] font-mono">@{user.username}</div>
                  <div className="text-[10px] text-emerald-300 mt-0.5">
                    {user.role === 'admin' ? 'Super Admin Chief' : 'Verified Member'}
                  </div>
                </div>

                <button
                  id="profile-settings-btn"
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenProfile();
                  }}
                  className="w-full px-3 py-2 flex items-center gap-2.5 text-slate-200 hover:bg-blue-900/50 transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-amber-400" />
                  {getTranslation(lang, 'profile')}
                </button>

                <button
                  id="tx-history-btn"
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenHistory();
                  }}
                  className="w-full px-3 py-2 flex items-center gap-2.5 text-slate-200 hover:bg-blue-900/50 transition-colors"
                >
                  <History className="w-4 h-4 text-emerald-400" />
                  {getTranslation(lang, 'history')}
                </button>

                {/* Mobile Theme Chooser */}
                <div className="px-3 py-2 border-t border-blue-900/60 sm:hidden">
                  <div className="text-[10px] text-slate-400 font-bold uppercase mb-1 flex items-center gap-1">
                    <Palette className="w-3 h-3 text-amber-400" /> Choose Theme
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {[
                      { id: 'navy', label: 'Navy' },
                      { id: 'gold', label: 'Midnight' },
                      { id: 'emerald', label: 'Emerald' },
                      { id: 'crimson', label: 'Crimson' }
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => {
                          onThemeChange(t.id as ThemeType);
                          setShowUserMenu(false);
                        }}
                        className={`px-1.5 py-1 rounded text-[10px] font-bold text-center ${
                          theme === t.id ? 'bg-amber-400 text-slate-950' : 'bg-blue-950 text-slate-300'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  id="toggle-admin-btn"
                  onClick={() => {
                    setShowUserMenu(false);
                    onToggleAdminView();
                  }}
                  className="w-full px-3 py-2 flex items-center gap-2.5 text-slate-200 hover:bg-blue-900/50 transition-colors"
                >
                  <Shield className="w-4 h-4 text-purple-400" />
                  {isAdminView ? 'Switch to User View' : getTranslation(lang, 'adminPanel')}
                </button>

                <button
                  id="switch-auth-btn"
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenAuth();
                  }}
                  className="w-full px-3 py-2 flex items-center gap-2.5 text-slate-200 hover:bg-blue-900/50 transition-colors"
                >
                  <Lock className="w-4 h-4 text-blue-400" />
                  Switch / {getTranslation(lang, 'login')}
                </button>

                <div className="border-t border-blue-900/60 my-1"></div>

                <button
                  id="logout-btn"
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className="w-full px-3 py-2 flex items-center gap-2.5 text-rose-300 hover:bg-rose-950/40 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  {getTranslation(lang, 'logout')}
                </button>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <button
            id="notifications-bell-btn"
            onClick={onOpenNotifications}
            className="relative p-1.5 sm:p-2 rounded-lg bg-blue-950/80 hover:bg-blue-900 border border-blue-800/80 text-slate-200 transition-colors flex-shrink-0"
            title={getTranslation(lang, 'notifications')}
          >
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Theme Switcher (visible on desktop, also inside mobile menu) */}
          <div className="relative hidden sm:block">
            <button
              id="theme-toggle-btn"
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="p-2 rounded-lg bg-blue-950/80 hover:bg-blue-900 border border-blue-800/80 text-slate-300 transition-colors"
              title={getTranslation(lang, 'theme')}
            >
              <Palette className="w-4 h-4" />
            </button>
            {showThemeMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[#0c1b33] border border-blue-800 rounded-xl shadow-2xl p-2 z-50 text-xs space-y-1">
                <div className="px-2 py-1 text-[10px] text-slate-400 font-semibold uppercase">Choose Theme</div>
                {[
                  { id: 'navy', name: 'Brother Toss Navy', color: 'bg-[#0047b3]' },
                  { id: 'gold', name: 'Dark Midnight Gold', color: 'bg-[#09090b]' },
                  { id: 'emerald', name: 'Cricket Emerald', color: 'bg-[#031a0e]' },
                  { id: 'crimson', name: 'Royal Crimson', color: 'bg-[#17060b]' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onThemeChange(t.id as ThemeType);
                      setShowThemeMenu(false);
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between transition-colors ${
                      theme === t.id ? 'bg-blue-800 text-white font-bold' : 'hover:bg-blue-900/50 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full border border-white/40 ${t.color}`} />
                      <span>{t.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Primary Action Buttons Bar (DEPOSIT & WITHDRAW matching the screenshot!) */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 bg-[#0047b3] border-t border-[#003ca0]/50">
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {/* DEPOSIT BUTTON: Vibrant Green with wallet icon */}
          <button
            id="quick-deposit-btn"
            onClick={onOpenDeposit}
            className="flex items-center justify-center gap-2 py-2 sm:py-2.5 px-4 rounded-lg bg-[#10a542] hover:bg-[#0d8f37] active:scale-[0.99] text-white font-bold text-sm sm:text-base tracking-wide shadow transition-all border border-green-400/30"
          >
            <Wallet className="w-5 h-5 stroke-[2.2]" />
            <span>{getTranslation(lang, 'deposit')}</span>
          </button>

          {/* WITHDRAW BUTTON: Vibrant Crimson Red with chart/hand icon */}
          <button
            id="quick-withdraw-btn"
            onClick={onOpenWithdraw}
            className="flex items-center justify-center gap-2 py-2 sm:py-2.5 px-4 rounded-lg bg-[#e60000] hover:bg-[#c90000] active:scale-[0.99] text-white font-bold text-sm sm:text-base tracking-wide shadow transition-all border border-red-400/30"
          >
            <ArrowUpRight className="w-5 h-5 stroke-[2.2]" />
            <span>{getTranslation(lang, 'withdraw')}</span>
          </button>
        </div>
      </div>

      {/* Balance Info Popover */}
      {showBalInfo && (
        <div className="max-w-7xl mx-auto px-4 py-2 bg-blue-950 border-t border-blue-900 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-2">
          <span>
            <strong>Main Balance:</strong> ₹{user.balance.toFixed(2)} | <strong>Bonus:</strong> ₹{user.bonus.toFixed(2)} | <strong>Exposure:</strong> ₹{user.exposure.toFixed(2)}
          </span>
          <span className="text-emerald-400 font-semibold">
            {lang === 'hi' ? '100% सुरक्षित और निकासी योग्य राशि' : '100% Safe & Withdrawable Funds'}
          </span>
        </div>
      )}
    </header>
  );
};

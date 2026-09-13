import React, { useState, useEffect } from 'react';
import { 
  User, 
  Transaction, 
  MatchMarket, 
  AppNotification, 
  EncryptedAuditLog, 
  Language, 
  ThemeType, 
  Bet,
  PaymentSettings,
  DEFAULT_PAYMENT_SETTINGS
} from './types';
import { 
  Home, 
  Flame, 
  ArrowDownToLine, 
  ArrowUpRight, 
  UserCheck 
} from 'lucide-react';
import { 
  INITIAL_USER, 
  INITIAL_ADMIN_USER, 
  SAMPLE_USERS, 
  INITIAL_MATCHES, 
  INITIAL_TRANSACTIONS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_AUDIT_LOGS,
  THEME_CONFIGS 
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { TickerBar } from './components/TickerBar';
import { SportsNav } from './components/SportsNav';
import { MatchList } from './components/MatchList';
import { MatchDetailView } from './components/MatchDetailView';
import { CasinoGrid } from './components/CasinoGrid';
import { DepositModal } from './components/DepositModal';
import { WithdrawModal } from './components/WithdrawModal';
import { BetSlipModal } from './components/BetSlipModal';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { NotificationModal } from './components/NotificationModal';
import { AdminDashboard } from './components/AdminDashboard';
import { WhatsAppButton } from './components/WhatsAppButton';
import { getTranslation } from './utils/i18n';
import { createEncryptedRecord } from './utils/crypto';

export default function App() {
  // 1. Persistent State or Initial State
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('btb_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('btb_users');
    return saved ? JSON.parse(saved) : SAMPLE_USERS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('btb_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('btb_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState<EncryptedAuditLog[]>(() => {
    const saved = localStorage.getItem('btb_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [lang, setLang] = useState<Language>(() => {
    localStorage.setItem('btb_lang', 'en');
    return 'en';
  });

  const [theme, setTheme] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('btb_theme');
    return (saved as ThemeType) || 'navy';
  });

  // UI state
  const [isAdminView, setIsAdminView] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileDefaultTab, setProfileDefaultTab] = useState<'profile' | 'bank' | 'security' | 'history'>('profile');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Betting Slip state
  const [isBetSlipOpen, setIsBetSlipOpen] = useState(false);
  const [betSelection, setBetSelection] = useState<{
    match: MatchMarket;
    selection: string;
    betType: 'back' | 'lay';
    odds: number;
    marketType: 'match_odds' | 'bookmaker' | 'bookmaker2' | 'fancy' | 'normal' | 'toss' | 'player_runs';
  } | null>(null);

  // Selected Match inside view state (defaulting to Edinburgh v Amsterdam to display match interface immediately)
  const [selectedMatch, setSelectedMatch] = useState<MatchMarket | null>(INITIAL_MATCHES[2]);

  // User Bets collection for Matched Bets tab
  const [userBets, setUserBets] = useState<Bet[]>(() => {
    const saved = localStorage.getItem('btb_user_bets');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        id: 'BET-991204',
        userId: 'usr_201',
        matchId: 'm3',
        matchTitle: 'Edinburgh Castle Rockers v Amsterdam Flames',
        selection: 'Amsterdam Flames',
        betType: 'back',
        marketType: 'match_odds',
        odds: 1.01,
        stake: 500,
        potentialProfit: 5,
        status: 'open',
        timestamp: '15:12:44'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('btb_user_bets', JSON.stringify(userBets));
  }, [userBets]);

  // Search & Navigation
  const [searchTerm, setSearchTerm] = useState('');
  const [activeNavTab, setActiveNavTab] = useState('inplay');
  const [selectedSport, setSelectedSport] = useState('cricket');
  const [filterMode, setFilterMode] = useState<'live' | 'virtual' | 'premium'>('live');
  const [viewBy, setViewBy] = useState<'time' | 'competition'>('time');

  // Payment Gateway Settings (QR Code, UPI ID, Merchant Name & Bank info)
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(() => {
    const saved = localStorage.getItem('btb_payment_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse payment settings', e);
      }
    }
    return DEFAULT_PAYMENT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('btb_payment_settings', JSON.stringify(paymentSettings));
  }, [paymentSettings]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('btb_current_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('btb_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('btb_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('btb_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('btb_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('btb_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('btb_theme', theme);
  }, [theme]);

  // Handle deposit success
  const handleDepositSuccess = (newTxn: Transaction) => {
    setTransactions(prev => [newTxn, ...prev]);

    // Add audit log
    const lastHash = auditLogs[0]?.currentHash || '0000000000000000000000000000000000000000';
    const newLog: EncryptedAuditLog = {
      id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
      prevHash: lastHash,
      currentHash: newTxn.encryptedHash,
      action: 'DEPOSIT_INITIATED',
      details: `User ${user.username} requested deposit of ₹${newTxn.amount} via UPI Dynamic QR (UTR: ${newTxn.utrNumber})`,
      actor: user.username,
      timestamp: newTxn.timestamp
    };
    setAuditLogs(prev => [newLog, ...prev]);

    // Add in-app notification
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      titleEn: `Deposit Request of ₹${newTxn.amount} Received`,
      titleHi: `₹${newTxn.amount} का डिपॉजिट अनुरोध प्राप्त हुआ`,
      messageEn: `UTR: ${newTxn.utrNumber} is being verified by Brother Toss Book finance team. Funds will be credited in 2 mins.`,
      messageHi: `UTR: ${newTxn.utrNumber} की जांच की जा रही है। 2 मिनट में बैलेंस क्रेडिट कर दिया जाएगा।`,
      type: 'deposit',
      timestamp: 'Just now',
      read: false,
      broadcast: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Handle withdraw success
  const handleWithdrawSuccess = (newTxn: Transaction, newBalance: number) => {
    setTransactions(prev => [newTxn, ...prev]);
    setUser(prev => ({ ...prev, balance: newBalance }));
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, balance: newBalance } : u));

    // Add audit log
    const lastHash = auditLogs[0]?.currentHash || '0000000000000000000000000000000000000000';
    const newLog: EncryptedAuditLog = {
      id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
      prevHash: lastHash,
      currentHash: newTxn.encryptedHash,
      action: 'WITHDRAW_REQUESTED',
      details: `User ${user.username} requested payout of ₹${newTxn.amount} (${newTxn.method})`,
      actor: user.username,
      timestamp: newTxn.timestamp
    };
    setAuditLogs(prev => [newLog, ...prev]);

    // Add notification
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      titleEn: `Withdrawal Request of ₹${newTxn.amount} Placed`,
      titleHi: `₹${newTxn.amount} की निकासी का अनुरोध दर्ज हुआ`,
      messageEn: `Your payout request #${newTxn.id} is queued for automated IMPS transfer.`,
      messageHi: `आपका निकासी अनुरोध #${newTxn.id} ऑटोमैटिक ट्रांसफर कतार में है।`,
      type: 'withdraw',
      timestamp: 'Just now',
      read: false,
      broadcast: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Admin: Approve transaction (e.g. Deposit)
  const handleAdminApproveTx = async (txId: string) => {
    const targetTx = transactions.find(t => t.id === txId);
    if (!targetTx) return;

    // If it's a deposit, add to user balance!
    if (targetTx.type === 'deposit') {
      const amountToAdd = targetTx.amount;
      setUser(prev => prev.id === targetTx.userId ? { ...prev, balance: prev.balance + amountToAdd } : prev);
      setUsers(prev => prev.map(u => u.id === targetTx.userId ? { ...u, balance: u.balance + amountToAdd } : u));
    }

    setTransactions(prev => prev.map(t => t.id === txId ? { ...t, status: 'approved' } : t));

    // Audit log
    const { hash } = await createEncryptedRecord(txId, targetTx.userId, targetTx.amount, 'ADMIN_APPROVE');
    const lastHash = auditLogs[0]?.currentHash || '0000000000000000000000000000000000000000';
    const newLog: EncryptedAuditLog = {
      id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
      prevHash: lastHash,
      currentHash: hash,
      action: 'TRANSACTION_APPROVED',
      details: `Admin approved ${targetTx.type.toUpperCase()} #${targetTx.id} of ₹${targetTx.amount} for @${targetTx.username}`,
      actor: 'ADMIN_CHIEF',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setAuditLogs(prev => [newLog, ...prev]);

    // Push notification to user
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      titleEn: `₹${targetTx.amount} Approved & Credited!`,
      titleHi: `₹${targetTx.amount} स्वीकृत और खाते में जमा!`,
      messageEn: `Your transaction #${targetTx.id} has been verified and approved by the Chief Admin.`,
      messageHi: `आपका लेन-देन #${targetTx.id} मुख्य एडमिन द्वारा सत्यापित और स्वीकृत कर दिया गया है।`,
      type: targetTx.type,
      timestamp: 'Just now',
      read: false,
      broadcast: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Admin: Reject transaction
  const handleAdminRejectTx = async (txId: string) => {
    const targetTx = transactions.find(t => t.id === txId);
    if (!targetTx) return;

    // If withdrawal was rejected, refund the balance!
    if (targetTx.type === 'withdraw') {
      const refundAmt = targetTx.amount;
      setUser(prev => prev.id === targetTx.userId ? { ...prev, balance: prev.balance + refundAmt } : prev);
      setUsers(prev => prev.map(u => u.id === targetTx.userId ? { ...u, balance: u.balance + refundAmt } : u));
    }

    setTransactions(prev => prev.map(t => t.id === txId ? { ...t, status: 'rejected' } : t));

    const { hash } = await createEncryptedRecord(txId, targetTx.userId, targetTx.amount, 'ADMIN_REJECT');
    const lastHash = auditLogs[0]?.currentHash || '0000000000000000000000000000000000000000';
    const newLog: EncryptedAuditLog = {
      id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
      prevHash: lastHash,
      currentHash: hash,
      action: 'TRANSACTION_REJECTED',
      details: `Admin rejected ${targetTx.type.toUpperCase()} #${targetTx.id} of ₹${targetTx.amount} for @${targetTx.username}`,
      actor: 'ADMIN_CHIEF',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Admin: Update user balance directly
  const handleUpdateUserBalance = (userId: string, delta: number) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextBal = Math.max(0, u.balance + delta);
        return { ...u, balance: nextBal };
      }
      return u;
    }));
    if (user.id === userId) {
      setUser(prev => ({ ...prev, balance: Math.max(0, prev.balance + delta) }));
    }
  };

  // Admin: Toggle user status
  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, status: u.status === 'active' ? 'suspended' : 'active' };
      }
      return u;
    }));
    if (user.id === userId) {
      setUser(prev => ({ ...prev, status: prev.status === 'active' ? 'suspended' : 'active' }));
    }
  };

  // Broadcast notification from admin
  const handleBroadcastNotification = (newNotif: AppNotification) => {
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Admin: Update Payment Gateway & QR Code Settings
  const handleUpdatePaymentSettings = async (newSettings: PaymentSettings) => {
    setPaymentSettings(newSettings);

    const prevHash = auditLogs[0]?.currentHash || '0000000000000000000000000000000000000000';
    const { hash } = await createEncryptedRecord(
      `QR-${Date.now()}`,
      user.id,
      0,
      'UPDATE_QR_PAYMENT_GATEWAY',
      prevHash
    );

    // Cryptographic audit record for QR change
    const newAuditLog: EncryptedAuditLog = {
      id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
      prevHash,
      currentHash: hash,
      action: 'UPDATE_QR_PAYMENT_GATEWAY',
      details: `Admin changed QR/Payment details. UPI ID: ${newSettings.upiId}, Merchant: ${newSettings.merchantName}, Mode: ${newSettings.mode}`,
      actor: user.role === 'admin' ? `@${user.username} (Admin)` : 'Super Admin',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setAuditLogs(prev => [newAuditLog, ...prev]);

    // System notification
    const updateNotif: AppNotification = {
      id: `qr_update_${Date.now()}`,
      titleEn: 'Deposit QR Code Updated',
      titleHi: 'डिपॉजिट QR कोड अपडेट किया गया',
      messageEn: `QR code & UPI gateway updated to ${newSettings.merchantName} (${newSettings.upiId}). Instant deposits active.`,
      messageHi: `डिपॉजिट QR कोड और UPI ID को ${newSettings.merchantName} (${newSettings.upiId}) पर अपडेट कर दिया गया है।`,
      type: 'security',
      timestamp: 'Just now',
      read: false,
      broadcast: true
    };
    setNotifications(prev => [updateNotif, ...prev]);
  };

  // Place bet handler
  const handlePlaceBet = (bet: Bet, updatedBalance: number, updatedExposure: number) => {
    setUser(prev => ({
      ...prev,
      balance: updatedBalance,
      exposure: updatedExposure
    }));
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, balance: updatedBalance, exposure: updatedExposure } : u));
    
    // Save to user bets
    setUserBets(prev => [bet, ...prev]);

    // Add notification
    const notif: AppNotification = {
      id: `notif_${Date.now()}`,
      titleEn: `Bet Placed: ${bet.selection}`,
      titleHi: `दांव लगाया गया: ${bet.selection}`,
      messageEn: `Stake: ₹${bet.stake} @ ${bet.odds} (Potential Win: ₹${bet.potentialProfit}) on ${bet.matchTitle}`,
      messageHi: `स्टेक: ₹${bet.stake} @ ${bet.odds} (संभावित जीत: ₹${bet.potentialProfit}) - ${bet.matchTitle}`,
      type: 'bonus',
      timestamp: 'Just now',
      read: false,
      broadcast: false
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Cashout handler
  const handleCashout = (marketTitle: string, cashoutAmount: number) => {
    setUser(prev => ({
      ...prev,
      balance: prev.balance + cashoutAmount,
      exposure: Math.max(0, prev.exposure - 500)
    }));
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, balance: u.balance + cashoutAmount, exposure: Math.max(0, u.exposure - 500) } : u));

    const notif: AppNotification = {
      id: `notif_${Date.now()}`,
      titleEn: `Cashout Successful: ₹${cashoutAmount}`,
      titleHi: `कैशआउट सफल: ₹${cashoutAmount}`,
      messageEn: `Locked in profit of ₹${cashoutAmount} on ${marketTitle}. Amount credited to your wallet.`,
      messageHi: `${marketTitle} पर ₹${cashoutAmount} का कैशआउट सफल। राशि तुरंत आपके वॉलेट में जमा कर दी गई।`,
      type: 'bonus',
      timestamp: 'Just now',
      read: false,
      broadcast: false
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Select odds
  const handleSelectOdd = (
    match: MatchMarket,
    selection: string,
    betType: 'back' | 'lay',
    odds: number,
    marketType: 'match_odds' | 'bookmaker' | 'bookmaker2' | 'fancy' | 'normal' | 'toss' | 'player_runs' = 'match_odds'
  ) => {
    setBetSelection({
      match,
      selection,
      betType,
      odds,
      marketType
    });
    setIsBetSlipOpen(true);
  };

  // Mark all notifications as read
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Filter matches based on search, activeTab, selectedSport, and filterMode
  const filteredMatches = INITIAL_MATCHES.filter(m => {
    if (searchTerm) {
      const matchQuery = searchTerm.toLowerCase();
      return (
        m.title.toLowerCase().includes(matchQuery) ||
        m.team1.toLowerCase().includes(matchQuery) ||
        m.team2.toLowerCase().includes(matchQuery)
      );
    }
    if (activeNavTab === 'casino') return false; // Show casino grid instead
    if (activeNavTab === 'toss') return m.sport === 'toss' || !!m.tossMarket;
    if (selectedSport && selectedSport !== 'all') {
      if (selectedSport === 'toss') return m.sport === 'toss' || !!m.tossMarket;
      if (selectedSport === 'cricket') return m.sport === 'cricket';
      if (selectedSport === 'football') return m.sport === 'football';
      if (selectedSport === 'tennis') return m.sport === 'tennis';
    }
    if (filterMode === 'live') return m.isLive;
    return true;
  });

  // Get current theme styling
  const currentThemeConfig = THEME_CONFIGS[theme] || THEME_CONFIGS.navy;

  return (
    <div 
      className="min-h-screen text-slate-100 flex flex-col font-sans transition-colors duration-300"
      style={{ backgroundColor: currentThemeConfig.primaryBg }}
    >
      {/* 1. TOP NAVBAR */}
      <Navbar
        user={user}
        lang={lang}
        onLanguageChange={setLang}
        theme={theme}
        onThemeChange={setTheme}
        unreadCount={unreadCount}
        onOpenDeposit={() => setIsDepositOpen(true)}
        onOpenWithdraw={() => setIsWithdrawOpen(true)}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onOpenProfile={() => {
          setProfileDefaultTab('profile');
          setIsProfileOpen(true);
        }}
        onOpenHistory={() => {
          setProfileDefaultTab('history');
          setIsProfileOpen(true);
        }}
        onOpenAdmin={() => setIsAdminView(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={() => {
          setUser(INITIAL_USER);
        }}
        isAdminView={isAdminView}
        onToggleAdminView={() => setIsAdminView(!isAdminView)}
        onGoHome={() => setSelectedMatch(null)}
      />

      {/* 2. CONDITIONAL VIEW: ADMIN DASHBOARD vs USER SPORTSBOOK EXCHANGE vs MATCH DETAIL */}
      {isAdminView ? (
        <AdminDashboard
          users={users}
          transactions={transactions}
          auditLogs={auditLogs}
          lang={lang}
          paymentSettings={paymentSettings}
          onUpdatePaymentSettings={handleUpdatePaymentSettings}
          onApproveTransaction={handleAdminApproveTx}
          onRejectTransaction={handleAdminRejectTx}
          onUpdateUserBalance={handleUpdateUserBalance}
          onToggleUserStatus={handleToggleUserStatus}
          onBroadcastNotification={handleBroadcastNotification}
          onExitAdmin={() => setIsAdminView(false)}
        />
      ) : selectedMatch ? (
        <main className="flex-1 max-w-7xl w-full mx-auto px-1 sm:px-4 min-w-0 pb-20 sm:pb-6 overflow-x-hidden">
          <MatchDetailView
            match={selectedMatch}
            user={user}
            lang={lang}
            matchedBets={userBets}
            onBack={() => setSelectedMatch(null)}
            onSelectOdd={handleSelectOdd}
            onCashout={handleCashout}
          />
        </main>
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-2 sm:px-4 min-w-0 pb-20 sm:pb-6 overflow-x-hidden">
          {/* Top Live Match Ticker & Search bar */}
          <TickerBar
            matches={INITIAL_MATCHES}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSelectMatch={(m) => setSelectedMatch(m)}
          />

          {/* Sports Navigation Bar (Pills, Carousel Icons, Subfilters) */}
          <SportsNav
            activeTab={activeNavTab}
            onTabChange={setActiveNavTab}
            selectedSport={selectedSport}
            onSelectSport={setSelectedSport}
            filterMode={filterMode}
            onFilterModeChange={setFilterMode}
            viewBy={viewBy}
            onViewByChange={setViewBy}
            lang={lang}
          />

          {/* Toss Market Highlight Banner */}
          <div className="my-3 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-amber-600/30 via-emerald-700/20 to-blue-900/40 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg min-w-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center text-slate-950 font-black text-lg shadow-md animate-bounce flex-shrink-0">
                🪙
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-sm sm:text-base font-['Chakra_Petch'] text-amber-300 truncate">
                  {lang === 'hi' ? 'ब्रदर टॉस स्पेशल मार्केट्स' : 'BROTHER TOSS BOOK SPECIAL MARKETS'}
                </h3>
                <p className="text-xs text-slate-300">
                  {lang === 'hi' 
                    ? 'सिक्का उछलने से पहले टॉस पर लगाएं दांव। 1.95 के उच्चतम ऑड्स और इंस्टेंट पेआउट।'
                    : 'Fastest coin toss markets with highest 1.95 odds and instant settlement.'}
                </p>
              </div>
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => setIsDepositOpen(true)}
                className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-all"
              >
                + Deposit Funds
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          {activeNavTab === 'casino' ? (
            <CasinoGrid user={user} lang={lang} />
          ) : (
            <>
              {/* Match Odds Tables */}
              <MatchList
                matches={filteredMatches}
                onSelectOdd={handleSelectOdd}
                onSelectMatch={(m) => setSelectedMatch(m)}
                lang={lang}
              />

              {/* Casino & Mini Games Section matching bottom half of screenshot */}
              <CasinoGrid user={user} lang={lang} />
            </>
          )}
        </main>
      )}

      {/* 3. MODALS */}

      {/* Dynamic QR Deposit Modal */}
      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        user={user}
        lang={lang}
        paymentSettings={paymentSettings}
        onDepositSuccess={handleDepositSuccess}
      />

      {/* Instant 24x7 Withdrawal Modal */}
      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        user={user}
        lang={lang}
        onWithdrawSuccess={handleWithdrawSuccess}
      />

      {/* Bet Slip Modal */}
      <BetSlipModal
        isOpen={isBetSlipOpen}
        onClose={() => setIsBetSlipOpen(false)}
        selectionData={betSelection}
        user={user}
        lang={lang}
        onPlaceBet={handlePlaceBet}
      />

      {/* Login & Sign Up Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(loggedUser) => {
          setUser(loggedUser);
          if (loggedUser.role === 'admin') {
            setIsAdminView(true);
          }
        }}
        lang={lang}
      />

      {/* User Profile, Bank Details, 2FA & History Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        transactions={transactions}
        lang={lang}
        onUpdateUser={(updated) => {
          setUser(updated);
          setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
        }}
        defaultTab={profileDefaultTab}
      />

      {/* Announcements & Notifications Modal */}
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        lang={lang}
        onMarkAllRead={handleMarkAllRead}
      />

      {/* Floating 24/7 WhatsApp Support Button matching screenshot */}
      <WhatsAppButton user={user} lang={lang} />

      {/* Footer Bar */}
      <footer className="mt-auto border-t border-blue-950 py-4 pb-20 sm:pb-4 bg-[#050e1a] text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-400 font-['Chakra_Petch']">BROTHER TOSS BOOK</span>
            <span>• 18+ Responsible Gaming Only</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <button onClick={() => setIsAdminView(true)} className="hover:text-amber-300">
              Admin Portal
            </button>
            <button onClick={() => { setProfileDefaultTab('security'); setIsProfileOpen(true); }} className="hover:text-amber-300">
              Security & 2FA
            </button>
            <button onClick={() => { setProfileDefaultTab('history'); setIsProfileOpen(true); }} className="hover:text-amber-300">
              Audit Logs
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar (Phone Dashboard Optimization) */}
      <nav 
        id="mobile-bottom-navbar"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#002f73]/95 backdrop-blur-md border-t border-[#001f4d] py-1.5 px-3 flex items-center justify-around text-white shadow-[0_-4px_20px_rgba(0,0,0,0.5)]"
      >
        <button
          id="mobile-nav-home"
          onClick={() => {
            if (isAdminView) setIsAdminView(false);
            setSelectedMatch(null);
            setActiveNavTab('sports');
            setSelectedSport('all');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold transition-colors ${
            !isAdminView && !selectedMatch && activeNavTab === 'sports' ? 'text-[#ffde00]' : 'text-blue-200 hover:text-white'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          id="mobile-nav-live"
          onClick={() => {
            if (isAdminView) setIsAdminView(false);
            setSelectedMatch(null);
            setFilterMode('live');
          }}
          className={`flex flex-col items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold transition-colors ${
            filterMode === 'live' && !selectedMatch ? 'text-rose-400 font-black' : 'text-blue-200 hover:text-white'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>In-Play</span>
        </button>

        {/* Highlighted Green Deposit Button in center */}
        <button
          id="mobile-nav-deposit"
          onClick={() => setIsDepositOpen(true)}
          className="flex flex-col items-center justify-center px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-black text-[10px] shadow-lg -mt-3.5 border-2 border-emerald-300 active:scale-95 transition-transform"
        >
          <ArrowDownToLine className="w-4 h-4 stroke-[2.5]" />
          <span>Deposit</span>
        </button>

        <button
          id="mobile-nav-withdraw"
          onClick={() => setIsWithdrawOpen(true)}
          className="flex flex-col items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold text-blue-200 hover:text-amber-300 transition-colors"
        >
          <ArrowUpRight className="w-4 h-4 text-amber-400" />
          <span>Withdraw</span>
        </button>

        <button
          id="mobile-nav-account"
          onClick={() => setIsProfileOpen(true)}
          className="flex flex-col items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold text-blue-200 hover:text-white transition-colors"
        >
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
}

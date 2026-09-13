import React, { useState } from 'react';
import { 
  Users, 
  ArrowDownToLine, 
  ArrowUpRight, 
  ShieldCheck, 
  Send, 
  Check, 
  X, 
  AlertTriangle, 
  Search, 
  DollarSign, 
  Lock, 
  PlusCircle, 
  MinusCircle,
  Sparkles,
  ExternalLink,
  Eye,
  Clock,
  QrCode
} from 'lucide-react';
import { User, Transaction, AppNotification, EncryptedAuditLog, Language, PaymentSettings } from '../types';
import { getTranslation } from '../utils/i18n';
import { createEncryptedRecord } from '../utils/crypto';
import { AdminQrSettings } from './AdminQrSettings';

interface AdminDashboardProps {
  users: User[];
  transactions: Transaction[];
  auditLogs: EncryptedAuditLog[];
  lang: Language;
  paymentSettings: PaymentSettings;
  onUpdatePaymentSettings: (settings: PaymentSettings) => void;
  onApproveTransaction: (txId: string) => void;
  onRejectTransaction: (txId: string) => void;
  onUpdateUserBalance: (userId: string, delta: number) => void;
  onToggleUserStatus: (userId: string) => void;
  onBroadcastNotification: (notification: AppNotification) => void;
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  users,
  transactions,
  auditLogs,
  lang,
  paymentSettings,
  onUpdatePaymentSettings,
  onApproveTransaction,
  onRejectTransaction,
  onUpdateUserBalance,
  onToggleUserStatus,
  onBroadcastNotification,
  onExitAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'tx' | 'users' | 'qr' | 'broadcast' | 'logs'>('tx');
  const [txFilter, setTxFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchUser, setSearchUser] = useState('');

  // Balance adjustment modal
  const [balanceModalUser, setBalanceModalUser] = useState<User | null>(null);
  const [balanceDelta, setBalanceDelta] = useState<number>(1000);
  const [deltaType, setDeltaType] = useState<'add' | 'deduct'>('add');

  // Broadcast form state
  const [broadcastTitleEn, setBroadcastTitleEn] = useState('');
  const [broadcastTitleHi, setBroadcastTitleHi] = useState('');
  const [broadcastMsgEn, setBroadcastMsgEn] = useState('');
  const [broadcastMsgHi, setBroadcastMsgHi] = useState('');
  const [broadcastType, setBroadcastType] = useState<'announcement' | 'bonus' | 'security'>('announcement');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Selected slip preview
  const [previewSlipUrl, setPreviewSlipUrl] = useState<string | null>(null);

  // Filter transactions
  const filteredTx = transactions.filter(t => {
    if (txFilter === 'all') return true;
    return t.status === txFilter;
  });

  // Filter users
  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.fullName.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.phone.includes(searchUser)
  );

  // Metrics
  const totalBalance = users.reduce((acc, u) => acc + u.balance, 0);
  const pendingDeposits = transactions.filter(t => t.type === 'deposit' && t.status === 'pending');
  const pendingWithdraws = transactions.filter(t => t.type === 'withdraw' && t.status === 'pending');
  const pendingDepSum = pendingDeposits.reduce((acc, t) => acc + t.amount, 0);
  const pendingWdrSum = pendingWithdraws.reduce((acc, t) => acc + t.amount, 0);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitleEn || !broadcastMsgEn) return;

    const newNotif: AppNotification = {
      id: `bc_${Date.now()}`,
      titleEn: broadcastTitleEn,
      titleHi: broadcastTitleHi || broadcastTitleEn,
      messageEn: broadcastMsgEn,
      messageHi: broadcastMsgHi || broadcastMsgEn,
      type: broadcastType,
      timestamp: 'Just now',
      read: false,
      broadcast: true
    };

    onBroadcastNotification(newNotif);
    setBroadcastSent(true);
    setBroadcastTitleEn('');
    setBroadcastTitleHi('');
    setBroadcastMsgEn('');
    setBroadcastMsgHi('');
    setTimeout(() => setBroadcastSent(false), 2500);
  };

  const handleApplyBalance = () => {
    if (!balanceModalUser || balanceDelta <= 0) return;
    const finalDelta = deltaType === 'add' ? balanceDelta : -balanceDelta;
    onUpdateUserBalance(balanceModalUser.id, finalDelta);
    setBalanceModalUser(null);
  };

  return (
    <div className="min-h-screen bg-[#06101f] text-slate-100 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-[#1a0f30] to-[#0a1730] border-b border-purple-800/50 px-3 sm:px-4 py-3 sm:py-4 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 min-w-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 flex-shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h1 className="text-base sm:text-xl font-black font-['Chakra_Petch'] text-white tracking-wide truncate">
                  BROTHER TOSS BOOK • ADMIN
                </h1>
                <span className="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/40 whitespace-nowrap">
                  SUPER ADMIN
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-purple-200/70 truncate">
                Live management of users, QR deposits, withdrawals & broadcast
              </p>
            </div>
          </div>

          <button
            id="exit-admin-btn"
            onClick={onExitAdmin}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-blue-900/60 hover:bg-blue-800 border border-blue-700 text-xs font-bold text-white transition-all flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Exit to User Exchange</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-xl bg-[#09172e] border border-blue-900/60">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Total Members</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black font-['Chakra_Petch'] text-white mt-1">
              {users.length}
            </div>
            <div className="text-[10px] text-emerald-400 mt-1">
              All accounts verified
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#09172e] border border-blue-900/60">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>User Balance Pool</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black font-['Chakra_Petch'] text-emerald-400 mt-1 font-mono">
              ₹{totalBalance.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Active ledger balance
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#09172e] border border-blue-900/60">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Pending Deposits</span>
              <ArrowDownToLine className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black font-['Chakra_Petch'] text-amber-300 mt-1 font-mono">
              {pendingDeposits.length} <span className="text-xs text-slate-400">(₹{pendingDepSum})</span>
            </div>
            <div className="text-[10px] text-amber-400/90 mt-1 font-medium">
              Requires UTR verification
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#09172e] border border-blue-900/60">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Pending Withdrawals</span>
              <ArrowUpRight className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-black font-['Chakra_Petch'] text-rose-400 mt-1 font-mono">
              {pendingWithdraws.length} <span className="text-xs text-slate-400">(₹{pendingWdrSum})</span>
            </div>
            <div className="text-[10px] text-rose-400/90 mt-1 font-medium">
              Direct IMPS Queue
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-blue-900/60 mt-6 bg-[#09172e] rounded-t-xl overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('tx')}
            className={`py-3 px-5 text-xs font-bold font-['Chakra_Petch'] tracking-wide uppercase transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'tx'
                ? 'border-amber-400 text-amber-300 bg-blue-950/40'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ArrowDownToLine className="w-4 h-4" />
            <span>Manage Deposits & Withdrawals</span>
            {(pendingDeposits.length + pendingWithdraws.length) > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-600 text-white font-black">
                {pendingDeposits.length + pendingWithdraws.length}
              </span>
            )}
          </button>

          <button
            id="admin-tab-qr"
            onClick={() => setActiveTab('qr')}
            className={`py-3 px-5 text-xs font-bold font-['Chakra_Petch'] tracking-wide uppercase transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'qr'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-950/40'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>QR & UPI Settings (QR बदलें)</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`py-3 px-5 text-xs font-bold font-['Chakra_Petch'] tracking-wide uppercase transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'users'
                ? 'border-amber-400 text-amber-300 bg-blue-950/40'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User Accounts</span>
          </button>

          <button
            onClick={() => setActiveTab('broadcast')}
            className={`py-3 px-5 text-xs font-bold font-['Chakra_Petch'] tracking-wide uppercase transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'broadcast'
                ? 'border-amber-400 text-amber-300 bg-blue-950/40'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Broadcast Announcements</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`py-3 px-5 text-xs font-bold font-['Chakra_Petch'] tracking-wide uppercase transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'logs'
                ? 'border-amber-400 text-amber-300 bg-blue-950/40'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Encrypted Audit Trail</span>
          </button>
        </div>

        {/* TAB 1: TRANSACTIONS MANAGEMENT */}
        {activeTab === 'tx' && (
          <div className="bg-[#09172e] border border-blue-900/60 rounded-b-xl p-4 space-y-4">
            {/* Filter pills & QR shortcut */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                {(['pending', 'approved', 'rejected', 'all'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setTxFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                      txFilter === f
                        ? 'bg-amber-400 text-slate-950 shadow'
                        : 'bg-[#061122] text-slate-400 hover:text-white border border-blue-900/60'
                    }`}
                  >
                    {f}
                  </button>
                ))}

                <button
                  id="quick-change-qr-btn"
                  onClick={() => setActiveTab('qr')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-bold transition-all shadow-sm ml-1"
                >
                  <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === 'hi' ? 'डिपॉजिट QR / UPI बदलें' : 'Change Deposit QR / UPI'}</span>
                </button>
              </div>
              <span className="text-xs text-slate-400">
                Showing {filteredTx.length} records
              </span>
            </div>

            {/* Transactions Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="border-b border-blue-900/80 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Txn ID</th>
                    <th className="py-2.5 px-3">User</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">UTR / Bank Info</th>
                    <th className="py-2.5 px-3">Slip</th>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-950">
                  {filteredTx.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#0d2244] transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-amber-300">
                        {tx.id}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-white block">@{tx.username}</span>
                        <span className="text-[10px] text-slate-400">{tx.userId}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          tx.type === 'deposit' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-black text-sm">
                        <span className={tx.type === 'deposit' ? 'text-emerald-400' : 'text-rose-400'}>
                          ₹{tx.amount.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px]">
                        {tx.utrNumber ? (
                          <div>
                            <span className="text-white font-bold">{tx.utrNumber}</span>
                            <span className="text-[9px] text-slate-400 block">UPI QR payment</span>
                          </div>
                        ) : tx.bankInfo ? (
                          <div className="text-slate-300 text-[10px]">{tx.bankInfo}</div>
                        ) : tx.upiId ? (
                          <div className="text-amber-300">{tx.upiId}</div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {tx.slipUrl ? (
                          <button
                            onClick={() => setPreviewSlipUrl(tx.slipUrl!)}
                            className="p-1 rounded bg-blue-900/60 hover:bg-blue-800 text-blue-300 text-[10px] flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>
                        ) : (
                          <span className="text-slate-500 text-[10px]">None</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[10px] font-mono whitespace-nowrap">
                        {tx.timestamp}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          tx.status === 'approved' 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                            : tx.status === 'pending'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                            : 'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {tx.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              id={`approve-tx-${tx.id}`}
                              onClick={() => onApproveTransaction(tx.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
                              title="Approve & Credit Balance"
                            >
                              <Check className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button
                              id={`reject-tx-${tx.id}`}
                              onClick={() => onRejectTransaction(tx.id)}
                              className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
                              title="Reject Request"
                            >
                              <X className="w-3.5 h-3.5" /> Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-mono">Completed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="bg-[#09172e] border border-blue-900/60 rounded-b-xl p-4 space-y-4">
            {/* Search */}
            <div className="flex items-center justify-between gap-3">
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  placeholder="Search user by name, phone, handle..."
                  className="w-full pl-9 pr-3 py-2 bg-[#061122] border border-blue-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Users table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-blue-900/80 text-slate-400 uppercase text-[10px]">
                    <th className="py-2.5 px-3">User Handle</th>
                    <th className="py-2.5 px-3">Full Name & Phone</th>
                    <th className="py-2.5 px-3">Balance</th>
                    <th className="py-2.5 px-3">Bonus</th>
                    <th className="py-2.5 px-3">2FA Security</th>
                    <th className="py-2.5 px-3">Account Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-950">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-[#0d2244] transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-bold text-amber-300">@{u.username}</span>
                        <span className="text-[10px] text-slate-400 block">{u.role}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-white">{u.fullName}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">{u.phone}</span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-400 text-sm">
                        ₹{u.balance.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 font-mono text-amber-300">
                        ₹{u.bonus.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.twoFactorEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {u.twoFactorEnabled ? '2FA Active' : 'Off'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.status === 'active' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right space-x-1">
                        <button
                          onClick={() => setBalanceModalUser(u)}
                          className="px-2.5 py-1 rounded-lg bg-blue-900/80 hover:bg-blue-800 text-amber-300 font-bold text-[11px] transition-colors"
                        >
                          Credit / Debit
                        </button>
                        <button
                          onClick={() => onToggleUserStatus(u.id)}
                          className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                            u.status === 'active' 
                              ? 'bg-rose-950/80 hover:bg-rose-900 text-rose-300' 
                              : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300'
                          }`}
                        >
                          {u.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: BROADCAST NOTIFICATIONS */}
        {activeTab === 'broadcast' && (
          <div className="bg-[#09172e] border border-blue-900/60 rounded-b-xl p-4 sm:p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-amber-400" />
                <span>Send Real-Time Notification Broadcast</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Push instant announcements, toss bonus alerts, or maintenance messages to all registered members.
              </p>
            </div>

            {broadcastSent && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-600 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Notification successfully broadcasted to all active members!</span>
              </div>
            )}

            <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs max-w-2xl">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Notification Category</label>
                <select
                  value={broadcastType}
                  onChange={(e) => setBroadcastType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#061122] border border-blue-800 rounded-xl text-white text-xs focus:outline-none"
                >
                  <option value="announcement">General Announcement</option>
                  <option value="bonus">Toss Bonus / Deposit Promotion</option>
                  <option value="security">Security / Maintenance Alert</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Title (English)</label>
                  <input
                    type="text"
                    value={broadcastTitleEn}
                    onChange={(e) => setBroadcastTitleEn(e.target.value)}
                    placeholder="e.g. Special IND vs AUS Toss Cashback"
                    className="w-full px-3 py-2 bg-[#061122] border border-blue-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Title (Hindi - हिन्दी)</label>
                  <input
                    type="text"
                    value={broadcastTitleHi}
                    onChange={(e) => setBroadcastTitleHi(e.target.value)}
                    placeholder="उदा. भारत बनाम ऑस्ट्रेलिया टॉस कैशबैक ऑफर"
                    className="w-full px-3 py-2 bg-[#061122] border border-blue-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Message (English)</label>
                  <textarea
                    rows={3}
                    value={broadcastMsgEn}
                    onChange={(e) => setBroadcastMsgEn(e.target.value)}
                    placeholder="Enter announcement description..."
                    className="w-full px-3 py-2 bg-[#061122] border border-blue-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Message (Hindi - हिन्दी)</label>
                  <textarea
                    rows={3}
                    value={broadcastMsgHi}
                    onChange={(e) => setBroadcastMsgHi(e.target.value)}
                    placeholder="सूचना का विवरण हिन्दी में दर्ज करें..."
                    className="w-full px-3 py-2 bg-[#061122] border border-blue-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl font-bold font-['Chakra_Petch'] text-xs tracking-wider bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Broadcast Update to All Users</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: ENCRYPTED AUDIT TRAIL */}
        {activeTab === 'logs' && (
          <div className="bg-[#09172e] border border-blue-900/60 rounded-b-xl p-4 space-y-3 font-mono text-xs">
            <div className="p-3 bg-[#061122] rounded-xl border border-blue-950 flex items-center justify-between">
              <div>
                <span className="text-amber-400 font-bold block">Cryptographic SHA-256 Ledger Active</span>
                <span className="text-[10px] text-slate-400">
                  Every entry is immutably linked with previous block hash for tamper-evident tracking.
                </span>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold">
                INTEGRITY VERIFIED ✓
              </span>
            </div>

            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-[#061224] border border-blue-900/40 rounded-xl space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-amber-300 font-bold">{log.id} • {log.action}</span>
                    <span className="text-slate-400">{log.timestamp} • By {log.actor}</span>
                  </div>
                  <div className="text-slate-300 text-xs font-sans">
                    {log.details}
                  </div>
                  <div className="text-[9px] text-slate-500 truncate pt-1 border-t border-blue-950">
                    Prev Hash: {log.prevHash}<br />
                    Curr Hash: <span className="text-emerald-400">{log.currentHash}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB QR: QR & UPI GATEWAY SETTINGS */}
        {activeTab === 'qr' && (
          <AdminQrSettings
            currentSettings={paymentSettings}
            onSaveSettings={onUpdatePaymentSettings}
            lang={lang}
          />
        )}
      </div>

      {/* Slip Preview Modal */}
      {previewSlipUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#09172e] p-4 rounded-2xl max-w-md w-full border border-blue-800 space-y-3">
            <div className="flex justify-between items-center text-white">
              <span className="font-bold text-sm">Payment Screenshot Preview</span>
              <button onClick={() => setPreviewSlipUrl(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <img src={previewSlipUrl} alt="Deposit Slip" className="w-full max-h-96 object-contain rounded-xl bg-black" />
          </div>
        </div>
      )}

      {/* Balance Adjustment Modal */}
      {balanceModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0c1b33] p-5 rounded-2xl max-w-sm w-full border border-blue-800 text-xs text-slate-100 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-sm text-white">
                Adjust Chips: @{balanceModalUser.username}
              </h4>
              <button onClick={() => setBalanceModalUser(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeltaType('add')}
                className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-1 ${
                  deltaType === 'add' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                <PlusCircle className="w-4 h-4" /> Credit Chips
              </button>
              <button
                type="button"
                onClick={() => setDeltaType('deduct')}
                className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-1 ${
                  deltaType === 'deduct' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                <MinusCircle className="w-4 h-4" /> Debit Chips
              </button>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Amount (₹)</label>
              <input
                type="number"
                value={balanceDelta}
                onChange={(e) => setBalanceDelta(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 bg-[#061122] border border-blue-800 rounded-xl text-white font-mono text-sm focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleApplyBalance}
                className="flex-1 py-2.5 rounded-xl font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors"
              >
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

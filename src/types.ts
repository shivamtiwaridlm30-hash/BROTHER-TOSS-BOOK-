export type Language = 'en' | 'hi';

export type ThemeType = 'navy' | 'gold' | 'emerald' | 'crimson';

export interface User {
  id: string;
  username: string;
  fullName: string;
  phone: string;
  email: string;
  balance: number;
  bonus: number;
  exposure: number;
  role: 'user' | 'admin';
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  status: 'active' | 'suspended';
  bankDetails?: {
    accountHolder: string;
    accountNumber: string;
    ifsc: string;
    bankName: string;
    upiId: string;
  };
  createdAt: string;
}

export type TransactionType = 'deposit' | 'withdraw' | 'bet_place' | 'bet_win' | 'bonus';
export type TransactionStatus = 'pending' | 'approved' | 'rejected';

export interface Transaction {
  id: string;
  userId: string;
  username: string;
  type: TransactionType;
  amount: number;
  method: 'upi_qr' | 'bank_transfer' | 'manual';
  utrNumber?: string;
  upiId?: string;
  bankInfo?: string;
  slipUrl?: string;
  status: TransactionStatus;
  timestamp: string;
  encryptedHash: string; // SHA-256 encrypted tamper-evident audit record
  adminNote?: string;
}

export interface PaymentSettings {
  upiId: string;
  merchantName: string;
  mode: 'dynamic' | 'custom_image';
  customQrImageUrl?: string;
  bankAccountName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
}

export const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  upiId: 'brothertossbook@okaxis',
  merchantName: 'BROTHER TOSS BOOK',
  mode: 'dynamic',
  customQrImageUrl: '',
  bankAccountName: 'Brother Toss Book Services Ltd',
  bankName: 'Yes Bank Ltd',
  accountNumber: '01239485762100',
  ifscCode: 'YESB0000123'
};

export interface MatchOdds {
  back: number;
  lay: number;
}

export interface CricketScoreboard {
  team1Short: string;
  team1Score: string;
  team1Overs: string;
  team2Short: string;
  team2Score: string;
  team2Overs: string;
  crr: string;
  rrr: string;
  equation: string;
  recentBalls: string[];
}

export interface DepthOdd {
  price: number;
  size: number;
}

export interface FancyMarketItem {
  id: string;
  name: string;
  badge?: string; // e.g. 'Badla'
  noPrice?: number;
  noSize?: number;
  yesPrice?: number;
  yesSize?: number;
  status: 'active' | 'suspended' | 'ball_running';
}

export interface MatchMarket {
  id: string;
  sport: 'cricket' | 'football' | 'tennis' | 'toss' | 'fantasy' | 'cockfight' | 'horse';
  title: string;
  date: string;
  time: string;
  isLive: boolean;
  tags: string[]; // ['MO', 'BM', 'F']
  team1: string;
  team2: string;
  odds1: MatchOdds;
  oddsTie?: MatchOdds;
  odds2: MatchOdds;
  scoreboard?: CricketScoreboard;
  tossMarket?: {
    team1TossBack: number;
    team1TossLay: number;
    team2TossBack: number;
    team2TossLay: number;
  };
  status: 'upcoming' | 'live' | 'finished';
}

export interface Bet {
  id: string;
  userId: string;
  matchId: string;
  matchTitle: string;
  selection: string;
  betType: 'back' | 'lay';
  marketType: 'match_odds' | 'bookmaker' | 'bookmaker2' | 'fancy' | 'normal' | 'toss' | 'player_runs';
  odds: number;
  stake: number;
  potentialProfit: number;
  status: 'open' | 'won' | 'lost';
  timestamp: string;
}

export interface AppNotification {
  id: string;
  titleEn: string;
  titleHi: string;
  messageEn: string;
  messageHi: string;
  type: 'announcement' | 'deposit' | 'withdraw' | 'bonus' | 'security';
  timestamp: string;
  read: boolean;
  broadcast: boolean;
}

export interface EncryptedAuditLog {
  id: string;
  prevHash: string;
  currentHash: string;
  action: string;
  details: string;
  actor: string;
  timestamp: string;
}

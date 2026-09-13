import { MatchMarket, User, Transaction, AppNotification, EncryptedAuditLog } from '../types';

export const INITIAL_USER: User = {
  id: 'usr_201',
  username: 'demo_user201',
  fullName: 'Shivam Demo Tiwari',
  phone: '+91 98765 43210',
  email: 'demo_user201@brothertossbook.com',
  balance: 10000,
  bonus: 500,
  exposure: 0,
  role: 'user',
  twoFactorEnabled: false,
  status: 'active',
  bankDetails: {
    accountHolder: 'Shivam Demo Tiwari',
    accountNumber: '919876543210',
    ifsc: 'PYTM0123456',
    bankName: 'Paytm Payments Bank',
    upiId: 'shivamdemo@paytm'
  },
  createdAt: '2026-09-01'
};

export const INITIAL_ADMIN_USER: User = {
  id: 'usr_admin',
  username: 'brother_admin',
  fullName: 'Admin Chief Brother',
  phone: '+91 99999 88888',
  email: 'admin@brothertossbook.com',
  balance: 500000,
  bonus: 0,
  exposure: 0,
  role: 'admin',
  twoFactorEnabled: true,
  status: 'active',
  createdAt: '2026-08-15'
};

export const SAMPLE_USERS: User[] = [
  INITIAL_USER,
  {
    id: 'usr_202',
    username: 'rohit_toss_king',
    fullName: 'Rohit Sharma',
    phone: '+91 98234 11223',
    email: 'rohit@gmail.com',
    balance: 24500,
    bonus: 1000,
    exposure: 1500,
    role: 'user',
    twoFactorEnabled: true,
    status: 'active',
    bankDetails: {
      accountHolder: 'Rohit Sharma',
      accountNumber: '5010043219876',
      ifsc: 'HDFC0001234',
      bankName: 'HDFC Bank',
      upiId: 'rohit@okhdfcbank'
    },
    createdAt: '2026-09-05'
  },
  {
    id: 'usr_203',
    username: 'virat_punter',
    fullName: 'Virat Kohli',
    phone: '+91 97111 22334',
    email: 'virat@gmail.com',
    balance: 4800,
    bonus: 200,
    exposure: 0,
    role: 'user',
    twoFactorEnabled: false,
    status: 'active',
    bankDetails: {
      accountHolder: 'Virat Kohli',
      accountNumber: '34210987654',
      ifsc: 'SBIN0004321',
      bankName: 'State Bank of India',
      upiId: 'virat@oksbi'
    },
    createdAt: '2026-09-08'
  },
  {
    id: 'usr_204',
    username: 'rahul_bhai99',
    fullName: 'Rahul Verma',
    phone: '+91 95555 66778',
    email: 'rahul@gmail.com',
    balance: 0,
    bonus: 50,
    exposure: 0,
    role: 'user',
    twoFactorEnabled: false,
    status: 'suspended',
    createdAt: '2026-09-10'
  }
];

export const INITIAL_MATCHES: MatchMarket[] = [
  {
    id: 'm1',
    sport: 'cricket',
    title: 'Barbados Tridents v Jamaica Kingsmen',
    date: '13/09/2026',
    time: '05:30',
    isLive: true,
    tags: ['MO', 'BM', 'F'],
    team1: 'Barbados Tridents',
    team2: 'Jamaica Kingsmen',
    odds1: { back: 1.75, lay: 1.77 },
    odds2: { back: 2.30, lay: 2.32 },
    scoreboard: {
      team1Short: 'BT',
      team1Score: '164-6',
      team1Overs: '20.0',
      team2Short: 'JK',
      team2Score: '89-2',
      team2Overs: '11.2',
      crr: '7.85',
      rrr: '8.77',
      equation: 'JK Needed 76 runs from 52 balls',
      recentBalls: ['1', '0', '6', '1', '2', '4']
    },
    tossMarket: {
      team1TossBack: 1.92,
      team1TossLay: 1.96,
      team2TossBack: 1.92,
      team2TossLay: 1.96
    },
    status: 'live'
  },
  {
    id: 'm2',
    sport: 'cricket',
    title: 'Namibia v South Africa',
    date: '13/09/2026',
    time: '13:00',
    isLive: false,
    tags: ['MO', 'BM', 'F'],
    team1: 'Namibia',
    team2: 'South Africa',
    odds1: { back: 9.60, lay: 9.80 },
    odds2: { back: 1.11, lay: 1.12 },
    scoreboard: {
      team1Short: 'NAM',
      team1Score: 'Yet to Bat',
      team1Overs: '0.0',
      team2Short: 'SA',
      team2Score: 'Yet to Bat',
      team2Overs: '0.0',
      crr: '0.00',
      rrr: '0.00',
      equation: 'Match starts at 13:00 IST',
      recentBalls: []
    },
    tossMarket: {
      team1TossBack: 1.95,
      team1TossLay: 2.02,
      team2TossBack: 1.90,
      team2TossLay: 1.98
    },
    status: 'upcoming'
  },
  {
    id: 'm3',
    sport: 'cricket',
    title: 'Edinburgh Castle Rockers v Amsterdam Flames',
    date: '13/09/2026',
    time: '15:00',
    isLive: true,
    tags: ['MO', 'BM', 'F'],
    team1: 'Edinburgh Castle Rockers',
    team2: 'Amsterdam Flames',
    odds1: { back: 50.0, lay: 55.0 },
    odds2: { back: 1.01, lay: 1.02 },
    scoreboard: {
      team1Short: 'ECR',
      team1Score: '118-10',
      team1Overs: '18.3',
      team2Short: 'AF',
      team2Score: '38-0',
      team2Overs: '5.4',
      crr: '6.71',
      rrr: '5.65',
      equation: 'AF Needed 81 runs from 86 balls',
      recentBalls: ['2', '1', '0', '4', '1', '1']
    },
    tossMarket: {
      team1TossBack: 1.94,
      team1TossLay: 1.98,
      team2TossBack: 1.94,
      team2TossLay: 1.98
    },
    status: 'live'
  },
  {
    id: 'm4',
    sport: 'toss',
    title: 'India v Australia - 1st ODI Super Toss Market',
    date: '13/09/2026',
    time: '14:00',
    isLive: true,
    tags: ['TOSS', 'MO', 'F'],
    team1: 'India (Toss Special)',
    team2: 'Australia (Toss Special)',
    odds1: { back: 1.95, lay: 2.00 },
    odds2: { back: 1.95, lay: 2.00 },
    tossMarket: {
      team1TossBack: 1.95,
      team1TossLay: 2.00,
      team2TossBack: 1.95,
      team2TossLay: 2.00
    },
    status: 'live'
  },
  {
    id: 'm5',
    sport: 'football',
    title: 'Atalanta v Cagliari',
    date: '13/09/2026',
    time: '00:15',
    isLive: true,
    tags: ['MO', 'BM'],
    team1: 'Atalanta',
    team2: 'Cagliari',
    odds1: { back: 1.45, lay: 1.48 },
    oddsTie: { back: 4.80, lay: 5.10 },
    odds2: { back: 6.80, lay: 7.20 },
    status: 'live'
  },
  {
    id: 'm6',
    sport: 'tennis',
    title: 'Vic Bosio v Cabrera',
    date: '13/09/2026',
    time: '00:05',
    isLive: true,
    tags: ['MO'],
    team1: 'Vic Bosio',
    team2: 'Cabrera',
    odds1: { back: 1.62, lay: 1.65 },
    odds2: { back: 2.36, lay: 2.40 },
    status: 'live'
  }
];

export const CASINO_GAMES = [
  { id: 'c1', name: 'EZUGI', subtitle: 'Live Dealer 24x7', tag: 'HOT', color: 'from-amber-600 to-amber-950', icon: 'Crown', image: '👩‍💼' },
  { id: 'c2', name: 'LIGHTNING', subtitle: 'Roulette & Cards', tag: 'JACKPOT', color: 'from-blue-600 to-slate-950', icon: 'Zap', image: '⚡' },
  { id: 'c3', name: 'MARBLE RUN', subtitle: 'Physics Racer', tag: 'NEW', color: 'from-emerald-600 to-teal-950', icon: 'Play', image: '🔮' },
  { id: 'c4', name: 'SEXY', subtitle: 'Baccarat VIP Live', tag: 'LIVE', color: 'from-rose-600 to-red-950', icon: 'Flame', image: '💃' },
  { id: 'c5', name: 'MINI GAMES', subtitle: 'Aviator & Dice 100x', tag: 'POPULAR', color: 'from-indigo-600 to-purple-950', icon: 'Send', image: '✈️' },
  { id: 'c6', name: 'MINES', subtitle: 'Instant Cashout', tag: 'HOT', color: 'from-cyan-600 to-blue-950', icon: 'Bomb', image: '💎' },
  { id: 'c7', name: 'BIKINI GAMES', subtitle: 'Beach Slot Vegas', tag: 'NEW', color: 'from-pink-600 to-rose-950', icon: 'Sparkles', image: '👙' },
  { id: 'c8', name: 'CHICKEN ROAD CROSS', subtitle: 'Fast Multiplier', tag: 'TRENDING', color: 'from-orange-600 to-amber-950', icon: 'Footprints', image: '🐔' }
];

export const NEW_LAUNCH_GAMES = [
  { id: 'nl1', name: 'GRAND CRICKET', subtitle: 'Over & Ball Live', tag: 'NEW', color: 'from-blue-700 to-indigo-950', icon: 'Trophy', image: '🏏' },
  { id: 'nl2', name: 'SUPER E-SABONG', subtitle: 'Cock Fight Live', tag: 'TOP', color: 'from-red-700 to-orange-950', icon: 'Sword', image: '🐓' },
  { id: 'nl3', name: 'KING MATKA', subtitle: 'Single & Jodi Fast', tag: 'DAILY', color: 'from-amber-600 to-yellow-950', icon: 'Coins', image: '🏺' },
  { id: 'nl4', name: 'WICKET BLAST', subtitle: 'Toss Over Blast', tag: 'TOSS', color: 'from-emerald-600 to-green-950', icon: 'Target', image: '🎯' }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-89021',
    userId: 'usr_201',
    username: 'demo_user201',
    type: 'deposit',
    amount: 5000,
    method: 'upi_qr',
    utrNumber: '423589124578',
    upiId: 'brothertossbook@okaxis',
    status: 'approved',
    timestamp: '2026-09-12 18:30:10',
    encryptedHash: 'c4ca4238a0b923820dcc509a6f75849b34208a984a86b3e8392fb10d922f2812'
  },
  {
    id: 'TXN-89022',
    userId: 'usr_201',
    username: 'demo_user201',
    type: 'deposit',
    amount: 5000,
    method: 'upi_qr',
    utrNumber: '423589998124',
    upiId: 'brothertossbook@okaxis',
    status: 'approved',
    timestamp: '2026-09-13 01:15:40',
    encryptedHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  },
  {
    id: 'TXN-89023',
    userId: 'usr_202',
    username: 'rohit_toss_king',
    type: 'deposit',
    amount: 15000,
    method: 'upi_qr',
    utrNumber: '551122334455',
    upiId: 'brothertossbook@okaxis',
    status: 'pending',
    timestamp: '2026-09-13 04:30:00',
    encryptedHash: '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae'
  },
  {
    id: 'TXN-89024',
    userId: 'usr_203',
    username: 'virat_punter',
    type: 'withdraw',
    amount: 2500,
    method: 'bank_transfer',
    bankInfo: 'SBI - 34210987654 (IFSC: SBIN0004321)',
    status: 'pending',
    timestamp: '2026-09-13 04:40:12',
    encryptedHash: 'fc5e038d38a57032085441e7fe7010b0ffae6832e882414777e387063d8d6d2a'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    titleEn: 'Welcome to Brother Toss Book!',
    titleHi: 'ब्रदर टॉस बुक में आपका स्वागत है!',
    messageEn: 'Enjoy India\'s fastest toss & match exchange with instant dynamic QR deposit and 24x7 withdrawals.',
    messageHi: 'भारत के सबसे तेज़ टॉस और मैच एक्सचेंज का आनंद लें, इंस्टेंट डायनामिक QR डिपॉजिट और 24x7 निकासी के साथ।',
    type: 'announcement',
    timestamp: 'Just now',
    read: false,
    broadcast: true
  },
  {
    id: 'n2',
    titleEn: '10% Toss Special Deposit Bonus Active',
    titleHi: '10% टॉस स्पेशल डिपॉजिट बोनस सक्रिय है',
    messageEn: 'Deposit ₹1,000 or more today using dynamic QR to get 10% instant toss cash bonus!',
    messageHi: 'डायनामिक QR से ₹1,000 या अधिक जमा करें और तुरंत 10% टॉस कैश बोनस प्राप्त करें!',
    type: 'bonus',
    timestamp: '15 mins ago',
    read: false,
    broadcast: true
  },
  {
    id: 'n3',
    titleEn: 'Deposit ₹5,000 Approved & Credited',
    titleHi: 'डिपॉजिट ₹5,000 स्वीकृत और खाते में जमा हुआ',
    messageEn: 'Your dynamic UPI deposit of ₹5,000 with UTR 423589998124 has been verified and added to balance.',
    messageHi: 'आपका ₹5,000 का UPI डिपॉजिट UTR 423589998124 सत्यापित कर बैलेंस में जोड़ दिया गया है।',
    type: 'deposit',
    timestamp: '1 hour ago',
    read: true,
    broadcast: false
  }
];

export const INITIAL_AUDIT_LOGS: EncryptedAuditLog[] = [
  {
    id: 'LOG-001',
    prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
    currentHash: 'c4ca4238a0b923820dcc509a6f75849b34208a984a86b3e8392fb10d922f2812',
    action: 'DEPOSIT_APPROVED',
    details: 'User demo_user201 deposited ₹5,000 via Dynamic UPI QR (UTR: 423589124578)',
    actor: 'SYSTEM_AUTOPAY',
    timestamp: '2026-09-12 18:30:10'
  },
  {
    id: 'LOG-002',
    prevHash: 'c4ca4238a0b923820dcc509a6f75849b34208a984a86b3e8392fb10d922f2812',
    currentHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    action: 'DEPOSIT_APPROVED',
    details: 'User demo_user201 deposited ₹5,000 via Dynamic UPI QR (UTR: 423589998124)',
    actor: 'ADMIN_CHIEF',
    timestamp: '2026-09-13 01:15:40'
  }
];

export const THEME_CONFIGS = {
  navy: {
    id: 'navy',
    name: 'Brother Toss Book Royal Blue',
    primaryBg: '#f0f4f8',
    headerBg: '#0047b3',
    navMenuBg: '#003380',
    sportsIconBg: '#001b44',
    subfilterBg: '#00265e',
    matchCardBg: '#ffffff',
    matchCardBorder: '#e2e8f0',
    matchTextColor: '#0f172a',
    matchTimeColor: '#ea580c',
    oddsBackBg: '#72c3fc',
    oddsLayBg: '#ffa8ba',
    casinoBg: '#00183b',
    accentDeposit: '#10a542',
    accentWithdraw: '#e60000',
    headerAccent: '#ffde00',
    isLightMatches: true
  },
  gold: {
    id: 'gold',
    name: 'Midnight Dark Gold',
    primaryBg: '#09090b',
    headerBg: '#18181b',
    navMenuBg: '#121215',
    sportsIconBg: '#09090b',
    subfilterBg: '#141416',
    matchCardBg: '#121215',
    matchCardBorder: '#27272a',
    matchTextColor: '#f4f4f5',
    matchTimeColor: '#eab308',
    oddsBackBg: '#38bdf8',
    oddsLayBg: '#f43f5e',
    casinoBg: '#0e0e11',
    accentDeposit: '#eab308',
    accentWithdraw: '#ef4444',
    headerAccent: '#facc15',
    isLightMatches: false
  },
  emerald: {
    id: 'emerald',
    name: 'Stadium Emerald Cricket',
    primaryBg: '#02180e',
    headerBg: '#064e3b',
    navMenuBg: '#063f30',
    sportsIconBg: '#022415',
    subfilterBg: '#032c1a',
    matchCardBg: '#042214',
    matchCardBorder: '#065f46',
    matchTextColor: '#ecfdf5',
    matchTimeColor: '#34d399',
    oddsBackBg: '#38bdf8',
    oddsLayBg: '#f87171',
    casinoBg: '#02170d',
    accentDeposit: '#10b981',
    accentWithdraw: '#ef4444',
    headerAccent: '#6ee7b7',
    isLightMatches: false
  },
  crimson: {
    id: 'crimson',
    name: 'Royal Cyber Crimson',
    primaryBg: '#120307',
    headerBg: '#881337',
    navMenuBg: '#6f0d2b',
    sportsIconBg: '#2f0511',
    subfilterBg: '#450a1a',
    matchCardBg: '#24060e',
    matchCardBorder: '#9f1239',
    matchTextColor: '#fff1f2',
    matchTimeColor: '#fb7185',
    oddsBackBg: '#38bdf8',
    oddsLayBg: '#fb7185',
    casinoBg: '#170308',
    accentDeposit: '#10b981',
    accentWithdraw: '#e11d48',
    headerAccent: '#fda4af',
    isLightMatches: false
  }
};

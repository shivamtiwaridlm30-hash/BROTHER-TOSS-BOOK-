import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Tv, 
  Info, 
  Coins, 
  Search, 
  ShieldCheck, 
  Check, 
  Flame, 
  Volume2, 
  VolumeX, 
  Maximize2 
} from 'lucide-react';
import { MatchMarket, Bet, Language, User } from '../types';
import { getTranslation } from '../utils/i18n';

interface MatchDetailViewProps {
  match: MatchMarket;
  user: User;
  lang: Language;
  matchedBets: Bet[];
  onBack: () => void;
  onSelectOdd: (
    match: MatchMarket,
    selection: string,
    betType: 'back' | 'lay',
    odds: number,
    marketType: 'match_odds' | 'bookmaker' | 'bookmaker2' | 'fancy' | 'normal' | 'toss' | 'player_runs'
  ) => void;
  onCashout: (marketTitle: string, cashoutAmount: number) => void;
}

export const MatchDetailView: React.FC<MatchDetailViewProps> = ({
  match,
  user,
  lang,
  matchedBets,
  onBack,
  onSelectOdd,
  onCashout
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'odds' | 'matched'>('odds');
  const [showLiveTv, setShowLiveTv] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [cashoutModalMarket, setCashoutModalMarket] = useState<string | null>(null);
  const [cashoutDone, setCashoutDone] = useState(false);
  const [normalSearch, setNormalSearch] = useState('');

  // Match specific bets
  const thisMatchBets = matchedBets.filter(b => b.matchId === match.id);

  // Scoreboard fallback or actual
  const sb = match.scoreboard || {
    team1Short: match.team1.split(' ')[0] || 'T1',
    team1Score: '118-10',
    team1Overs: '18.3',
    team2Short: match.team2.split(' ')[0] || 'T2',
    team2Score: '38-0',
    team2Overs: '5.4',
    crr: '6.71',
    rrr: '5.65',
    equation: `${match.team2.split(' ')[0]} Needed 81 runs from 86 balls`,
    recentBalls: ['2', '1', '0', '4', '1', '1']
  };

  const handleCashoutClick = (marketName: string) => {
    setCashoutModalMarket(marketName);
    setCashoutDone(false);
  };

  const confirmCashout = (amount: number) => {
    if (cashoutModalMarket) {
      onCashout(cashoutModalMarket, amount);
      setCashoutDone(true);
      setTimeout(() => {
        setCashoutModalMarket(null);
        setCashoutDone(false);
      }, 1200);
    }
  };

  // Normal / Session items (Screenshot 2)
  const normalItems = [
    { id: 'n1', name: '10 over run AF', badge: 'Badla', no: { price: 71, size: 100 }, yes: { price: 72, size: 100 }, status: 'active' },
    { id: 'n2', name: '10 over run bhav AF', no: { price: 70, size: 85 }, yes: { price: 70, size: 60 }, status: 'active' },
    { id: 'n3', name: '10 over run bhav AF 2', status: 'suspended' },
    { id: 'n4', name: '7 over run AF', no: { price: 50, size: 100 }, yes: { price: 51, size: 100 }, status: 'active' },
    { id: 'n5', name: '8 over run AF', no: { price: 57, size: 100 }, yes: { price: 58, size: 100 }, status: 'active' },
    { id: 'n6', name: '1st wkt AF', status: 'ball_running' },
    { id: 'n7', name: '1st wkt bhav AF', no: { price: 65, size: 130 }, yes: { price: 65, size: 100 }, status: 'active' },
    { id: 'n8', name: '1st wkt bhav AF 2', no: { price: 46, size: 8 }, yes: { price: 46, size: 5 }, status: 'active' },
    { id: 'n9', name: 'S Smith run', no: { price: 40, size: 110 }, yes: { price: 40, size: 90 }, status: 'active' },
    { id: 'n10', name: 'S Smith run bhav', status: 'suspended' },
    { id: 'n11', name: 'S Smith run bhav 2', status: 'suspended' },
    { id: 'n12', name: 'Y Samra run', no: { price: 32, size: 110 }, yes: { price: 32, size: 90 }, status: 'active' },
    { id: 'n13', name: 'Y Samra run bhav', no: { price: 34, size: 160 }, yes: { price: 34, size: 120 }, status: 'active' },
    { id: 'n14', name: 'Y Samra run bhav 2', no: { price: 18, size: 14 }, yes: { price: 18, size: 9 }, status: 'active' },
    { id: 'n15', name: 'Only 1st wkt boundaries AF', no: { price: 8, size: 100 }, yes: { price: 9, size: 100 }, status: 'active' },
    { id: 'n16', name: 'S Smith boundaries', no: { price: 6, size: 115 }, yes: { price: 6, size: 85 }, status: 'active' },
    { id: 'n17', name: 'Y Samra boundaries', no: { price: 5, size: 100 }, yes: { price: 6, size: 100 }, status: 'active' }
  ];

  const filteredNormalItems = normalItems.filter(item => 
    item.name.toLowerCase().includes(normalSearch.toLowerCase())
  );

  return (
    <div className="w-full bg-[#f1f3f6] text-slate-900 pb-12 select-none min-h-screen">
      {/* 1. Sub-Header: Breadcrumb, Match Title, Date and Subtabs (Screenshot 1 top) */}
      <div className="bg-[#2c3e50] text-white border-b border-[#1a252f]">
        {/* Breadcrumb line: Info + Sport */}
        <div className="max-w-7xl mx-auto px-3 py-1.5 flex items-center gap-2 text-xs bg-[#1f2d3d] border-b border-[#182330]">
          <button
            id="match-back-btn"
            onClick={onBack}
            className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors pr-2 border-r border-slate-600 font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-1.5 font-bold text-amber-400">
            <Info className="w-3.5 h-3.5" />
            <span className="capitalize">{match.sport === 'cricket' ? 'Matka / Cricket' : match.sport}</span>
          </div>
        </div>

        {/* Match Title & Datetime */}
        <div className="max-w-7xl mx-auto px-3 py-2">
          <h1 className="text-sm sm:text-base font-black uppercase tracking-wide text-white">
            {match.title}
          </h1>
          <div className="text-[11px] font-semibold text-slate-300 mt-0.5 font-mono">
            {match.date} {match.time}:00
          </div>
        </div>

        {/* Subtabs: ODDS | MATCHED BET (0) | TV ICON (Exact match from screenshot 1) */}
        <div className="max-w-7xl mx-auto px-2 flex items-center justify-between border-t border-[#3a4f66] bg-[#0077b6]">
          <div className="flex items-center">
            <button
              id="subtab-odds"
              onClick={() => setActiveSubTab('odds')}
              className={`px-4 sm:px-6 py-2 text-xs sm:text-sm font-extrabold tracking-wider uppercase transition-colors relative ${
                activeSubTab === 'odds'
                  ? 'text-white bg-[#005f9e] border-b-2 border-white'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              ODDS
            </button>
            <div className="h-5 w-[1px] bg-blue-300/40" />
            <button
              id="subtab-matched"
              onClick={() => setActiveSubTab('matched')}
              className={`px-4 sm:px-6 py-2 text-xs sm:text-sm font-extrabold tracking-wider uppercase transition-colors relative ${
                activeSubTab === 'matched'
                  ? 'text-white bg-[#005f9e] border-b-2 border-white'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              MATCHED BET ({thisMatchBets.length})
            </button>
          </div>

          {/* TV Live Stream button */}
          <button
            id="subtab-tv-btn"
            onClick={() => setShowLiveTv(!showLiveTv)}
            className={`p-1.5 mr-2 rounded text-white transition-all flex items-center gap-1 text-xs font-bold ${
              showLiveTv ? 'bg-rose-600 shadow-sm' : 'hover:bg-blue-600/60'
            }`}
            title="Live Match Radar / TV"
          >
            <Tv className="w-4 h-4" />
            <span className="hidden sm:inline text-[11px]">LIVE TV</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive TV / Animated Pitch Simulator */}
      {showLiveTv && (
        <div className="max-w-7xl mx-auto px-2 py-2">
          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 px-3 py-1.5 flex items-center justify-between border-b border-slate-800 text-xs text-slate-300">
              <div className="flex items-center gap-2 font-bold">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="text-white">LIVE 3D MATCH TRACKER</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/30">
                  SPEED: 141.6 KM/H
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1 text-slate-400 hover:text-white"
                  title={isMuted ? 'Unmute Commentary' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
                <button 
                  onClick={() => setShowLiveTv(false)}
                  className="text-slate-400 hover:text-white text-xs font-bold"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Simulated Pitch Radar Canvas */}
            <div className="relative h-44 sm:h-56 bg-gradient-to-b from-[#0b381e] to-[#041d0f] flex flex-col items-center justify-center p-4 text-center overflow-hidden">
              {/* Pitch turf lines */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="absolute w-40 sm:w-56 h-full border-x-2 border-dashed border-emerald-500/30 bg-emerald-900/20" />
              <div className="absolute top-6 w-24 h-0.5 bg-amber-400/80" />
              <div className="absolute bottom-6 w-24 h-0.5 bg-amber-400/80" />
              
              <div className="relative z-10 flex flex-col items-center">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-rose-600/90 text-white font-mono text-[10px] font-black uppercase tracking-wider mb-2 animate-pulse">
                  BALL IN PLAY • OVER {sb.team2Overs}
                </span>
                <div className="text-white font-black text-base sm:text-xl font-['Chakra_Petch'] drop-shadow">
                  Bowler running in from Pavilion End...
                </div>
                <div className="text-amber-300 text-xs sm:text-sm font-semibold mt-1 max-w-md">
                  {sb.equation}
                </div>
                <div className="flex items-center gap-1.5 mt-3">
                  <span className="text-[11px] text-slate-300 font-bold mr-1">Current Over:</span>
                  {sb.recentBalls.map((b, idx) => (
                    <span 
                      key={idx} 
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow ${
                        b === '4' ? 'bg-emerald-500 text-slate-950' :
                        b === '6' ? 'bg-purple-500 text-white' :
                        b === 'W' ? 'bg-rose-600 text-white' :
                        b === '0' ? 'bg-slate-700 text-slate-300' :
                        'bg-sky-500 text-slate-950'
                      }`}
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Live Cricket Scoreboard Graphic Card (Screenshot 1) */}
      <div className="max-w-7xl mx-auto px-2 pt-2">
        <div 
          className="relative overflow-hidden rounded-t-lg shadow-md border-b-2 border-[#165b33]"
          style={{
            background: 'linear-gradient(135deg, #1b4d2e 0%, #0d2e1b 100%)'
          }}
        >
          {/* Faint grass overlay texture */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#86efac_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

          <div className="relative z-10 p-2.5 sm:p-3 text-white font-sans">
            {/* Team 1 & Team 2 Scores */}
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider">{sb.team1Short}</span>
              </div>
              <div className="font-mono font-black text-sm sm:text-base tracking-wide">
                {sb.team1Score} <span className="text-xs font-semibold text-emerald-200/80">({sb.team1Overs})</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm font-bold mt-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-amber-300">{sb.team2Short}</span>
              </div>
              <div className="font-mono font-black text-sm sm:text-base tracking-wide text-amber-300">
                {sb.team2Score} <span className="text-xs font-semibold text-emerald-200/80">({sb.team2Overs})</span>
                <span className="text-[10px] sm:text-xs text-slate-200 font-sans ml-2 font-normal">
                  CRR <strong className="font-mono text-white font-bold">{sb.crr}</strong> RR <strong className="font-mono text-white font-bold">{sb.rrr}</strong>
                </span>
              </div>
            </div>

            {/* Target Equation */}
            <div className="mt-1 text-xs text-white/90 font-medium">
              {sb.equation}
            </div>

            {/* Recent Balls Circular Badges (Screenshot 1: 2 1 0 4 1 1) */}
            <div className="flex items-center gap-1.5 mt-2">
              {sb.recentBalls.map((b, idx) => (
                <span
                  key={idx}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shadow-sm ${
                    b === '4'
                      ? 'bg-[#10b981] text-slate-950 ring-1 ring-white/50'
                      : b === '6'
                      ? 'bg-[#8b5cf6] text-white ring-1 ring-white/50'
                      : b === 'W'
                      ? 'bg-[#ef4444] text-white ring-1 ring-white/50'
                      : b === '0'
                      ? 'bg-[#334155] text-slate-300'
                      : 'bg-[#0284c7] text-white ring-1 ring-white/30'
                  }`}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Odds Tab or Matched Bets Tab */}
      <div className="max-w-7xl mx-auto px-2 pt-1 space-y-2.5">
        {activeSubTab === 'matched' ? (
          /* Matched Bets Drawer */
          <div className="bg-white rounded-lg border border-slate-300 p-4 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-wide text-slate-800 mb-3 flex items-center justify-between">
              <span>Matched Bets on this Match ({thisMatchBets.length})</span>
              <button 
                onClick={() => setActiveSubTab('odds')}
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                Back to Odds
              </button>
            </h2>

            {thisMatchBets.length === 0 ? (
              <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-xs font-semibold">No active bets on this match yet.</p>
                <button
                  onClick={() => setActiveSubTab('odds')}
                  className="mt-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold"
                >
                  Place a Bet Now
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {thisMatchBets.map(bet => (
                  <div 
                    key={bet.id} 
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase ${
                          bet.betType === 'back' ? 'bg-sky-100 text-sky-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {bet.betType}
                        </span>
                        <span>{bet.selection}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                        Market: {bet.marketType} • Odds: <strong className="text-slate-800">{bet.odds}</strong> • Stake: ₹{bet.stake}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-emerald-600">
                        +₹{bet.potentialProfit}
                      </div>
                      <button
                        onClick={() => handleCashoutClick(`${bet.selection} (${bet.marketType})`)}
                        className="mt-1 px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold shadow-sm"
                      >
                        Cashout
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* 4. MARKET 1: MATCH_ODDS (Exact Screenshot 1) */}
            <div className="bg-white rounded-lg border border-slate-300 shadow-sm overflow-hidden">
              {/* Header Bar: MATCH_ODDS with Cashout button */}
              <div className="bg-[#2c3e50] text-white px-3 py-2 flex items-center justify-between">
                <span className="font-black text-xs sm:text-sm tracking-wider uppercase font-mono">
                  MATCH_ODDS
                </span>
                <button
                  id="cashout-btn-match-odds"
                  onClick={() => handleCashoutClick('MATCH_ODDS')}
                  className="px-2.5 py-0.5 bg-[#2ecc71] hover:bg-[#27ae60] active:scale-95 text-slate-950 font-bold text-xs rounded transition-all shadow-sm"
                >
                  Cashout
                </button>
              </div>

              {/* Subheader: Max: 1L on left, Back / Lay headers on right */}
              <div className="bg-[#f8fafc] px-3 py-1.5 border-b border-slate-200 flex items-center justify-between text-xs">
                <span className="font-bold text-teal-700 text-xs font-mono">
                  Max: 1L
                </span>
                <div className="w-[260px] sm:w-[320px] grid grid-cols-2 text-center font-bold text-xs">
                  <div className="text-sky-800">Back</div>
                  <div className="text-rose-800">Lay</div>
                </div>
              </div>

              {/* Row 1: Edinburgh Castle Rockers */}
              <div className="p-2 sm:p-2.5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 hover:bg-slate-50">
                <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                  {match.team1}
                </div>

                {/* 6 depth columns: 3 Back (light blue shades), 3 Lay (pink shades) matching screenshot */}
                <div className="w-full sm:w-[320px] grid grid-cols-6 gap-1 font-mono text-center">
                  {/* Back 1 */}
                  <button
                    onClick={() => onSelectOdd(match, match.team1, 'back', 36, 'match_odds')}
                    className="p-1 rounded bg-[#a5d8ff] hover:bg-[#74c0fc] text-slate-950 flex flex-col items-center justify-center transition-transform active:scale-95"
                  >
                    <span className="font-black text-xs sm:text-sm leading-tight">36</span>
                    <span className="text-[9px] text-slate-700 leading-tight">74.86</span>
                  </button>

                  {/* Back 2 */}
                  <button
                    onClick={() => onSelectOdd(match, match.team1, 'back', 38, 'match_odds')}
                    className="p-1 rounded bg-[#a5d8ff] hover:bg-[#74c0fc] text-slate-950 flex flex-col items-center justify-center transition-transform active:scale-95"
                  >
                    <span className="font-black text-xs sm:text-sm leading-tight">38</span>
                    <span className="text-[9px] text-slate-700 leading-tight">62.59</span>
                  </button>

                  {/* Back 3 (Primary) */}
                  <button
                    onClick={() => onSelectOdd(match, match.team1, 'back', 50, 'match_odds')}
                    className="p-1 rounded bg-[#72c3fc] hover:bg-[#4dabf7] text-slate-950 flex flex-col items-center justify-center transition-transform active:scale-95 shadow-sm"
                  >
                    <span className="font-black text-xs sm:text-sm leading-tight">50</span>
                    <span className="text-[9px] text-slate-800 font-semibold leading-tight">3430.61</span>
                  </button>

                  {/* Lay 1 (Primary) */}
                  <button
                    onClick={() => onSelectOdd(match, match.team1, 'lay', 55, 'match_odds')}
                    className="p-1 rounded bg-[#ffa8ba] hover:bg-[#ff87a0] text-slate-950 flex flex-col items-center justify-center transition-transform active:scale-95 shadow-sm"
                  >
                    <span className="font-black text-xs sm:text-sm leading-tight">55</span>
                    <span className="text-[9px] text-slate-800 font-semibold leading-tight">27.04</span>
                  </button>

                  {/* Lay 2 */}
                  <button
                    onClick={() => onSelectOdd(match, match.team1, 'lay', 60, 'match_odds')}
                    className="p-1 rounded bg-[#ffc9d6] hover:bg-[#ffa8ba] text-slate-950 flex flex-col items-center justify-center transition-transform active:scale-95"
                  >
                    <span className="font-black text-xs sm:text-sm leading-tight">60</span>
                    <span className="text-[9px] text-slate-700 leading-tight">135.25</span>
                  </button>

                  {/* Lay 3 */}
                  <button
                    onClick={() => onSelectOdd(match, match.team1, 'lay', 65, 'match_odds')}
                    className="p-1 rounded bg-[#ffc9d6] hover:bg-[#ffa8ba] text-slate-950 flex flex-col items-center justify-center transition-transform active:scale-95"
                  >
                    <span className="font-black text-xs sm:text-sm leading-tight">65</span>
                    <span className="text-[9px] text-slate-700 leading-tight">20</span>
                  </button>
                </div>
              </div>

              {/* Row 2: Amsterdam Flames */}
              <div className="p-2 sm:p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 hover:bg-slate-50">
                <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                  {match.team2}
                </div>

                <div className="w-full sm:w-[320px] grid grid-cols-6 gap-1 font-mono text-center">
                  <div className="p-1 rounded bg-slate-100 text-slate-400 text-xs flex items-center justify-center font-bold">-</div>
                  <div className="p-1 rounded bg-slate-100 text-slate-400 text-xs flex items-center justify-center font-bold">-</div>

                  {/* Back 3 */}
                  <button
                    onClick={() => onSelectOdd(match, match.team2, 'back', 1.01, 'match_odds')}
                    className="p-1 rounded bg-[#72c3fc] hover:bg-[#4dabf7] text-slate-950 flex flex-col items-center justify-center transition-transform active:scale-95 shadow-sm"
                  >
                    <span className="font-black text-xs sm:text-sm leading-tight">1.01</span>
                    <span className="text-[9px] text-slate-800 font-semibold leading-tight">376511</span>
                  </button>

                  {/* Lay 1 */}
                  <button
                    onClick={() => onSelectOdd(match, match.team2, 'lay', 1.02, 'match_odds')}
                    className="p-1 rounded bg-[#ffa8ba] hover:bg-[#ff87a0] text-slate-950 flex flex-col items-center justify-center transition-transform active:scale-95 shadow-sm"
                  >
                    <span className="font-black text-xs sm:text-sm leading-tight">1.02</span>
                    <span className="text-[9px] text-slate-800 font-semibold leading-tight">168167</span>
                  </button>

                  {/* Lay 2 */}
                  <button
                    onClick={() => onSelectOdd(match, match.team2, 'lay', 1.03, 'match_odds')}
                    className="p-1 rounded bg-[#ffc9d6] hover:bg-[#ffa8ba] text-slate-950 flex flex-col items-center justify-center transition-transform active:scale-95"
                  >
                    <span className="font-black text-xs sm:text-sm leading-tight">1.03</span>
                    <span className="text-[9px] text-slate-700 leading-tight">43444</span>
                  </button>

                  {/* Lay 3 */}
                  <button
                    onClick={() => onSelectOdd(match, match.team2, 'lay', 1.04, 'match_odds')}
                    className="p-1 rounded bg-[#ffc9d6] hover:bg-[#ffa8ba] text-slate-950 flex flex-col items-center justify-center transition-transform active:scale-95"
                  >
                    <span className="font-black text-xs sm:text-sm leading-tight">1.04</span>
                    <span className="text-[9px] text-slate-700 leading-tight">42132</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 5. MARKET 2: Bookmaker (Exact Screenshot 1) */}
            <div className="bg-white rounded-lg border border-slate-300 shadow-sm overflow-hidden">
              <div className="bg-[#2c3e50] text-white px-3 py-2 flex items-center justify-between">
                <span className="font-black text-xs sm:text-sm tracking-wider uppercase font-mono">
                  Bookmaker
                </span>
                <button
                  id="cashout-btn-bookmaker"
                  onClick={() => handleCashoutClick('Bookmaker')}
                  className="px-2.5 py-0.5 bg-[#2ecc71] hover:bg-[#27ae60] active:scale-95 text-slate-950 font-bold text-xs rounded transition-all shadow-sm"
                >
                  Cashout
                </button>
              </div>

              <div className="bg-[#f8fafc] px-3 py-1.5 border-b border-slate-200 flex items-center justify-between text-xs">
                <span className="font-bold text-teal-700 text-xs font-mono">
                  Min: 100 Max: 50L
                </span>
                <div className="w-[260px] sm:w-[320px] grid grid-cols-2 text-center font-bold text-xs">
                  <div className="text-sky-800">Back</div>
                  <div className="text-rose-800">Lay</div>
                </div>
              </div>

              {/* Row 1: Team 1 */}
              <div className="p-2 sm:p-2.5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 hover:bg-slate-50">
                <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                  {match.team1}
                </div>

                <div className="w-full sm:w-[320px] grid grid-cols-6 gap-1 font-mono text-center">
                  <div className="p-1 rounded bg-slate-100 text-slate-400 text-xs flex items-center justify-center font-bold">-</div>
                  <div className="p-1 rounded bg-slate-100 text-slate-400 text-xs flex items-center justify-center font-bold">-</div>
                  <button
                    onClick={() => onSelectOdd(match, match.team1, 'back', 4000, 'bookmaker')}
                    className="p-1 rounded bg-[#72c3fc] hover:bg-[#4dabf7] text-slate-950 flex flex-col items-center justify-center active:scale-95 shadow-sm"
                  >
                    <span className="font-black text-xs sm:text-sm leading-tight">4000</span>
                    <span className="text-[9px] text-slate-800 font-semibold leading-tight">150000</span>
                  </button>
                  <div className="p-1 rounded bg-slate-100 text-slate-400 text-xs flex items-center justify-center font-bold">-</div>
                  <div className="p-1 rounded bg-slate-100 text-slate-400 text-xs flex items-center justify-center font-bold">-</div>
                  <div className="p-1 rounded bg-slate-100 text-slate-400 text-xs flex items-center justify-center font-bold">-</div>
                </div>
              </div>

              {/* Row 2: Team 2 */}
              <div className="p-2 sm:p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 hover:bg-slate-50">
                <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                  {match.team2}
                </div>

                <div className="w-full sm:w-[320px] grid grid-cols-6 gap-1 font-mono text-center">
                  <button
                    onClick={() => onSelectOdd(match, match.team2, 'back', 0.5, 'bookmaker')}
                    className="p-1 rounded bg-[#a5d8ff] text-slate-950 flex flex-col items-center justify-center"
                  >
                    <span className="font-black text-xs sm:text-sm leading-tight">0.5</span>
                    <span className="text-[9px] text-slate-700 leading-tight">5000000</span>
                  </button>
                  <button
                    onClick={() => onSelectOdd(match, match.team2, 'back', 1, 'bookmaker')}
                    className="p-1 rounded bg-[#a5d8ff] text-slate-950 flex flex-col items-center justify-center"
                  >
                    <span className="font-black text-xs sm:text-sm leading-tight">1</span>
                    <span className="text-[9px] text-slate-700 leading-tight">3000000</span>
                  </button>
                  <button
                    onClick={() => onSelectOdd(match, match.team2, 'back', 1.5, 'bookmaker')}
                    className="p-1 rounded bg-[#72c3fc] hover:bg-[#4dabf7] text-slate-950 flex flex-col items-center justify-center shadow-sm"
                  >
                    <span className="font-black text-xs sm:text-sm leading-tight">1.5</span>
                    <span className="text-[9px] text-slate-800 font-semibold leading-tight">1500000</span>
                  </button>
                  <button
                    onClick={() => onSelectOdd(match, match.team2, 'lay', 2.5, 'bookmaker')}
                    className="p-1 rounded bg-[#ffa8ba] hover:bg-[#ff87a0] text-slate-950 flex flex-col items-center justify-center shadow-sm"
                  >
                    <span className="font-black text-xs sm:text-sm leading-tight">2.5</span>
                    <span className="text-[9px] text-slate-800 font-semibold leading-tight">1500000</span>
                  </button>
                  <button
                    onClick={() => onSelectOdd(match, match.team2, 'lay', 3, 'bookmaker')}
                    className="p-1 rounded bg-[#ffc9d6] text-slate-950 flex flex-col items-center justify-center"
                  >
                    <span className="font-black text-xs sm:text-sm leading-tight">3</span>
                    <span className="text-[9px] text-slate-700 leading-tight">3000000</span>
                  </button>
                  <button
                    onClick={() => onSelectOdd(match, match.team2, 'lay', 3.5, 'bookmaker')}
                    className="p-1 rounded bg-[#ffc9d6] text-slate-950 flex flex-col items-center justify-center"
                  >
                    <span className="font-black text-xs sm:text-sm leading-tight">3.5</span>
                    <span className="text-[9px] text-slate-700 leading-tight">5000000</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 6. Announcement Ticker matching screenshot 1 */}
            <div className="bg-sky-50 border border-sky-200 text-sky-900 py-1.5 px-3 rounded-lg text-xs font-semibold overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-600 animate-ping flex-shrink-0" />
                <marquee className="font-sans">
                  A Zverev v Be Shelton US Open Men's "FINAL" Tennis Match Adv Bets Started In Our Exchange
                </marquee>
              </div>
            </div>

            {/* 7. MARKET 3: Bookmaker 2 (Golden Styled Boxes matching Screenshot 1) */}
            <div className="bg-white rounded-lg border border-slate-300 shadow-sm overflow-hidden">
              <div className="bg-[#2c3e50] text-white px-3 py-2 flex items-center justify-between">
                <span className="font-black text-xs sm:text-sm tracking-wider uppercase font-mono">
                  Bookmaker 2
                </span>
                <button
                  id="cashout-btn-bookmaker2"
                  onClick={() => handleCashoutClick('Bookmaker 2')}
                  className="px-2.5 py-0.5 bg-[#2ecc71] hover:bg-[#27ae60] active:scale-95 text-slate-950 font-bold text-xs rounded transition-all shadow-sm"
                >
                  Cashout
                </button>
              </div>

              <div className="bg-[#f8fafc] px-3 py-1.5 border-b border-slate-200 flex items-center justify-between text-xs">
                <span className="font-bold text-teal-700 text-xs font-mono">
                  Min: 100 Max: 7L
                </span>
                <div className="w-[180px] sm:w-[220px] grid grid-cols-2 text-center font-bold text-xs">
                  <div className="text-sky-800">Back</div>
                  <div className="text-rose-800">Lay</div>
                </div>
              </div>

              {/* Row 1: Edinburgh Castle Rockers. */}
              <div className="p-2 sm:p-2.5 border-b border-slate-200 flex items-center justify-between gap-1.5 hover:bg-slate-50">
                <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                  {match.team1}.
                </div>

                <div className="w-[180px] sm:w-[220px] grid grid-cols-2 gap-1.5 font-mono text-center">
                  <button
                    onClick={() => onSelectOdd(match, match.team1, 'back', 5000, 'bookmaker2')}
                    className="p-1.5 rounded bg-[#ffcc00] hover:bg-[#e6b800] text-slate-950 flex flex-col items-center justify-center transition-transform active:scale-95 shadow-sm"
                  >
                    <span className="font-black text-xs sm:text-sm leading-tight">5000</span>
                    <span className="text-[9px] text-slate-800 font-semibold leading-tight">70000</span>
                  </button>
                  <div className="p-1.5 rounded bg-slate-100 text-slate-400 text-xs flex items-center justify-center font-bold">-</div>
                </div>
              </div>

              {/* Row 2: Amsterdam Flames. */}
              <div className="p-2 sm:p-2.5 flex items-center justify-between gap-1.5 hover:bg-slate-50">
                <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                  {match.team2}.
                </div>

                <div className="w-[180px] sm:w-[220px] grid grid-cols-2 gap-1.5 font-mono text-center">
                  <button
                    onClick={() => onSelectOdd(match, match.team2, 'back', 1.25, 'bookmaker2')}
                    className="p-1.5 rounded bg-[#ffcc00] hover:bg-[#e6b800] text-slate-950 flex flex-col items-center justify-center transition-transform active:scale-95 shadow-sm"
                  >
                    <span className="font-black text-xs sm:text-sm leading-tight">1.25</span>
                    <span className="text-[9px] text-slate-800 font-semibold leading-tight">700000</span>
                  </button>
                  <button
                    onClick={() => onSelectOdd(match, match.team2, 'lay', 2, 'bookmaker2')}
                    className="p-1.5 rounded bg-[#ffb703] hover:bg-[#fb8500] text-slate-950 flex flex-col items-center justify-center transition-transform active:scale-95 shadow-sm"
                  >
                    <span className="font-black text-xs sm:text-sm leading-tight">2</span>
                    <span className="text-[9px] text-slate-800 font-semibold leading-tight">700000</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 8. SPECIAL: BROTHER TOSS BOOK: Coin Toss Winner */}
            <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-blue-500/10 rounded-lg border border-amber-500/40 shadow-sm overflow-hidden">
              <div className="bg-[#002f73] text-white px-3 py-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span className="font-black text-xs sm:text-sm tracking-wider uppercase font-['Chakra_Petch'] text-amber-300">
                    BROTHER TOSS BOOK: COIN TOSS WINNER
                  </span>
                </div>
                <button
                  id="cashout-btn-toss"
                  onClick={() => handleCashoutClick('TOSS MARKET')}
                  className="px-2.5 py-0.5 bg-[#2ecc71] hover:bg-[#27ae60] active:scale-95 text-slate-950 font-bold text-xs rounded transition-all shadow-sm"
                >
                  Cashout
                </button>
              </div>

              <div className="bg-white/80 px-3 py-1.5 border-b border-amber-200/60 flex items-center justify-between text-xs">
                <span className="font-bold text-amber-800 text-xs font-mono">
                  Min: 100 Max: 2L • Instant Settlement
                </span>
                <div className="w-[180px] sm:w-[220px] grid grid-cols-2 text-center font-bold text-xs">
                  <div className="text-sky-800">Back</div>
                  <div className="text-rose-800">Lay</div>
                </div>
              </div>

              {/* Team 1 Toss */}
              <div className="p-2 sm:p-2.5 border-b border-amber-100 bg-white flex items-center justify-between gap-1.5 hover:bg-amber-50/50">
                <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                  🪙 {match.team1} (Toss)
                </div>
                <div className="w-[180px] sm:w-[220px] grid grid-cols-2 gap-1.5 font-mono text-center">
                  <button
                    onClick={() => onSelectOdd(match, `${match.team1} (Toss Winner)`, 'back', match.tossMarket?.team1TossBack || 1.95, 'toss')}
                    className="p-1.5 rounded bg-[#72c3fc] hover:bg-[#4dabf7] text-slate-950 flex flex-col items-center justify-center shadow-sm"
                  >
                    <span className="font-black text-xs sm:text-sm leading-tight">
                      {(match.tossMarket?.team1TossBack || 1.95).toFixed(2)}
                    </span>
                    <span className="text-[9px] text-slate-800 font-semibold leading-tight">500000</span>
                  </button>
                  <button
                    onClick={() => onSelectOdd(match, `${match.team1} (Toss Winner)`, 'lay', match.tossMarket?.team1TossLay || 2.00, 'toss')}
                    className="p-1.5 rounded bg-[#ffa8ba] hover:bg-[#ff87a0] text-slate-950 flex flex-col items-center justify-center shadow-sm"
                  >
                    <span className="font-black text-xs sm:text-sm leading-tight">
                      {(match.tossMarket?.team1TossLay || 2.00).toFixed(2)}
                    </span>
                    <span className="text-[9px] text-slate-800 font-semibold leading-tight">500000</span>
                  </button>
                </div>
              </div>

              {/* Team 2 Toss */}
              <div className="p-2 sm:p-2.5 bg-white flex items-center justify-between gap-1.5 hover:bg-amber-50/50">
                <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                  🪙 {match.team2} (Toss)
                </div>
                <div className="w-[180px] sm:w-[220px] grid grid-cols-2 gap-1.5 font-mono text-center">
                  <button
                    onClick={() => onSelectOdd(match, `${match.team2} (Toss Winner)`, 'back', match.tossMarket?.team2TossBack || 1.95, 'toss')}
                    className="p-1.5 rounded bg-[#72c3fc] hover:bg-[#4dabf7] text-slate-950 flex flex-col items-center justify-center shadow-sm"
                  >
                    <span className="font-black text-xs sm:text-sm leading-tight">
                      {(match.tossMarket?.team2TossBack || 1.95).toFixed(2)}
                    </span>
                    <span className="text-[9px] text-slate-800 font-semibold leading-tight">500000</span>
                  </button>
                  <button
                    onClick={() => onSelectOdd(match, `${match.team2} (Toss Winner)`, 'lay', match.tossMarket?.team2TossLay || 2.00, 'toss')}
                    className="p-1.5 rounded bg-[#ffa8ba] hover:bg-[#ff87a0] text-slate-950 flex flex-col items-center justify-center shadow-sm"
                  >
                    <span className="font-black text-xs sm:text-sm leading-tight">
                      {(match.tossMarket?.team2TossLay || 2.00).toFixed(2)}
                    </span>
                    <span className="text-[9px] text-slate-800 font-semibold leading-tight">500000</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 9. MARKET 4: Score More Runs (S Smith Vs Y Samra ) (Screenshot 2 Top) */}
            <div className="bg-white rounded-lg border border-slate-300 shadow-sm overflow-hidden">
              <div className="bg-[#2c3e50] text-white px-3 py-2 flex items-center justify-between">
                <span className="font-black text-xs sm:text-sm tracking-wider uppercase font-mono">
                  Score More Runs(S Smith Vs Y Samra )
                </span>
                <button
                  id="cashout-btn-runs"
                  onClick={() => handleCashoutClick('Score More Runs')}
                  className="px-2.5 py-0.5 bg-[#2ecc71] hover:bg-[#27ae60] active:scale-95 text-slate-950 font-bold text-xs rounded transition-all shadow-sm"
                >
                  Cashout
                </button>
              </div>

              <div className="bg-[#f8fafc] px-3 py-1.5 border-b border-slate-200 flex items-center justify-between text-xs">
                <span className="font-bold text-teal-700 text-xs font-mono">
                  Min: 100 Max: 1L
                </span>
                <div className="w-[180px] sm:w-[220px] grid grid-cols-2 text-center font-bold text-xs">
                  <div className="text-sky-800">Back</div>
                  <div className="text-rose-800">Lay</div>
                </div>
              </div>

              {/* Steven Smith */}
              <div className="p-2 sm:p-2.5 border-b border-slate-200 flex items-center justify-between gap-1.5 hover:bg-slate-50">
                <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                  Steven Smith
                </div>
                <div className="w-[180px] sm:w-[220px] grid grid-cols-2 gap-1.5 font-mono text-center">
                  <button
                    onClick={() => onSelectOdd(match, 'Steven Smith (More Runs)', 'back', 60, 'player_runs')}
                    className="p-1.5 rounded bg-[#72c3fc] hover:bg-[#4dabf7] text-slate-950 flex flex-col items-center justify-center shadow-sm"
                  >
                    <span className="font-black text-xs sm:text-sm leading-tight">60</span>
                    <span className="text-[9px] text-slate-800 font-semibold leading-tight">100000</span>
                  </button>
                  <button
                    onClick={() => onSelectOdd(match, 'Steven Smith (More Runs)', 'lay', 70, 'player_runs')}
                    className="p-1.5 rounded bg-[#ffa8ba] hover:bg-[#ff87a0] text-slate-950 flex flex-col items-center justify-center shadow-sm"
                  >
                    <span className="font-black text-xs sm:text-sm leading-tight">70</span>
                    <span className="text-[9px] text-slate-800 font-semibold leading-tight">100000</span>
                  </button>
                </div>
              </div>

              {/* Yuvraj Samra */}
              <div className="p-2 sm:p-2.5 flex items-center justify-between gap-1.5 hover:bg-slate-50">
                <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                  Yuvraj Samra
                </div>
                <div className="w-[180px] sm:w-[220px] grid grid-cols-2 gap-1.5 font-mono text-center">
                  <button
                    onClick={() => onSelectOdd(match, 'Yuvraj Samra (More Runs)', 'back', 142, 'player_runs')}
                    className="p-1.5 rounded bg-[#72c3fc] hover:bg-[#4dabf7] text-slate-950 flex flex-col items-center justify-center shadow-sm"
                  >
                    <span className="font-black text-xs sm:text-sm leading-tight">142</span>
                    <span className="text-[9px] text-slate-800 font-semibold leading-tight">25000</span>
                  </button>
                  <button
                    onClick={() => onSelectOdd(match, 'Yuvraj Samra (More Runs)', 'lay', 166, 'player_runs')}
                    className="p-1.5 rounded bg-[#ffa8ba] hover:bg-[#ff87a0] text-slate-950 flex flex-col items-center justify-center shadow-sm"
                  >
                    <span className="font-black text-xs sm:text-sm leading-tight">166</span>
                    <span className="text-[9px] text-slate-800 font-semibold leading-tight">25000</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 10. MARKET 5: Normal (Session / Fancy Markets from Screenshot 2) */}
            <div className="bg-white rounded-lg border border-slate-300 shadow-sm overflow-hidden">
              {/* Header Bar: Normal */}
              <div className="bg-[#2c3e50] text-white px-3 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-black text-xs sm:text-sm tracking-wider uppercase font-mono">
                    Normal
                  </span>
                  <span className="text-[10px] text-slate-300 font-semibold hidden sm:inline">
                    (Session / Fancy Markets)
                  </span>
                </div>

                {/* Quick search input */}
                <div className="relative w-36 sm:w-48">
                  <input
                    type="text"
                    value={normalSearch}
                    onChange={(e) => setNormalSearch(e.target.value)}
                    placeholder="Search session..."
                    className="w-full pl-2 pr-6 py-0.5 rounded text-[11px] bg-[#1a252f] text-white placeholder-slate-400 focus:outline-none border border-slate-600"
                  />
                  {normalSearch && (
                    <button
                      onClick={() => setNormalSearch('')}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Column Headers: Market Name | No (Pink) | Yes (Blue) */}
              <div className="bg-[#f8fafc] px-3 py-1.5 border-b border-slate-200 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">Market</span>
                <div className="w-[180px] sm:w-[220px] grid grid-cols-2 text-center font-bold text-xs">
                  <div className="text-rose-800">No</div>
                  <div className="text-sky-800">Yes</div>
                </div>
              </div>

              {/* List of Session Markets matching Screenshot 2 */}
              <div className="divide-y divide-slate-200">
                {filteredNormalItems.map((item) => {
                  return (
                    <div
                      key={item.id}
                      className="p-2 sm:p-2.5 flex items-center justify-between gap-1.5 hover:bg-slate-50 transition-colors"
                    >
                      {/* Market Name & Badges */}
                      <div className="flex items-center gap-1.5 min-w-0 pr-2">
                        <span className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                          {item.name}
                        </span>
                        {item.badge && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-[#34495e] text-white flex-shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>

                      {/* Right column: Either suspended / ball running bar OR No/Yes odds */}
                      <div className="w-[180px] sm:w-[220px] flex-shrink-0">
                        {item.status === 'suspended' ? (
                          /* Dark Gray Bar with Red SUSPENDED */
                          <div className="w-full py-1.5 bg-[#3a4454] rounded text-center text-rose-500 font-mono font-black text-xs tracking-wider shadow-inner">
                            - SUSPENDED -
                          </div>
                        ) : item.status === 'ball_running' ? (
                          /* Dark Gray Bar with Blinking Red BALL RUNNING */
                          <div className="w-full py-1.5 bg-[#3a4454] rounded text-center text-rose-500 font-mono font-black text-xs tracking-wider shadow-inner animate-pulse">
                            - BALL RUNNING -
                          </div>
                        ) : (
                          /* No (Pink) and Yes (Sky Blue) boxes matching screenshot 2 */
                          <div className="grid grid-cols-2 gap-1.5 font-mono text-center">
                            {/* No Box (Pink) */}
                            <button
                              onClick={() => onSelectOdd(match, `${item.name} [No]`, 'lay', (item.no?.price || 50) / 10, 'normal')}
                              className="p-1 rounded bg-[#ffa8ba] hover:bg-[#ff87a0] text-slate-950 flex flex-col items-center justify-center transition-transform active:scale-95 shadow-sm"
                            >
                              <span className="font-black text-xs sm:text-sm leading-tight">{item.no?.price}</span>
                              <span className="text-[9px] text-slate-800 font-semibold leading-tight">{item.no?.size}</span>
                            </button>

                            {/* Yes Box (Sky Blue) */}
                            <button
                              onClick={() => onSelectOdd(match, `${item.name} [Yes]`, 'back', (item.yes?.price || 50) / 10, 'normal')}
                              className="p-1 rounded bg-[#72c3fc] hover:bg-[#4dabf7] text-slate-950 flex flex-col items-center justify-center transition-transform active:scale-95 shadow-sm"
                            >
                              <span className="font-black text-xs sm:text-sm leading-tight">{item.yes?.price}</span>
                              <span className="text-[9px] text-slate-800 font-semibold leading-tight">{item.yes?.size}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Inter-market announcement ticker matching screenshot 2 */}
            <div className="bg-slate-200 text-slate-700 py-1.5 px-3 rounded-lg text-xs font-semibold overflow-hidden border border-slate-300">
              <marquee className="font-sans">
                **NEW WWE VIRTUAL EVENT: "Winning Methods " | Bets Started In Our Exchange
              </marquee>
            </div>
          </>
        )}
      </div>

      {/* Cashout Confirmation Modal */}
      {cashoutModalMarket && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="bg-[#0b1b33] border border-emerald-500/60 rounded-2xl p-5 max-w-sm w-full text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between mb-3 border-b border-blue-900 pb-2">
              <div className="flex items-center gap-2 text-emerald-400 font-black">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-sm font-['Chakra_Petch']">CASHOUT POSITION</span>
              </div>
              <button
                onClick={() => setCashoutModalMarket(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {cashoutDone ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 mx-auto flex items-center justify-center text-xl font-bold">
                  ✓
                </div>
                <h3 className="text-base font-bold text-white">Cashout Successful!</h3>
                <p className="text-xs text-slate-300">Profits credited instantly to your main balance.</p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div>
                  <div className="text-slate-400 font-bold uppercase text-[10px]">Market</div>
                  <div className="text-white font-bold text-sm">{cashoutModalMarket}</div>
                </div>

                <div className="p-3 rounded-xl bg-blue-950/80 border border-blue-800/80 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Active Match:</span>
                    <span className="font-semibold text-white">{match.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Cashout Value:</span>
                    <span className="font-mono font-black text-emerald-400 text-sm">₹850.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Guaranteed Return:</span>
                    <span className="font-mono font-bold text-amber-300">+₹350.00 Profit</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setCashoutModalMarket(null)}
                    className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-slate-300 text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    id="confirm-cashout-submit"
                    onClick={() => confirmCashout(850)}
                    className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-lg active:scale-95"
                  >
                    Confirm Cashout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

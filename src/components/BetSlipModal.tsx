import React, { useState } from 'react';
import { X, Check, AlertCircle, Coins, ArrowRight } from 'lucide-react';
import { Bet, Language, MatchMarket, User } from '../types';
import { getTranslation } from '../utils/i18n';

interface BetSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectionData: {
    match: MatchMarket;
    selection: string;
    betType: 'back' | 'lay';
    odds: number;
    marketType: 'match_odds' | 'bookmaker' | 'bookmaker2' | 'fancy' | 'normal' | 'toss' | 'player_runs';
  } | null;
  user: User;
  lang: Language;
  onPlaceBet: (bet: Bet, updatedBalance: number, updatedExposure: number) => void;
}

const STAKE_PRESETS = [100, 500, 1000, 2000, 5000, 10000];

export const BetSlipModal: React.FC<BetSlipModalProps> = ({
  isOpen,
  onClose,
  selectionData,
  user,
  lang,
  onPlaceBet
}) => {
  const [stake, setStake] = useState<number>(500);
  const [error, setError] = useState('');
  const [placed, setPlaced] = useState(false);

  if (!isOpen || !selectionData) return null;

  const { match, selection, betType, odds, marketType } = selectionData;
  const isBack = betType === 'back';

  // Profit calculation:
  // Back: profit = stake * (odds - 1)
  // Lay: profit = stake; liability = stake * (odds - 1)
  const potentialProfit = isBack ? Math.round(stake * (odds - 1)) : stake;
  const liability = isBack ? stake : Math.round(stake * (odds - 1));

  const handlePreset = (val: number) => {
    setStake(val);
    setError('');
  };

  const handlePlace = () => {
    if (stake <= 0) {
      setError(lang === 'hi' ? 'कृपया सही राशि दर्ज करें' : 'Please enter valid stake');
      return;
    }
    if (liability > user.balance) {
      setError(
        lang === 'hi'
          ? `अपर्याप्त बैलेंस! इस दांव के लिए ₹${liability} आवश्यक है, आपके पास ₹${user.balance} है।`
          : `Insufficient funds! Need ₹${liability}, you have ₹${user.balance}.`
      );
      return;
    }

    const newBet: Bet = {
      id: `BET-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: user.id,
      matchId: match.id,
      matchTitle: match.title,
      selection: selection,
      betType: betType,
      marketType: marketType,
      odds: odds,
      stake: stake,
      potentialProfit: potentialProfit,
      status: 'open',
      timestamp: new Date().toLocaleTimeString()
    };

    const newBalance = user.balance - liability;
    const newExposure = user.exposure + liability;

    setPlaced(true);
    setTimeout(() => {
      onPlaceBet(newBet, newBalance, newExposure);
      setPlaced(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 sm:bottom-auto sm:inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs">
      <div 
        id="bet-slip-container"
        className="w-full sm:max-w-md bg-[#0a1931] border-t sm:border border-blue-800 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden text-slate-100 animate-in slide-in-from-bottom duration-200"
      >
        {/* Header bar styled blue or pink depending on Back or Lay */}
        <div className={`p-3 sm:p-4 flex items-center justify-between ${
          isBack ? 'bg-[#1b4372]' : 'bg-[#70243b]'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[11px] font-black uppercase ${
              isBack ? 'bg-[#71c5ef] text-slate-900' : 'bg-[#fbbacb] text-slate-900'
            }`}>
              {betType.toUpperCase()}
            </span>
            <span className="text-sm font-bold text-white">
              {marketType === 'toss' ? 'TOSS MARKET SLIP' : 'MATCH ODDS SLIP'}
            </span>
          </div>
          <button 
            id="close-betslip-btn"
            onClick={onClose}
            className="p-1 rounded-md hover:bg-black/30 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slip details */}
        <div className="p-4 space-y-3.5 text-xs">
          <div>
            <div className="text-[11px] text-slate-400">{match.title}</div>
            <div className="text-sm font-extrabold text-amber-300 mt-0.5 flex items-center justify-between">
              <span>{selection}</span>
              <span className="font-mono text-base px-2 py-0.5 rounded bg-black/40 border border-white/20">
                @{odds.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Stake Input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-slate-300 font-semibold">{getTranslation(lang, 'stake')} (₹):</label>
              <span className="text-[11px] text-slate-400">
                Bal: <span className="text-emerald-400 font-mono font-bold">₹{user.balance}</span>
              </span>
            </div>
            <input
              id="bet-stake-input"
              type="number"
              min="10"
              max={user.balance}
              value={stake}
              onChange={(e) => {
                setStake(parseInt(e.target.value, 10) || 0);
                setError('');
              }}
              className="w-full px-3 py-2 bg-[#061224] border border-blue-800 rounded-xl text-white font-mono text-base font-bold focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Stake preset chips */}
          <div className="grid grid-cols-6 gap-1.5">
            {STAKE_PRESETS.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handlePreset(val)}
                className={`py-1.5 rounded-lg font-mono font-bold text-[11px] transition-colors ${
                  stake === val
                    ? 'bg-amber-400 text-slate-950 shadow'
                    : 'bg-[#0f2444] text-slate-300 hover:bg-blue-900'
                }`}
              >
                {val >= 1000 ? `${val / 1000}k` : val}
              </button>
            ))}
          </div>

          {/* Return Breakdown */}
          <div className="p-3 bg-[#061224] rounded-xl border border-blue-900/60 flex items-center justify-between font-mono">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Liability / Risk</span>
              <span className="text-xs font-bold text-rose-400">₹{liability}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase">Potential Profit</span>
              <span className="text-sm font-extrabold text-emerald-400">₹{potentialProfit}</span>
            </div>
          </div>

          {error && (
            <div className="p-2.5 bg-rose-950/60 border border-rose-800 rounded-lg text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {placed ? (
            <div className="py-3 bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2">
              <Check className="w-5 h-5 animate-bounce" />
              <span>{lang === 'hi' ? 'दांव सफलतापूर्वक लगाया गया!' : 'Bet Placed Successfully!'}</span>
            </div>
          ) : (
            <button
              id="confirm-place-bet-btn"
              type="button"
              onClick={handlePlace}
              className={`w-full py-3 rounded-xl font-black font-['Chakra_Petch'] text-sm tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all ${
                isBack
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950'
                  : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-slate-950'
              }`}
            >
              <span>{getTranslation(lang, 'placeBet')} (Stake ₹{stake})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

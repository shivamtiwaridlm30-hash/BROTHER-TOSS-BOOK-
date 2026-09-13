import React from 'react';
import { Flame, Coins } from 'lucide-react';
import { MatchMarket, Language } from '../types';
import { getTranslation } from '../utils/i18n';

interface MatchListProps {
  matches: MatchMarket[];
  onSelectOdd: (
    match: MatchMarket,
    selection: string,
    betType: 'back' | 'lay',
    odds: number,
    marketType: 'match_odds' | 'toss'
  ) => void;
  onSelectMatch?: (match: MatchMarket) => void;
  lang: Language;
}

export const MatchList: React.FC<MatchListProps> = ({
  matches,
  onSelectOdd,
  onSelectMatch,
  lang
}) => {
  if (matches.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200 my-3 shadow-sm">
        {lang === 'hi' ? 'कोई मैच उपलब्ध नहीं है।' : 'No matches found in this category.'}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden my-3 select-none">
      {matches.map((match, idx) => (
        <div
          key={match.id}
          className={`p-3 sm:p-4 hover:bg-slate-50/80 transition-colors ${
            idx < matches.length - 1 ? 'border-b border-slate-200' : ''
          }`}
        >
          {/* Row 1: Title on left, MO BM F on right (Matching screenshot!) */}
          <div className="flex items-center justify-between gap-1.5 sm:gap-2 min-w-0">
            <div 
              onClick={() => onSelectMatch && onSelectMatch(match)}
              className="flex items-center gap-1.5 min-w-0 flex-1 cursor-pointer group"
              title="Click to view inside match interface"
            >
              {match.isLive && (
                <span className="flex-shrink-0 inline-flex items-center gap-1 text-[9px] font-black uppercase text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 animate-pulse">
                  <Flame className="w-3 h-3 text-rose-600" /> LIVE
                </span>
              )}
              <h3 className="font-bold text-xs sm:text-base text-slate-900 group-hover:text-blue-700 transition-colors truncate min-w-0">
                {match.title}
              </h3>
              <span className="text-[10px] text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline whitespace-nowrap">
                Open Match →
              </span>
            </div>

            {/* Screenshot tags: MO BM F */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 flex-shrink-0">
              {match.tags.map((tag) => (
                <span
                  key={tag}
                  className={`font-mono text-[11px] sm:text-xs ${
                    tag === 'TOSS' ? 'text-amber-600 font-extrabold bg-amber-50 px-1 rounded' : 'text-slate-600'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Row 2: Date & Time in vivid orange matching screenshot! */}
          <div 
            onClick={() => onSelectMatch && onSelectMatch(match)}
            className="mt-0.5 text-[11px] sm:text-xs font-semibold text-[#ea580c] font-sans cursor-pointer hover:underline inline-block"
          >
            {match.date} {match.time}
          </div>

          {/* Row 3: Column headers 1 | X | 2 right aligned above odds */}
          <div className="mt-1.5 sm:mt-2 flex items-center justify-end">
            <div className="w-full sm:w-[420px] grid grid-cols-3 gap-1.5 sm:gap-2 text-center text-xs font-extrabold text-slate-700 mb-1">
              <div>1</div>
              <div>X</div>
              <div>2</div>
            </div>
          </div>

          {/* Row 4: Odds Boxes (Sky Blue for Back, Pastel Pink for Lay) matching screenshot! */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 min-w-0">
            {/* Teams summary on mobile */}
            <div className="text-[11px] text-slate-600 font-semibold truncate sm:hidden min-w-0">
              {match.team1} vs {match.team2}
            </div>

            {/* Odds boxes aligned to right on desktop */}
            <div className="w-full sm:w-[420px] sm:ml-auto grid grid-cols-3 gap-1 sm:gap-2 min-w-0">
              {/* Pair 1 (Home) */}
              <div className="grid grid-cols-2 gap-0.5 sm:gap-1">
                <button
                  type="button"
                  onClick={() => onSelectOdd(match, match.team1, 'back', match.odds1.back, 'match_odds')}
                  className="py-1 sm:py-1.5 px-0.5 sm:px-1 rounded bg-[#72c3fc] hover:bg-[#5db8fa] active:scale-95 text-slate-950 font-black text-[11px] sm:text-sm font-sans text-center transition-transform shadow-sm truncate"
                  title={`Back ${match.team1}`}
                >
                  {match.odds1.back.toFixed(2)}
                </button>
                <button
                  type="button"
                  onClick={() => onSelectOdd(match, match.team1, 'lay', match.odds1.lay, 'match_odds')}
                  className="py-1 sm:py-1.5 px-0.5 sm:px-1 rounded bg-[#ffa8ba] hover:bg-[#ff94a9] active:scale-95 text-slate-950 font-black text-[11px] sm:text-sm font-sans text-center transition-transform shadow-sm truncate"
                  title={`Lay ${match.team1}`}
                >
                  {match.odds1.lay.toFixed(2)}
                </button>
              </div>

              {/* Pair X (Tie / Draw) */}
              <div className="grid grid-cols-2 gap-0.5 sm:gap-1">
                {match.oddsTie ? (
                  <>
                    <button
                      type="button"
                      onClick={() => onSelectOdd(match, 'Tie / Draw', 'back', match.oddsTie!.back, 'match_odds')}
                      className="py-1 sm:py-1.5 px-0.5 sm:px-1 rounded bg-[#72c3fc] hover:bg-[#5db8fa] active:scale-95 text-slate-950 font-black text-[11px] sm:text-sm font-sans text-center transition-transform shadow-sm truncate"
                    >
                      {match.oddsTie.back.toFixed(2)}
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectOdd(match, 'Tie / Draw', 'lay', match.oddsTie!.lay, 'match_odds')}
                      className="py-1 sm:py-1.5 px-0.5 sm:px-1 rounded bg-[#ffa8ba] hover:bg-[#ff94a9] active:scale-95 text-slate-950 font-black text-[11px] sm:text-sm font-sans text-center transition-transform shadow-sm truncate"
                    >
                      {match.oddsTie.lay.toFixed(2)}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="py-1 sm:py-1.5 px-0.5 sm:px-1 rounded bg-[#72c3fc]/80 text-slate-900 font-bold text-xs text-center select-none flex items-center justify-center">
                      -
                    </div>
                    <div className="py-1 sm:py-1.5 px-0.5 sm:px-1 rounded bg-[#ffa8ba]/80 text-slate-900 font-bold text-xs text-center select-none flex items-center justify-center">
                      -
                    </div>
                  </>
                )}
              </div>

              {/* Pair 2 (Away) */}
              <div className="grid grid-cols-2 gap-0.5 sm:gap-1">
                <button
                  type="button"
                  onClick={() => onSelectOdd(match, match.team2, 'back', match.odds2.back, 'match_odds')}
                  className="py-1 sm:py-1.5 px-0.5 sm:px-1 rounded bg-[#72c3fc] hover:bg-[#5db8fa] active:scale-95 text-slate-950 font-black text-[11px] sm:text-sm font-sans text-center transition-transform shadow-sm truncate"
                  title={`Back ${match.team2}`}
                >
                  {match.odds2.back.toFixed(2)}
                </button>
                <button
                  type="button"
                  onClick={() => onSelectOdd(match, match.team2, 'lay', match.odds2.lay, 'match_odds')}
                  className="py-1 sm:py-1.5 px-0.5 sm:px-1 rounded bg-[#ffa8ba] hover:bg-[#ff94a9] active:scale-95 text-slate-950 font-black text-[11px] sm:text-sm font-sans text-center transition-transform shadow-sm truncate"
                  title={`Lay ${match.team2}`}
                >
                  {match.odds2.lay.toFixed(2)}
                </button>
              </div>
            </div>
          </div>

          {/* Special Brother Toss Book Market strip */}
          {match.tossMarket && (
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/90 px-2 sm:px-2.5 py-1.5 rounded-lg border border-slate-200/80 min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-amber-700 font-bold min-w-0">
                <Coins className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                <span className="truncate">BROTHER TOSS BOOK: Coin Toss Winner</span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 sm:flex sm:items-center sm:gap-2 text-xs w-full sm:w-auto">
                <button
                  onClick={() => onSelectOdd(match, `${match.team1} (Toss Winner)`, 'back', match.tossMarket!.team1TossBack, 'toss')}
                  className="px-2 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-[11px] sm:text-xs shadow-sm truncate text-center"
                >
                  <span className="truncate">{match.team1} ({match.tossMarket.team1TossBack.toFixed(2)})</span>
                </button>

                <button
                  onClick={() => onSelectOdd(match, `${match.team2} (Toss Winner)`, 'back', match.tossMarket!.team2TossBack, 'toss')}
                  className="px-2 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-[11px] sm:text-xs shadow-sm truncate text-center"
                >
                  <span className="truncate">{match.team2} ({match.tossMarket.team2TossBack.toFixed(2)})</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

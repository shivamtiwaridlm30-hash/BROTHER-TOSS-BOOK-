import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { MatchMarket } from '../types';

interface TickerBarProps {
  matches: MatchMarket[];
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onSelectMatch: (match: MatchMarket) => void;
}

export const TickerBar: React.FC<TickerBarProps> = ({
  matches,
  searchTerm,
  onSearchChange,
  onSelectMatch
}) => {
  const [showInput, setShowInput] = useState(false);

  return (
    <div className="bg-[#00388d] border-b border-[#002a6b] py-1.5 px-2 sm:px-4 select-none w-full overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center gap-2 min-w-0 w-full">
        {/* Screenshot: Round white search button */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            id="ticker-search-toggle-btn"
            onClick={() => setShowInput(!showInput)}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center text-slate-900 shadow-sm transition-transform active:scale-95"
            title="Search Markets"
          >
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-900 stroke-[2.5]" />
          </button>

          {/* Search input (collapsible or persistent) */}
          {showInput && (
            <div className="relative w-32 sm:w-60 animate-in fade-in zoom-in-95 duration-150">
              <input
                id="market-search-input"
                type="text"
                autoFocus
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search..."
                className="w-full pl-2.5 pr-6 py-1 bg-white text-slate-900 placeholder-slate-500 rounded-full text-[11px] sm:text-xs font-semibold focus:outline-none shadow-sm"
              />
              {searchTerm ? (
                <button 
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : null}
            </div>
          )}
        </div>

        {/* Scrolling Match Ticker with 2-line dark blue pills matching screenshot */}
        <div className="flex-1 min-w-0 flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 scroll-smooth">
          {matches.map((m) => (
            <button
              key={m.id}
              onClick={() => onSelectMatch(m)}
              className="flex-shrink-0 px-2.5 sm:px-3 py-1 bg-[#00245a] hover:bg-[#001c47] border border-[#001738] rounded-lg text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-white group-hover:text-amber-300">
                <span>{m.sport === 'cricket' ? '🏏' : m.sport === 'football' ? '⚽' : m.sport === 'tennis' ? '🎾' : '🪙'}</span>
                <span className="whitespace-nowrap">{m.title}</span>
              </div>
              <div className="text-[9px] sm:text-[10px] text-blue-200/80 font-mono">
                {m.date} {m.time}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

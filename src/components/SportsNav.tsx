import React from 'react';
import { 
  Flame, 
  Trophy, 
  Gamepad2, 
  Coins, 
  Sparkles, 
  Clock, 
  Layers, 
  Calendar 
} from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/i18n';

interface SportsNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  selectedSport: string;
  onSelectSport: (sport: string) => void;
  filterMode: 'live' | 'virtual' | 'premium';
  onFilterModeChange: (mode: 'live' | 'virtual' | 'premium') => void;
  viewBy: 'time' | 'competition';
  onViewByChange: (view: 'time' | 'competition') => void;
  lang: Language;
}

export const SportsNav: React.FC<SportsNavProps> = ({
  activeTab,
  onTabChange,
  selectedSport,
  onSelectSport,
  filterMode,
  onFilterModeChange,
  viewBy,
  onViewByChange,
  lang
}) => {
  const mainTabs = [
    { id: 'inplay', label: getTranslation(lang, 'inplay') },
    { id: 'sports', label: getTranslation(lang, 'sports') },
    { id: 'casino', label: getTranslation(lang, 'casino') },
    { id: 'sportsBook', label: getTranslation(lang, 'sportsBook') },
    { id: 'toss', label: getTranslation(lang, 'tossMarkets') },
    { id: 'multiMarkets', label: getTranslation(lang, 'multiMarkets') },
    { id: 'others', label: getTranslation(lang, 'others') },
  ];

  const sportsIcons = [
    { id: 'cricket', name: getTranslation(lang, 'cricket'), icon: '🏏', badge: 'LIVE' },
    { id: 'football', name: getTranslation(lang, 'football'), icon: '⚽' },
    { id: 'tennis', name: getTranslation(lang, 'tennis'), icon: '🎾' },
    { id: 'toss', name: 'Toss Special', icon: '🪙', isNew: true },
    { id: 'fantasy', name: getTranslation(lang, 'fantasy11'), icon: '🎽', isNew: true },
    { id: 'cricketBattle', name: getTranslation(lang, 'cricketBattle'), icon: '⚔️' },
    { id: 'cockFight', name: getTranslation(lang, 'cockFight'), icon: '🐓' },
    { id: 'horse', name: getTranslation(lang, 'horseRacing'), icon: '🐎' }
  ];

  return (
    <div className="bg-[#002f73] border-b border-[#001f4d] select-none text-white w-full overflow-hidden">
      {/* 1. Main Navigation Row with | dividers matching screenshot:
          INPLAY | SPORTS | CASINO | SPORTS BOOK | OTHERS | MULTI MARKETS */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 bg-[#003380] border-b border-[#002660] w-full min-w-0">
        <div className="flex items-center overflow-x-auto no-scrollbar py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold tracking-wider w-full min-w-0">
          {mainTabs.map((tab, idx) => {
            const isActive = activeTab === tab.id;
            return (
              <React.Fragment key={tab.id}>
                <button
                  onClick={() => onTabChange(tab.id)}
                  className={`flex-shrink-0 px-2 sm:px-2.5 py-0.5 sm:py-1 uppercase whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#ffde00] font-black border-b-2 border-[#ffde00]'
                      : 'text-white hover:text-blue-200'
                  }`}
                >
                  {tab.label}
                </button>
                {idx < mainTabs.length - 1 && (
                  <span className="text-blue-400/60 font-light select-none px-0.5">|</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* 2. Sports Carousel Row with circular icons matching screenshot */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-2.5 bg-[#001b44] w-full min-w-0">
        <div className="flex items-center gap-2.5 sm:gap-5 overflow-x-auto no-scrollbar py-1 w-full min-w-0">
          {sportsIcons.map((s) => {
            const isSelected = selectedSport === s.id;
            return (
              <button
                key={s.id}
                onClick={() => onSelectSport(s.id)}
                className="flex-shrink-0 flex flex-col items-center group relative cursor-pointer"
              >
                {s.isNew && (
                  <span className="absolute -top-1.5 right-0 bg-[#e60000] text-white text-[8px] font-black px-1 py-0.2 rounded-full uppercase scale-90 shadow">
                    NEW
                  </span>
                )}
                {s.badge && (
                  <span className="absolute -top-1.5 bg-emerald-600 text-white text-[8px] font-black px-1 py-0.2 rounded uppercase animate-pulse">
                    {s.badge}
                  </span>
                )}

                <div
                  className={`w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl transition-all border ${
                    isSelected
                      ? 'bg-[#0047b3] border-[#ffde00] shadow-md shadow-blue-900/60 ring-2 ring-[#ffde00]/60 scale-105'
                      : 'bg-[#002660] border-[#00388d] group-hover:border-blue-400 group-hover:bg-[#003380]'
                  }`}
                >
                  <span>{s.icon}</span>
                </div>
                <span
                  className={`mt-1 text-[10px] sm:text-xs font-semibold whitespace-nowrap ${
                    isSelected ? 'text-[#ffde00] font-bold' : 'text-slate-200 group-hover:text-white'
                  }`}
                >
                  {s.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Subfilter pill buttons matching screenshot:
          `(- LIVE -)` (white pill with black text), `(- VIRTUAL -)`, `(- PREMIUM -)` and `View by: TIME ⌵` */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-1.5 sm:py-2 bg-[#001433] border-t border-[#000e26] flex items-center justify-between gap-1.5 text-xs overflow-x-auto no-scrollbar w-full min-w-0">
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => onFilterModeChange('live')}
            className={`px-2.5 sm:px-3 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              filterMode === 'live'
                ? 'bg-white text-slate-950 border border-slate-950 shadow-sm'
                : 'bg-[#002660] text-blue-200 border border-blue-800 hover:text-white'
            }`}
          >
            (- LIVE -)
          </button>
          <button
            onClick={() => onFilterModeChange('virtual')}
            className={`px-2.5 sm:px-3 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              filterMode === 'virtual'
                ? 'bg-white text-slate-950 border border-slate-950 shadow-sm'
                : 'bg-[#002660] text-blue-200 border border-blue-800 hover:text-white'
            }`}
          >
            (- VIRTUAL -)
          </button>
          <button
            onClick={() => onFilterModeChange('premium')}
            className={`px-2.5 sm:px-3 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              filterMode === 'premium'
                ? 'bg-white text-slate-950 border border-slate-950 shadow-sm'
                : 'bg-[#002660] text-blue-200 border border-blue-800 hover:text-white'
            }`}
          >
            (- PREMIUM -)
          </button>
        </div>

        {/* View by selector matching screenshot pill */}
        <div className="flex items-center gap-1 text-slate-200 flex-shrink-0">
          <span className="text-[10px] sm:text-[11px] font-semibold">{getTranslation(lang, 'viewBy')}:</span>
          <div className="relative">
            <select
              value={viewBy}
              onChange={(e) => onViewByChange(e.target.value as 'time' | 'competition')}
              className="bg-[#00388d] text-white font-bold text-[10px] sm:text-xs py-0.5 sm:py-1 pl-2 pr-5 rounded-full border border-blue-500/40 focus:outline-none cursor-pointer appearance-none shadow-sm"
            >
              <option value="time">TIME</option>
              <option value="competition">COMP</option>
            </select>
            <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-[9px] text-white font-bold">
              ⌵
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

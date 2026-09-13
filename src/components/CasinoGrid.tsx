import React, { useState } from 'react';
import { Sparkles, Play } from 'lucide-react';
import { CASINO_GAMES, NEW_LAUNCH_GAMES } from '../data/mockData';
import { Language, User } from '../types';

interface CasinoGridProps {
  user: User;
  lang: Language;
  onGamePlay?: (gameName: string) => void;
}

export const CasinoGrid: React.FC<CasinoGridProps> = ({ user, lang, onGamePlay }) => {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const handleLaunch = (gameName: string) => {
    setActiveGame(gameName);
    if (onGamePlay) onGamePlay(gameName);
    setTimeout(() => {
      setActiveGame(null);
    }, 2500);
  };

  return (
    <div className="my-4 select-none">
      {/* 4-Columns Grid matching screenshot */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {CASINO_GAMES.map((game) => (
          <div
            key={game.id}
            onClick={() => handleLaunch(game.name)}
            className="group relative rounded-xl overflow-hidden cursor-pointer bg-slate-900 border border-blue-900/60 shadow-md hover:border-amber-400 transition-all hover:scale-[1.02] active:scale-95"
          >
            {/* Card Graphic with dynamic background gradient and icon */}
            <div className={`h-32 sm:h-36 bg-gradient-to-br ${game.color} p-3 flex flex-col justify-between relative overflow-hidden`}>
              {/* Subtle background icon illustration */}
              <div className="absolute right-1 bottom-1 opacity-25 text-5xl select-none pointer-events-none group-hover:scale-110 transition-transform">
                {game.image}
              </div>

              {/* Tag pill */}
              <div className="flex justify-between items-start z-10">
                <span className="px-1.5 py-0.5 rounded text-[8px] font-black tracking-wider uppercase bg-black/70 text-amber-300 border border-amber-400/40">
                  {game.tag}
                </span>
                <span className="w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-[#ffde00] group-hover:text-slate-950 transition-colors">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </span>
              </div>

              {/* Title inside card */}
              <div className="z-10 mt-auto">
                <div className="text-sm sm:text-base font-black font-['Chakra_Petch'] text-white tracking-wide drop-shadow-md leading-tight uppercase">
                  {game.name}
                </div>
                <div className="text-[10px] text-white/90 font-medium">
                  {game.subtitle}
                </div>
              </div>
            </div>

            {/* Bottom mini bar */}
            <div className="px-2 py-1 bg-[#001738] flex items-center justify-between text-[9px] text-blue-200">
              <span>98.5% RTP</span>
              <span className="text-emerald-400 font-bold">PLAY NOW</span>
            </div>
          </div>
        ))}
      </div>

      {/* NEW LAUNCH Section Header matching screenshot! */}
      <div className="mt-5 mb-2.5 bg-[#00388d] text-white font-black font-['Chakra_Petch'] text-xs sm:text-sm px-3 py-1.5 rounded-lg flex items-center justify-between shadow-sm">
        <span className="tracking-wider uppercase">NEW LAUNCH</span>
        <span className="text-[10px] text-amber-300 font-bold tracking-normal cursor-pointer hover:underline">
          View More &rarr;
        </span>
      </div>

      {/* 4 Cards under NEW LAUNCH */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {NEW_LAUNCH_GAMES.map((game) => (
          <div
            key={game.id}
            onClick={() => handleLaunch(game.name)}
            className="group relative rounded-xl overflow-hidden cursor-pointer bg-slate-900 border border-blue-900/60 shadow-md hover:border-amber-400 transition-all hover:scale-[1.02] active:scale-95"
          >
            <div className={`h-28 sm:h-32 bg-gradient-to-br ${game.color} p-3 flex flex-col justify-between relative overflow-hidden`}>
              <div className="absolute right-1 bottom-1 opacity-25 text-5xl select-none pointer-events-none group-hover:scale-110 transition-transform">
                {game.image}
              </div>

              <div className="flex justify-between items-start z-10">
                <span className="px-1.5 py-0.5 rounded text-[8px] font-black tracking-wider uppercase bg-black/70 text-amber-300 border border-amber-400/40">
                  {game.tag}
                </span>
                <span className="w-6 h-6 rounded-full bg-black/50 flex items-center justify-center text-white group-hover:bg-[#ffde00] group-hover:text-slate-950 transition-colors">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </span>
              </div>

              <div className="z-10 mt-auto">
                <div className="text-sm font-black font-['Chakra_Petch'] text-white tracking-wide drop-shadow-md uppercase">
                  {game.name}
                </div>
                <div className="text-[10px] text-white/80 font-medium">
                  {game.subtitle}
                </div>
              </div>
            </div>

            <div className="px-2 py-1 bg-[#001738] flex items-center justify-between text-[9px] text-blue-200">
              <span>BROTHER EXCLUSIVE</span>
              <span className="text-emerald-400 font-bold">INSTANT</span>
            </div>
          </div>
        ))}
      </div>

      {/* Game launch simulation notification */}
      {activeGame && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl bg-slate-900/95 border border-amber-400 text-amber-300 shadow-2xl flex items-center gap-3 text-xs font-bold animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Opening {activeGame} table for @{user.username}... Connecting to live feed.</span>
        </div>
      )}
    </div>
  );
};

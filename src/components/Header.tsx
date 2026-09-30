import React from 'react';
import { HelpCircle, BarChart2 } from 'lucide-react';

interface HeaderProps {
  remainingGuesses: number;
  score: number;
  onOpenHelp: () => void;
  onOpenStats: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  remainingGuesses,
  score,
  onOpenHelp,
  onOpenStats,
}) => {
  return (
    <header className="border-b border-[#2a2d3d] bg-[#15171e]/80 backdrop-blur sticky top-0 z-20">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#af8949]/20 border border-[#af8949]/60 flex items-center justify-center font-bold text-[#d4b26f] text-lg shadow-sm">
            P
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider text-white uppercase flex items-center gap-2">
              PoE<span className="text-[#d4b26f]">Doku</span>
            </h1>
            <p className="text-xs text-neutral-400 hidden sm:block">
              Daily Path of Exile Skill Gem Puzzle
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-[#1b1d26] border border-[#2a2d3d] text-sm">
            <span className="text-neutral-400">Score:</span>
            <span className="font-semibold text-[#d4b26f]">{score}/9</span>
            <span className="text-neutral-600">|</span>
            <span className="text-neutral-400">Guesses:</span>
            <span
              className={`font-semibold ${
                remainingGuesses <= 2
                  ? 'text-red-400'
                  : remainingGuesses <= 5
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {remainingGuesses}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onOpenHelp}
              title="How to Play"
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1b1d26] transition"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button
              onClick={onOpenStats}
              title="Statistics"
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1b1d26] transition"
            >
              <BarChart2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

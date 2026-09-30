import React from 'react';
import { PlayerStats } from '../types/game';
import { X, Award, Flame, CheckCircle, Hash } from 'lucide-react';

interface StatsModalProps {
  isOpen: boolean;
  stats: PlayerStats;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, stats, onClose }) => {
  if (!isOpen) return null;

  const winRate =
    stats.gamesPlayed > 0
      ? Math.round((stats.perfectGames / stats.gamesPlayed) * 100)
      : 0;

  const maxFreq = Math.max(1, ...Object.values(stats.scoreDistribution));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-md bg-[#15171e] border border-[#2a2d3d] rounded-xl shadow-2xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1b1d26] transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold text-white text-center mb-6 uppercase tracking-wider">
          Player Statistics
        </h2>

        {/* High-level stats counters */}
        <div className="grid grid-cols-4 gap-2 mb-6 text-center">
          <div className="p-3 bg-[#111318] border border-[#2a2d3d] rounded-lg">
            <Hash className="w-4 h-4 mx-auto text-neutral-400 mb-1" />
            <div className="text-xl font-bold text-white">{stats.gamesPlayed}</div>
            <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Played</div>
          </div>

          <div className="p-3 bg-[#111318] border border-[#2a2d3d] rounded-lg">
            <CheckCircle className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
            <div className="text-xl font-bold text-white">{winRate}%</div>
            <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Flawless</div>
          </div>

          <div className="p-3 bg-[#111318] border border-[#2a2d3d] rounded-lg">
            <Flame className="w-4 h-4 mx-auto text-orange-400 mb-1" />
            <div className="text-xl font-bold text-white">{stats.currentStreak}</div>
            <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Streak</div>
          </div>

          <div className="p-3 bg-[#111318] border border-[#2a2d3d] rounded-lg">
            <Award className="w-4 h-4 mx-auto text-[#d4b26f] mb-1" />
            <div className="text-xl font-bold text-white">{stats.maxStreak}</div>
            <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Max</div>
          </div>
        </div>

        {/* Score Distribution Chart */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
            Score Distribution (0 - 9)
          </h3>
          <div className="space-y-1.5 text-xs font-mono">
            {[9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map((score) => {
              const count = stats.scoreDistribution[score] || 0;
              const pct = (count / maxFreq) * 100;

              return (
                <div key={score} className="flex items-center gap-2">
                  <span className="w-3 text-right text-neutral-400 font-bold">{score}</span>
                  <div className="flex-1 bg-[#111318] rounded h-4 overflow-hidden flex items-center">
                    <div
                      style={{ width: `${Math.max(pct, count > 0 ? 8 : 0)}%` }}
                      className={`h-full transition-all duration-500 rounded flex items-center justify-end px-1.5 ${
                        score === 9
                          ? 'bg-[#af8949] text-black font-bold'
                          : count > 0
                          ? 'bg-[#2a2d3d] text-white'
                          : 'bg-transparent text-neutral-600'
                      }`}
                    >
                      {count > 0 && <span className="text-[10px]">{count}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

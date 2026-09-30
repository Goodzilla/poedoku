import React from 'react';
import { X, Sparkles, Check, AlertTriangle } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-md bg-[#15171e] border border-[#2a2d3d] rounded-xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1b1d26] transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-[#d4b26f]" />
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">
            How to Play PoEDoku
          </h2>
        </div>

        <div className="space-y-4 text-sm text-neutral-300 leading-relaxed">
          <p>
            PoEDoku is a daily trivia game for Path of Exile 1 players. Test your game knowledge by
            finding active skill gems that match both row and column criteria.
          </p>

          <div className="space-y-2.5">
            <div className="flex items-start gap-3 p-3 bg-[#111318] rounded-lg border border-[#2a2d3d]">
              <div className="w-6 h-6 rounded-full bg-[#af8949]/20 text-[#d4b26f] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                1
              </div>
              <div>
                <strong className="text-white block font-medium">Match Both Criteria</strong>
                Select an active skill gem that satisfies both the horizontal (row) and vertical
                (column) tags.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-[#111318] rounded-lg border border-[#2a2d3d]">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <div>
                <strong className="text-white block font-medium">9 Guesses Total</strong>
                You have exactly 9 guesses for the 9 cells. Every guess counts, even wrong ones. Can
                you achieve a flawless 9/9?
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-[#111318] rounded-lg border border-[#2a2d3d]">
              <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <div>
                <strong className="text-white block font-medium">No Duplicates</strong>
                A skill gem can only be used once per grid, even if it fits multiple intersections.
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#1b1d26] rounded-lg border border-[#2a2d3d] text-xs text-neutral-400">
            💡 <strong className="text-neutral-200">Daily Reset:</strong> A new PoEDoku puzzle is
            generated every day at midnight (00:00 UTC) and is identical for all players worldwide.
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 rounded-lg bg-[#af8949] hover:bg-[#d4b26f] text-black font-semibold text-sm transition"
        >
          Got it, let&apos;s play!
        </button>
      </div>
    </div>
  );
};

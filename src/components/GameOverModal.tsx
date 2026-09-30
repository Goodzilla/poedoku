import React, { useState, useEffect } from 'react';
import { GameState } from '../types/game';
import { generateShareText, copyToClipboard } from '../utils/share';
import { Trophy, Share2, Check, Clock, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GameOverModalProps {
  isOpen: boolean;
  gameState: GameState;
  onClose: () => void;
  onOpenStats: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  gameState,
  onClose,
  onOpenStats,
}) => {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (isOpen && gameState.score === 9) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [isOpen, gameState.score]);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0)
      );
      const diffMs = tomorrow.getTime() - now.getTime();

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeLeft(
        `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  const handleShare = async () => {
    const text = generateShareText(gameState);
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const isPerfect = gameState.score === 9;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-md bg-[#15171e] border border-[#2a2d3d] rounded-xl shadow-2xl p-6 text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1b1d26] transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 mx-auto rounded-full bg-[#af8949]/20 border border-[#af8949]/50 flex items-center justify-center text-[#d4b26f] mb-4">
          <Trophy className="w-7 h-7" />
        </div>

        <h2 className="text-xl font-bold text-white mb-1">
          {isPerfect ? 'Flawless Victory!' : 'Daily Completed!'}
        </h2>
        <p className="text-sm text-neutral-400 mb-6">
          You got <span className="font-semibold text-[#d4b26f] text-base">{gameState.score}/9</span> gems correct.
        </p>

        {/* Emoji Matrix Preview */}
        <div className="bg-[#0c0d10] border border-[#2a2d3d] rounded-lg p-3 inline-block mb-6 font-mono text-xl tracking-widest leading-relaxed">
          {gameState.guesses.map((row, r) => (
            <div key={r}>
              {row.map((cell) => (cell && cell.isCorrect ? '🟩' : '🟥'))}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleShare}
            className="w-full py-3 px-4 rounded-lg bg-[#af8949] hover:bg-[#d4b26f] text-black font-semibold text-sm flex items-center justify-center gap-2 transition shadow-lg"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" /> Copied to Clipboard!
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" /> Share Result
              </>
            )}
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenStats();
            }}
            className="w-full py-2.5 px-4 rounded-lg bg-[#1b1d26] hover:bg-[#222531] border border-[#2a2d3d] text-neutral-200 text-sm font-medium transition"
          >
            View Player Statistics
          </button>
        </div>

        {/* Next Daily Timer */}
        <div className="mt-6 pt-4 border-t border-[#2a2d3d] flex items-center justify-center gap-2 text-xs text-neutral-400">
          <Clock className="w-4 h-4 text-neutral-500" />
          <span>Next puzzle in</span>
          <span className="font-mono text-white font-medium">{timeLeft}</span>
        </div>
      </div>
    </div>
  );
};

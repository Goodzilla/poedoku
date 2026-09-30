import React from 'react';
import { CellAnswer } from '../types/game';
import { Check, X } from 'lucide-react';

interface CellProps {
  row: number;
  col: number;
  answer: CellAnswer | null;
  disabled: boolean;
  onClick: () => void;
}

export const Cell: React.FC<CellProps> = ({
  answer,
  disabled,
  onClick,
}) => {
  if (answer) {
    const isSuccess = answer.isCorrect;
    return (
      <div
        className={`relative aspect-square rounded-lg border p-2 flex flex-col items-center justify-center text-center transition overflow-hidden shadow-inner ${
          isSuccess
            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
            : 'bg-red-950/30 border-red-500/40 text-red-300'
        }`}
      >
        {answer.gemIcon ? (
          <img
            src={answer.gemIcon}
            alt={answer.gemName}
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain drop-shadow mb-1"
            onError={(e) => {
              // Hide image if broken link
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : null}

        <span className="text-xs sm:text-sm font-semibold line-clamp-2 px-1">
          {answer.gemName}
        </span>

        <div
          className={`absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center ${
            isSuccess ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
          }`}
        >
          {isSuccess ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`aspect-square rounded-lg border border-[#2a2d3d] bg-[#15171e] hover:bg-[#1f222e] hover:border-[#af8949]/50 transition flex items-center justify-center text-neutral-400 hover:text-white group focus:outline-none focus:ring-2 focus:ring-[#af8949]/40 ${
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:shadow-lg'
      }`}
    >
      <div className="w-8 h-8 rounded-full border border-dashed border-neutral-600 group-hover:border-[#d4b26f] flex items-center justify-center text-xs font-medium text-neutral-500 group-hover:text-[#d4b26f] transition">
        ?
      </div>
    </button>
  );
};

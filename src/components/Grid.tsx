import React from 'react';
import { Criterion, DailyGrid, GameState } from '../types/game';
import { Cell } from './Cell';

interface GridProps {
  grid: DailyGrid;
  gameState: GameState;
  onCellClick: (row: number, col: number) => void;
}

function getCriterionColorClass(criterion: Criterion): string {
  switch (criterion.id) {
    case 'color_red':
      return 'border-red-500/40 text-red-400 bg-red-950/20';
    case 'color_green':
      return 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20';
    case 'color_blue':
      return 'border-blue-500/40 text-blue-400 bg-blue-950/20';
    case 'elem_fire':
      return 'border-orange-500/40 text-orange-400 bg-orange-950/20';
    case 'elem_cold':
      return 'border-cyan-500/40 text-cyan-400 bg-cyan-950/20';
    case 'elem_lightning':
      return 'border-yellow-500/40 text-yellow-300 bg-yellow-950/20';
    case 'elem_chaos':
      return 'border-purple-500/40 text-purple-400 bg-purple-950/20';
    case 'prop_vaal':
      return 'border-rose-500/40 text-rose-400 bg-rose-950/20';
    case 'prop_transfigured':
      return 'border-amber-500/40 text-amber-400 bg-amber-950/20';
    default:
      return 'border-[#2a2d3d] text-neutral-300 bg-[#15171e]';
  }
}

export const Grid: React.FC<GridProps> = ({ grid, gameState, onCellClick }) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-2 sm:p-4 select-none">
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {/* Top-Left Corner Cell */}
        <div className="aspect-square rounded-lg border border-[#2a2d3d] bg-[#111318] p-2 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-mono">
            Daily
          </span>
          <span className="text-xs sm:text-sm font-semibold text-[#af8949]">
            {grid.date.slice(5)}
          </span>
        </div>

        {/* Column Headers (X-Axis) */}
        {grid.colCriteria.map((col, idx) => (
          <div
            key={col.id + idx}
            title={col.description}
            className={`aspect-square rounded-lg border p-2 flex flex-col items-center justify-center text-center transition shadow-sm ${getCriterionColorClass(
              col
            )}`}
          >
            <span className="text-[10px] uppercase tracking-wider opacity-60 font-mono mb-1">
              Col {idx + 1}
            </span>
            <span className="text-xs sm:text-sm font-bold leading-tight">
              {col.shortName || col.name}
            </span>
          </div>
        ))}

        {/* Rows (Y-Axis Header + 3 Cells per Row) */}
        {grid.rowCriteria.map((row, rIdx) => (
          <React.Fragment key={row.id + rIdx}>
            {/* Row Header */}
            <div
              title={row.description}
              className={`aspect-square rounded-lg border p-2 flex flex-col items-center justify-center text-center transition shadow-sm ${getCriterionColorClass(
                row
              )}`}
            >
              <span className="text-[10px] uppercase tracking-wider opacity-60 font-mono mb-1">
                Row {rIdx + 1}
              </span>
              <span className="text-xs sm:text-sm font-bold leading-tight">
                {row.shortName || row.name}
              </span>
            </div>

            {/* 3 Cells */}
            {[0, 1, 2].map((cIdx) => {
              const answer = gameState.guesses[rIdx][cIdx];
              const isFilled = answer !== null;
              const disabled = isFilled || gameState.remainingGuesses <= 0 || gameState.isCompleted;

              return (
                <Cell
                  key={`cell-${rIdx}-${cIdx}`}
                  row={rIdx}
                  col={cIdx}
                  answer={answer}
                  disabled={disabled}
                  onClick={() => onCellClick(rIdx, cIdx)}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

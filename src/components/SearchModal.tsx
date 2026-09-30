import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Criterion } from '../types/game';
import { SkillGem } from '../types/gem';
import { Search, X, AlertCircle } from 'lucide-react';
import gemsData from '../data/gems.json';

const allGems = gemsData as SkillGem[];

interface SearchModalProps {
  isOpen: boolean;
  rowCriterion: Criterion | null;
  colCriterion: Criterion | null;
  usedGemIds: string[];
  onSelectGem: (gem: SkillGem) => void;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  rowCriterion,
  colCriterion,
  usedGemIds,
  onSelectGem,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredGems = useMemo(() => {
    if (!query.trim()) {
      return allGems.slice(0, 40); // Show initial sample
    }
    const q = query.toLowerCase().trim();
    return allGems
      .filter((gem) => gem.name.toLowerCase().includes(q))
      .slice(0, 50);
  }, [query]);

  if (!isOpen || !rowCriterion || !colCriterion) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-lg bg-[#15171e] border border-[#2a2d3d] rounded-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#2a2d3d] flex items-center justify-between bg-[#111318]">
          <div>
            <h2 className="text-sm font-semibold text-neutral-300">Select a Skill Gem</h2>
            <div className="flex items-center gap-2 mt-1 text-xs">
              <span className="px-2 py-0.5 rounded bg-[#1b1d26] border border-[#2a2d3d] text-[#d4b26f] font-medium">
                {rowCriterion.name}
              </span>
              <span className="text-neutral-500 font-bold">+</span>
              <span className="px-2 py-0.5 rounded bg-[#1b1d26] border border-[#2a2d3d] text-[#d4b26f] font-medium">
                {colCriterion.name}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1b1d26] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-[#2a2d3d]">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search skill gem (e.g. Arc, Cyclone, Fireball)..."
              className="w-full pl-10 pr-4 py-2 bg-[#0c0d10] border border-[#2a2d3d] rounded-lg text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#af8949] focus:ring-1 focus:ring-[#af8949]"
            />
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-[#1e212b]">
          {filteredGems.length === 0 ? (
            <div className="p-8 text-center text-neutral-400 text-sm flex flex-col items-center">
              <AlertCircle className="w-8 h-8 text-neutral-600 mb-2" />
              <span>No skill gem found matching &quot;{query}&quot;</span>
            </div>
          ) : (
            filteredGems.map((gem) => {
              const isUsed = usedGemIds.includes(gem.id);
              const colorDot =
                gem.color === 'red'
                  ? 'bg-red-500'
                  : gem.color === 'green'
                  ? 'bg-emerald-500'
                  : gem.color === 'blue'
                  ? 'bg-blue-500'
                  : 'bg-neutral-400';

              return (
                <button
                  key={gem.id}
                  disabled={isUsed}
                  onClick={() => onSelectGem(gem)}
                  className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between transition ${
                    isUsed
                      ? 'opacity-40 cursor-not-allowed bg-transparent'
                      : 'hover:bg-[#1b1d26] cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {gem.icon ? (
                      <img
                        src={gem.icon}
                        alt={gem.name}
                        className="w-8 h-8 object-contain shrink-0"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded bg-[#1b1d26] border border-[#2a2d3d] flex items-center justify-center shrink-0">
                        <span className={`w-2.5 h-2.5 rounded-full ${colorDot}`} />
                      </div>
                    )}

                    <div className="truncate flex items-center gap-2">
                      <span className="font-semibold text-sm text-neutral-200 truncate">
                        {gem.name}
                      </span>
                      {gem.isVaal && (
                        <span className="px-1.5 py-0.2 text-[10px] uppercase font-bold rounded bg-rose-950/60 text-rose-300 border border-rose-800/40">
                          Vaal
                        </span>
                      )}
                      {gem.isTransfigured && (
                        <span className="px-1.5 py-0.2 text-[10px] uppercase font-bold rounded bg-amber-950/60 text-amber-300 border border-amber-800/40">
                          Transfigured
                        </span>
                      )}
                    </div>
                  </div>

                  {isUsed && (
                    <span className="text-[11px] text-neutral-500 bg-[#1b1d26] px-2 py-0.5 rounded border border-[#2a2d3d] shrink-0 ml-2">
                      Already Used
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

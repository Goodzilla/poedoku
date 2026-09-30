import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Grid } from './components/Grid';
import { SearchModal } from './components/SearchModal';
import { GameOverModal } from './components/GameOverModal';
import { StatsModal } from './components/StatsModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { generateDailyGrid, getTodayUtcString } from './utils/daily';
import {
  loadSavedGameState,
  saveGameState,
  loadPlayerStats,
  updatePlayerStatsOnGameEnd,
} from './utils/storage';
import { gemMatchesCriteria } from './utils/criteria';
import { GameState, CellAnswer } from './types/game';
import { SkillGem } from './types/gem';

export function App() {
  const today = useMemo(() => getTodayUtcString(), []);
  const dailyGrid = useMemo(() => generateDailyGrid(today), [today]);

  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = loadSavedGameState(today);
    if (saved) return saved;

    return {
      date: today,
      guesses: [
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ],
      remainingGuesses: 9,
      usedGemIds: [],
      isCompleted: false,
      score: 0,
    };
  });

  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isGameOverOpen, setIsGameOverOpen] = useState(false);
  const [stats, setStats] = useState(() => loadPlayerStats());

  // Show how to play modal on first visit ever
  useEffect(() => {
    const hasVisited = localStorage.getItem('poedoku_visited');
    if (!hasVisited) {
      setIsHelpOpen(true);
      localStorage.setItem('poedoku_visited', 'true');
    }
  }, []);

  // Save game state whenever it changes
  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  // When game completes, update stats and trigger game over modal
  const handleGameCompletion = (finalState: GameState) => {
    const updatedStats = updatePlayerStatsOnGameEnd(finalState);
    setStats(updatedStats);
    setTimeout(() => {
      setIsGameOverOpen(true);
    }, 600);
  };

  const handleCellClick = (row: number, col: number) => {
    if (gameState.isCompleted || gameState.remainingGuesses <= 0) return;
    if (gameState.guesses[row][col] !== null) return;
    setSelectedCell({ row, col });
  };

  const handleSelectGem = (gem: SkillGem) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;

    const rowCrit = dailyGrid.rowCriteria[row];
    const colCrit = dailyGrid.colCriteria[col];

    const isCorrect = gemMatchesCriteria(gem, rowCrit, colCrit);

    const answer: CellAnswer = {
      gemId: gem.id,
      gemName: gem.name,
      gemIcon: gem.icon,
      isCorrect,
    };

    const newGuesses = gameState.guesses.map((r, rIdx) =>
      r.map((cell, cIdx) => (rIdx === row && cIdx === col ? answer : cell))
    );

    const newRemaining = gameState.remainingGuesses - 1;
    const newScore = gameState.score + (isCorrect ? 1 : 0);
    const newUsedGems = [...gameState.usedGemIds, gem.id];

    // Check if finished (9 guesses used OR 9 cells filled)
    const filledCount = newGuesses.flat().filter(Boolean).length;
    const isFinished = newRemaining <= 0 || filledCount === 9;

    const nextState: GameState = {
      ...gameState,
      guesses: newGuesses,
      remainingGuesses: newRemaining,
      usedGemIds: newUsedGems,
      score: newScore,
      isCompleted: isFinished,
    };

    setGameState(nextState);
    setSelectedCell(null);

    if (isFinished) {
      handleGameCompletion(nextState);
    }
  };

  const activeRowCriterion = selectedCell ? dailyGrid.rowCriteria[selectedCell.row] : null;
  const activeColCriterion = selectedCell ? dailyGrid.colCriteria[selectedCell.col] : null;

  return (
    <div className="min-h-screen bg-[#0c0d10] text-[#e2e8f0] flex flex-col font-sans">
      <Header
        remainingGuesses={gameState.remainingGuesses}
        score={gameState.score}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
      />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 max-w-4xl mx-auto w-full">
        <div className="w-full text-center mb-4">
          <p className="text-xs uppercase tracking-widest text-[#af8949] font-mono font-semibold">
            Puzzle #{today}
          </p>
          <p className="text-sm text-neutral-400 mt-1">
            Pick a PoE skill gem for each cell matching its row and column tags.
          </p>
        </div>

        <Grid
          grid={dailyGrid}
          gameState={gameState}
          onCellClick={handleCellClick}
        />

        {gameState.isCompleted && (
          <div className="mt-4 animate-fadeIn">
            <button
              onClick={() => setIsGameOverOpen(true)}
              className="px-5 py-2.5 rounded-lg bg-[#af8949] hover:bg-[#d4b26f] text-black font-semibold text-sm transition shadow-lg"
            >
              View Game Results & Share
            </button>
          </div>
        )}
      </main>

      <footer className="border-t border-[#2a2d3d] bg-[#111318] py-4 px-4 text-center text-xs text-neutral-500">
        <p>
          PoEDoku is a fan-made project. Path of Exile is a registered trademark of Grinding Gear Games.
        </p>
      </footer>

      {/* Modals */}
      <SearchModal
        isOpen={selectedCell !== null}
        rowCriterion={activeRowCriterion}
        colCriterion={activeColCriterion}
        usedGemIds={gameState.usedGemIds}
        onSelectGem={handleSelectGem}
        onClose={() => setSelectedCell(null)}
      />

      <GameOverModal
        isOpen={isGameOverOpen}
        gameState={gameState}
        onClose={() => setIsGameOverOpen(false)}
        onOpenStats={() => setIsStatsOpen(true)}
      />

      <StatsModal
        isOpen={isStatsOpen}
        stats={stats}
        onClose={() => setIsStatsOpen(false)}
      />

      <HowToPlayModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}

export default App;

import { GameState, PlayerStats } from '../types/game';

const GAME_PREFIX = 'poedoku_state_';
const STATS_KEY = 'poedoku_player_stats';

const DEFAULT_STATS: PlayerStats = {
  gamesPlayed: 0,
  gamesCompleted: 0,
  perfectGames: 0,
  currentStreak: 0,
  maxStreak: 0,
  scoreDistribution: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
  lastPlayedDate: '',
};

export function loadSavedGameState(date: string): GameState | null {
  try {
    const raw = localStorage.getItem(`${GAME_PREFIX}${date}`);
    if (!raw) return null;
    return JSON.parse(raw) as GameState;
  } catch (e) {
    console.error('Error loading saved game state:', e);
    return null;
  }
}

export function saveGameState(state: GameState): void {
  try {
    localStorage.setItem(`${GAME_PREFIX}${state.date}`, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving game state:', e);
  }
}

export function loadPlayerStats(): PlayerStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return DEFAULT_STATS;
    const parsed = JSON.parse(raw) as PlayerStats;
    return { ...DEFAULT_STATS, ...parsed };
  } catch (e) {
    console.error('Error loading stats:', e);
    return DEFAULT_STATS;
  }
}

export function updatePlayerStatsOnGameEnd(state: GameState): PlayerStats {
  const stats = loadPlayerStats();

  // Prevent double counting if already finished for this date
  if (stats.lastPlayedDate === state.date) {
    return stats;
  }

  const score = state.score;
  const isPerfect = score === 9;

  // Streak calculation
  let newCurrentStreak = stats.currentStreak;
  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const yStr = `${yesterday.getUTCFullYear()}-${String(yesterday.getUTCMonth() + 1).padStart(2, '0')}-${String(yesterday.getUTCDate()).padStart(2, '0')}`;

  if (stats.lastPlayedDate === yStr) {
    newCurrentStreak += 1;
  } else {
    newCurrentStreak = 1;
  }

  const newMaxStreak = Math.max(stats.maxStreak, newCurrentStreak);
  const newDistribution = {
    ...stats.scoreDistribution,
    [score]: (stats.scoreDistribution[score] || 0) + 1,
  };

  const updated: PlayerStats = {
    gamesPlayed: stats.gamesPlayed + 1,
    gamesCompleted: stats.gamesCompleted + 1,
    perfectGames: stats.perfectGames + (isPerfect ? 1 : 0),
    currentStreak: newCurrentStreak,
    maxStreak: newMaxStreak,
    scoreDistribution: newDistribution,
    lastPlayedDate: state.date,
  };

  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error updating player stats:', e);
  }

  return updated;
}

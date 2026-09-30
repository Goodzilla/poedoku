import { SkillGem } from './gem';

export type CriterionType =
  | 'attribute'
  | 'element'
  | 'skill_type'
  | 'delivery'
  | 'mechanic'
  | 'property';

export interface Criterion {
  id: string;
  name: string; // User-facing label (e.g., "Spell", "Fire", "Red Gem", "Bow")
  shortName?: string;
  type: CriterionType;
  description: string;
  matches: (gem: SkillGem) => boolean;
}

export interface CellAnswer {
  gemId: string;
  gemName: string;
  gemIcon: string;
  isCorrect: boolean;
}

export interface DailyGrid {
  date: string; // YYYY-MM-DD
  rowCriteria: Criterion[];
  colCriteria: Criterion[];
  validCountPerCell: number[][]; // 3x3 matrix showing valid solution count
}

export interface GameState {
  date: string;
  guesses: (CellAnswer | null)[][]; // 3x3
  remainingGuesses: number; // starts at 9
  usedGemIds: string[]; // Gem IDs already picked (each gem can only be used once)
  isCompleted: boolean;
  score: number; // 0 to 9 correct answers
}

export interface PlayerStats {
  gamesPlayed: number;
  gamesCompleted: number;
  perfectGames: number; // 9/9
  currentStreak: number;
  maxStreak: number;
  scoreDistribution: Record<number, number>; // score (0-9) -> count
  lastPlayedDate: string;
}

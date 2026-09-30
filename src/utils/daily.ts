import { Criterion, DailyGrid } from '../types/game';
import { SkillGem } from '../types/gem';
import { ALL_CRITERIA, getMatchingGems } from './criteria';
import gemsData from '../data/gems.json';

const gems = gemsData as SkillGem[];

/**
 * Returns today's date formatted as YYYY-MM-DD in UTC.
 */
export function getTodayUtcString(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Simple 32-bit hash of a string (Murmur-like / sdbm).
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Seeded PRNG using Mulberry32 algorithm.
 */
function createPrng(seed: number) {
  let s = seed | 0;
  return function next(): number {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Shuffle an array deterministically with PRNG.
 */
function shuffle<T>(array: T[], prng: () => number): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Checks whether a candidate 3x3 grid of criteria is valid and solvable.
 * Every cell must have at least minMatches gems available.
 */
function evaluateGrid(
  rows: Criterion[],
  cols: Criterion[],
  minMatchesPerCell = 1
): { valid: boolean; matrix: number[][] } {
  const matrix: number[][] = [];

  for (let r = 0; r < 3; r++) {
    matrix[r] = [];
    for (let c = 0; c < 3; c++) {
      // Reject if criteria are identical or of same exclusive type when incompatible
      if (rows[r].id === cols[c].id) {
        return { valid: false, matrix: [] };
      }

      // Check mutually exclusive types on orthogonal axes (e.g. Spell vs Attack)
      if (
        (rows[r].id === 'type_spell' && cols[c].id === 'type_attack') ||
        (rows[r].id === 'type_attack' && cols[c].id === 'type_spell')
      ) {
        return { valid: false, matrix: [] };
      }

      const matching = getMatchingGems(gems, rows[r], cols[c]);
      if (matching.length < minMatchesPerCell) {
        return { valid: false, matrix: [] };
      }
      matrix[r][c] = matching.length;
    }
  }

  return { valid: true, matrix };
}

/**
 * Generate a deterministic daily grid for a given date string.
 */
export function generateDailyGrid(dateString: string = getTodayUtcString()): DailyGrid {
  const baseSeed = hashString(`poedoku-daily-${dateString}`);
  let attempt = 0;

  while (attempt < 500) {
    const prng = createPrng(baseSeed + attempt * 997);
    const shuffled = shuffle(ALL_CRITERIA, prng);

    // Pick 3 criteria for rows and 3 different criteria for columns
    const rows = shuffled.slice(0, 3);
    const cols = shuffled.slice(3, 6);

    const { valid, matrix } = evaluateGrid(rows, cols, 1);
    if (valid) {
      return {
        date: dateString,
        rowCriteria: rows,
        colCriteria: cols,
        validCountPerCell: matrix,
      };
    }

    attempt++;
  }

  // Fallback to guaranteed valid criteria if random attempts exhausted
  const fallbackRows = [
    ALL_CRITERIA.find((c) => c.id === 'color_red')!,
    ALL_CRITERIA.find((c) => c.id === 'color_green')!,
    ALL_CRITERIA.find((c) => c.id === 'color_blue')!,
  ];
  const fallbackCols = [
    ALL_CRITERIA.find((c) => c.id === 'type_attack')!,
    ALL_CRITERIA.find((c) => c.id === 'type_spell')!,
    ALL_CRITERIA.find((c) => c.id === 'elem_fire')!,
  ];

  const matrix = fallbackRows.map((r) =>
    fallbackCols.map((c) => getMatchingGems(gems, r, c).length)
  );

  return {
    date: dateString,
    rowCriteria: fallbackRows,
    colCriteria: fallbackCols,
    validCountPerCell: matrix,
  };
}

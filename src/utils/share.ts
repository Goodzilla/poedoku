import { GameState } from '../types/game';

/**
 * Generates the Wordle/Pokedoku-style emoji grid string.
 */
export function generateShareText(state: GameState): string {
  const dateFormatted = state.date;
  const score = state.score;

  let gridEmojis = '';
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const cell = state.guesses[r][c];
      if (cell && cell.isCorrect) {
        gridEmojis += '🟩';
      } else {
        gridEmojis += '🟥';
      }
    }
    gridEmojis += '\n';
  }

  return `PoEDoku #${dateFormatted}
Score: ${score}/9 ${score === 9 ? '👑' : '🎯'}

${gridEmojis.trim()}

https://poedoku.vercel.app`;
}

/**
 * Copies the share text to the user's clipboard.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}

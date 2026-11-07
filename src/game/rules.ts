import { TeamId } from '../types/game';

/**
 * Calculates new team score ensuring no NaN and optional non-negative constraint
 */
export function calculateTeamScore(currentScore: number, delta: number, allowNegative = false): number {
  const safeCurrent = isNaN(currentScore) ? 0 : currentScore;
  const safeDelta = isNaN(delta) ? 0 : delta;
  const newScore = safeCurrent + safeDelta;
  return allowNegative ? newScore : Math.max(0, newScore);
}

/**
 * Validates if the user's placed letters correctly spell the target word
 */
export function checkWordScramble(placedLetters: string[], targetWord: string): boolean {
  if (!placedLetters || !targetWord) return false;
  const formed = placedLetters.join('').trim().toUpperCase();
  const target = targetWord.trim().toUpperCase();
  return formed.length === target.length && formed === target;
}

/**
 * Deterministically shuffles word characters into an array of letters
 * Ensures the shuffled version does not accidentally equal the solved word (when length > 2)
 */
export function shuffleWord(word: string, seed?: number): string[] {
  const letters = word.toUpperCase().split('');
  if (letters.length <= 2) {
    return letters.slice().reverse();
  }

  const arr = letters.slice();
  // Fisher-Yates shuffle
  let rng = seed !== undefined ? seed : 42;
  const pseudoRandom = () => {
    rng = (rng * 9301 + 49297) % 233280;
    return rng / 233280;
  };

  const randFn = seed !== undefined ? pseudoRandom : Math.random;

  for (let attempt = 0; attempt < 5; attempt++) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(randFn() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    // If not identical to original word, return
    if (arr.join('') !== letters.join('')) {
      return arr;
    }
  }

  // Fallback: rotate by 1
  return [arr[arr.length - 1], ...arr.slice(0, arr.length - 1)];
}

/**
 * Calculates points for Mystery Picture Reveal based on how few tiles were uncovered
 * (Fewer tiles uncovered = higher score for sharp thinking!)
 */
export function calculateMysteryPoints(
  totalTiles: number,
  revealedCount: number,
  maxPoints = 50,
  minPoints = 10
): number {
  if (totalTiles <= 0) return minPoints;
  const clampedRevealed = Math.min(totalTiles, Math.max(0, revealedCount));
  const hiddenRatio = (totalTiles - clampedRevealed) / totalTiles;
  const points = Math.round(minPoints + hiddenRatio * (maxPoints - minPoints));
  // Round to nearest 5 for game show friendly scores
  return Math.max(minPoints, Math.round(points / 5) * 5);
}

/**
 * Evaluates game match outcome
 */
export function determineWinner(scoreA: number, scoreB: number): TeamId | 'tie' {
  if (scoreA > scoreB) return 'teamA';
  if (scoreB > scoreA) return 'teamB';
  return 'tie';
}

/**
 * Formats seconds into mm:ss
 */
export function formatTimer(seconds: number): string {
  const clamped = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

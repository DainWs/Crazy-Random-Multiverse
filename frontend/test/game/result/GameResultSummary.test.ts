import { describe, expect, it } from 'vitest';
import type { GameResult } from '@/core/StoreSystem';
import { summarizeResult } from '@/game/result/GameResultSummary';

describe('summarizeResult', () => {
  const result: GameResult = { winner: { code: 'p2', name: 'Player 2' } as GameResult['winner'] };

  // WIN-4
  it('says victory to the winner', () => {
    expect(summarizeResult(result, 'p2').isVictory).toBe(true);
  });

  // WIN-4
  it('says defeat to a player who did not win', () => {
    expect(summarizeResult(result, 'p1').isVictory).toBe(false);
  });

  // WIN-4
  it('names the winner', () => {
    expect(summarizeResult(result, 'p1').winnerName).toBe('Player 2');
  });

  // WIN-4
  it('is decided once the winner is known', () => {
    expect(summarizeResult(result, 'p1').isDecided).toBe(true);
  });

  // WIN-4
  it('decides nothing before the winner is known', () => {
    expect(summarizeResult({}, 'p2')).toEqual({ isDecided: false, isVictory: false, winnerName: '' });
  });
});

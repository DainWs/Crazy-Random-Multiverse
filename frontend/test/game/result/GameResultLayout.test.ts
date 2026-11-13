import { describe, expect, it } from 'vitest';
import GameResultLayout from '@/game/result/GameResultLayout';
import * as Constants from '@/core/Constants';

describe('GameResultLayout', () => {
  const positions = new GameResultLayout({ width: 1000, height: 800 }).positions();

  it('covers the whole screen with the veil', () => {
    expect(positions.veil).toEqual({ width: 1000, height: 800 });
  });

  // VIEW-23
  it('centers the panel on the three lines of text', () => {
    expect(positions.panel).toEqual({ x: 500, y: 400 + Constants.GAME_RESULT_LINE_GAP / 2, ...Constants.GAME_RESULT_PANEL_SIZE });
  });

  // VIEW-23
  it('makes the panel taller than the span of the three lines', () => {
    const span = positions.countdown.y - positions.title.y;

    expect(positions.panel.height).toBeGreaterThan(span);
  });

  it('centers the title above the middle of the screen', () => {
    expect(positions.title).toEqual({ x: 500, y: 400 - Constants.GAME_RESULT_LINE_GAP });
  });

  it('puts the winner below the middle of the screen', () => {
    expect(positions.winner).toEqual({ x: 500, y: 400 + Constants.GAME_RESULT_LINE_GAP });
  });

  it('puts the countdown below the winner', () => {
    expect(positions.countdown).toEqual({ x: 500, y: 400 + 2 * Constants.GAME_RESULT_LINE_GAP });
  });
});

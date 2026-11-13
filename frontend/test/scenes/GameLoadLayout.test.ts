import { describe, expect, it } from 'vitest';
import GameLoadLayout from '@/scenes/GameLoadLayout';
import * as Constants from '@/core/Constants';

// VIEW-29
describe('GameLoadLayout', () => {
  const layout = new GameLoadLayout({ width: 1000, height: 800 });

  it('centers the bar on the window', () => {
    expect(layout.barFrame()).toEqual({ x: 500, y: 400 + Constants.LOAD_BAR_OFFSET_Y, ...Constants.LOAD_BAR_SIZE });
  });

  it('places the panel so it holds the bar, the status and the retry button', () => {
    const panel = layout.panel();
    const retryBottom = layout.retryButton().y + Constants.HUD_BUTTON_PADDING.y * 2 + 24;

    expect(panel.y - panel.height / 2).toBeLessThan(layout.barFrame().y - Constants.LOAD_BAR_SIZE.height / 2);
    expect(panel.y + panel.height / 2).toBeGreaterThan(retryBottom);
  });

  it('starts the fill on the left edge of the frame, inside its margin', () => {
    const fill = layout.barFill();
    const frame = layout.barFrame();

    expect(fill.x).toBe(frame.x - frame.width / 2 + Constants.LOAD_BAR_FILL_MARGIN);
    expect(fill.width).toBe(frame.width - Constants.LOAD_BAR_FILL_MARGIN * 2);
  });

  it('puts the status and the retry button below the bar, in that order', () => {
    expect(layout.barFrame().y).toBeLessThan(layout.statusText().y);
    expect(layout.statusText().y).toBeLessThan(layout.retryButton().y);
  });

  it('follows the window when it changes size', () => {
    const wide = new GameLoadLayout({ width: 2000, height: 600 });

    expect(wide.barFrame()).toEqual({ x: 1000, y: 300 + Constants.LOAD_BAR_OFFSET_Y, ...Constants.LOAD_BAR_SIZE });
  });
});

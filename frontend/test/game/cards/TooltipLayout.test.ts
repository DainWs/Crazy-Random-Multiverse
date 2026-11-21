import { describe, expect, it } from 'vitest';
import TooltipLayout from '@/game/cards/tooltip/TooltipLayout';

// VIEW-14
describe('TooltipLayout', () => {
  const layout = new TooltipLayout();

  describe('sideOf', () => {
    it.each([
      { share: 0, side: 'RIGHT' },
      { share: 0.4, side: 'RIGHT' },
      { share: 0.5, side: 'RIGHT' },
      { share: 0.51, side: 'LEFT' },
      { share: 1, side: 'LEFT' }
    ])('is the $side side for a card at $share of the screen', ({ share, side }) => {
      expect(layout.sideOf(share)).toBe(side);
    });
  });

  describe('centerX', () => {
    const SCREEN = 1000;
    const PANEL = 250;

    it('puts the panel on the right edge, sliding in from the right', () => {
      expect([layout.centerX('RIGHT', SCREEN, PANEL, 0), layout.centerX('RIGHT', SCREEN, PANEL, 40)]).toEqual([875, 915]);
    });

    it('puts the panel on the left edge, sliding in from the left', () => {
      expect([layout.centerX('LEFT', SCREEN, PANEL, 0), layout.centerX('LEFT', SCREEN, PANEL, 40)]).toEqual([125, 85]);
    });
  });
});

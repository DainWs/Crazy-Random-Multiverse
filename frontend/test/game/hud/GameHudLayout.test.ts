import { describe, expect, it } from 'vitest';
import GameHudLayout from '@/game/hud/GameHudLayout';
import * as Constants from '@/core/Constants';

describe('GameHudLayout', () => {
  const layout = new GameHudLayout({ width: 1000, height: 800 });

  it('puts the turn text at the top left corner, inside the margin', () => {
    expect(layout.turnTextPosition()).toEqual({ x: Constants.HUD_MARGIN, y: Constants.HUD_MARGIN });
  });

  it('anchors the pass turn button at the bottom right corner, inside the margin', () => {
    const expected = { x: 1000 - Constants.HUD_MARGIN, y: 800 - Constants.HUD_MARGIN };

    expect(layout.passTurnButtonAnchor()).toEqual(expected);
  });

  it('anchors the surrender button above the pass turn button, with a gap', () => {
    const anchor = layout.surrenderButtonAnchor(30);

    const expectedY = 800 - Constants.HUD_MARGIN - 30 - Constants.HUD_BUTTON_GAP;
    expect(anchor).toEqual({ x: 1000 - Constants.HUD_MARGIN, y: expectedY });
  });

  describe('confirmDialog', () => {
    it('covers the whole screen with the veil', () => {
      expect(layout.confirmDialog().veil).toEqual({ width: 1000, height: 800 });
    });

    it('centers the panel on the screen', () => {
      const { panel } = layout.confirmDialog();

      expect([panel.x, panel.y]).toEqual([500, 400]);
    });

    it('puts the question above the buttons', () => {
      const { question, yes } = layout.confirmDialog();

      expect(question.y).toBeLessThan(yes.y);
    });

    it('puts the yes button to the left of the no button, on the same row', () => {
      const { yes, no } = layout.confirmDialog();

      expect([yes.x < no.x, yes.y]).toEqual([true, no.y]);
    });
  });
});

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

  // VIEW-28
  it('anchors the spectator label above the button to leave, with a gap', () => {
    expect(layout.spectatorLabelAnchor(30)).toEqual(layout.surrenderButtonAnchor(30));
  });

  // UI-3
  describe('with the camera zoomed', () => {
    const zoomed = new GameHudLayout({ width: 1000, height: 800 }, 2);

    it('scales every element against the zoom', () => {
      expect(zoomed.scale()).toBe(0.5);
    });

    it('moves a corner towards the center of the screen so the zoom pushes it back to its place', () => {
      // center + (margin - center) / 2
      expect(zoomed.turnTextPosition()).toEqual({ x: 500 - (500 - Constants.HUD_MARGIN) / 2, y: 400 - (400 - Constants.HUD_MARGIN) / 2 });
    });

    it('moves the opposite corner the same way', () => {
      const corner = { x: 1000 - Constants.HUD_MARGIN, y: 800 - Constants.HUD_MARGIN };

      expect(zoomed.passTurnButtonAnchor()).toEqual({ x: 500 + (corner.x - 500) / 2, y: 400 + (corner.y - 400) / 2 });
    });

    it('keeps the gap between the buttons on the screen', () => {
      const gap = zoomed.passTurnButtonAnchor().y - zoomed.surrenderButtonAnchor(30).y;

      expect(gap).toBe((30 + Constants.HUD_BUTTON_GAP) / 2);
    });

    it('places the dialog container so the screen positions inside it land where they are', () => {
      expect(zoomed.dialogTransform()).toEqual({ x: 250, y: 200, scale: 0.5 });
    });

    it('does not move anything at zoom 1', () => {
      expect(layout.dialogTransform()).toEqual({ x: 0, y: 0, scale: 1 });
    });
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

import { describe, expect, it } from 'vitest';
import * as Constants from '@/core/Constants';
import ZoneLabelLayout from '@/game/zone/ZoneLabelLayout';

// VIEW-49, VIEW-50, VIEW-51
describe('ZoneLabelLayout', () => {
  const layout = new ZoneLabelLayout();
  /** A zone 100 wide and 60 tall, centered at (500, 300). */
  const BOUNDS = { min: { x: 450, y: 270 }, max: { x: 550, y: 330 } };
  const BAR_START = Constants.ZONE_BAR_GAP;
  const BAR_END = Constants.ZONE_BAR_GAP + Constants.ZONE_BAR_THICKNESS;
  const NAME_START = BAR_END + Constants.ZONE_NAME_GAP;

  describe('boundsOf', () => {
    it('holds every point', () => {
      const bounds = layout.boundsOf([{ x: 10, y: 40 }, { x: -5, y: 20 }, { x: 30, y: 60 }]);

      expect(bounds).toEqual({ min: { x: -5, y: 20 }, max: { x: 30, y: 60 } });
    });
  });

  describe('bar', () => {
    it('is as long as the edge of the zone and horizontal below the zone', () => {
      const { center, size } = layout.bar(BOUNDS, 'BOTTOM', 1);

      expect([size.width, size.height, center.x]).toEqual([100, Constants.ZONE_BAR_THICKNESS, 500]);
      expect(center.y - size.height / 2).toBe(330 + BAR_START);
    });

    it('is above the zone on the top side, with its far edge at the gap from the zone', () => {
      const { center, size } = layout.bar(BOUNDS, 'TOP', 1);

      expect(center.y + size.height / 2).toBe(270 - BAR_START);
    });

    it('is vertical, as long as the height of the zone, on the left side', () => {
      const { center, size } = layout.bar(BOUNDS, 'LEFT', 1);

      expect([size.width, size.height, center.y]).toEqual([Constants.ZONE_BAR_THICKNESS, 60, 300]);
      expect(center.x + size.width / 2).toBe(450 - BAR_START);
    });

    it('is vertical on the right side', () => {
      const { center, size } = layout.bar(BOUNDS, 'RIGHT', 1);

      expect(center.x - size.width / 2).toBe(550 + BAR_START);
    });

    it('keeps its thickness and its gap in pixels on the screen when the units of the board are bigger', () => {
      const { size } = layout.bar(BOUNDS, 'BOTTOM', 2);

      expect([size.width, size.height]).toEqual([100, Constants.ZONE_BAR_THICKNESS * 2]);
    });
  });

  describe('fill', () => {
    const horizontal = { center: { x: 100, y: 50 }, size: { width: 80, height: 10 } };
    const vertical = { center: { x: 50, y: 100 }, size: { width: 10, height: 80 } };

    it('starts at the left of a horizontal bar', () => {
      const { center, size } = layout.fill(horizontal, 0.5);

      expect([size.width, center.x - size.width / 2]).toEqual([40, 60]);
    });

    it('starts at the bottom of a vertical bar', () => {
      const { center, size } = layout.fill(vertical, 0.25);

      expect([size.height, center.y + size.height / 2]).toEqual([20, 140]);
    });

    it('fills the whole bar when the health is full', () => {
      expect(layout.fill(horizontal, 1)).toEqual(horizontal);
    });

    it.each([{ ratio: -0.5 }, { ratio: 0 }])('is empty with the share $ratio', ({ ratio }) => {
      expect(layout.fill(horizontal, ratio).size.width).toBe(0);
    });

    it('never goes over the bar', () => {
      expect(layout.fill(horizontal, 3).size.width).toBe(80);
    });
  });

  describe('name', () => {
    const LABEL = { width: 90, height: 30 };

    it('is below the bar of the zone below it', () => {
      const center = layout.name(BOUNDS, 'BOTTOM', LABEL, 1);

      expect([center.x, center.y - LABEL.height / 2]).toEqual([500, 330 + NAME_START]);
    });

    it('is above the bar of a zone of the top side', () => {
      const center = layout.name(BOUNDS, 'TOP', LABEL, 1);

      expect(center.y + LABEL.height / 2).toBe(270 - NAME_START);
    });

    it('is to the left of the bar on the left side, by its width', () => {
      const center = layout.name(BOUNDS, 'LEFT', LABEL, 1);

      expect([center.y, center.x + LABEL.width / 2]).toEqual([300, 450 - NAME_START]);
    });

    it('is to the right of the bar on the right side', () => {
      const center = layout.name(BOUNDS, 'RIGHT', LABEL, 1);

      expect(center.x - LABEL.width / 2).toBe(550 + NAME_START);
    });

    it('never touches the bar, at any size of the units', () => {
      const center = layout.name(BOUNDS, 'BOTTOM', LABEL, 2);
      const bar = layout.bar(BOUNDS, 'BOTTOM', 2);

      expect(center.y - LABEL.height).toBeGreaterThan(bar.center.y + bar.size.height / 2);
    });
  });

  describe('truncateName', () => {
    const measure = (text: string) => text.length * 10;

    it('keeps a name that fits', () => {
      expect(layout.truncateName('Rival', 120, measure)).toBe('Rival');
    });

    it('keeps a name that is exactly as wide as the room', () => {
      expect(layout.truncateName('Tercero', 70, measure)).toBe('Tercero');
    });

    it('cuts a name that does not fit and ends it with an ellipsis within the room', () => {
      const result = layout.truncateName('Jugador larguisimo', 120, measure);

      expect([result, measure(result) <= 120]).toEqual(['Jugador lar…', true]);
    });

    it('leaves only the ellipsis when not even a letter fits', () => {
      expect(layout.truncateName('Rival', 5, measure)).toBe('…');
    });
  });

  describe('nextPlayerCode', () => {
    const players = (...alive: boolean[]) => alive.map((isAlive, index) => ({ code: `p${index}`, isAlive }));

    it('is the next player in the order', () => {
      expect(layout.nextPlayerCode(players(true, true, true, true), 'p1')).toBe('p2');
    });

    it('goes back to the first player after the last one', () => {
      expect(layout.nextPlayerCode(players(true, true, true), 'p2')).toBe('p0');
    });

    it('skips an eliminated player', () => {
      expect(layout.nextPlayerCode(players(true, true, false, true), 'p1')).toBe('p3');
    });

    it('is nobody when the player with the turn is the only one alive', () => {
      expect(layout.nextPlayerCode(players(true, false, false), 'p0')).toBeUndefined();
    });

    it('is nobody without a player with the turn', () => {
      expect(layout.nextPlayerCode(players(true, true), undefined)).toBeUndefined();
    });

    it('is nobody when the player with the turn is not in the order', () => {
      expect(layout.nextPlayerCode(players(true, true), 'other')).toBeUndefined();
    });

    it('counts an eliminated player who has the turn, because the turn does not change until it is passed (CON-32)', () => {
      expect(layout.nextPlayerCode(players(true, false, true), 'p1')).toBe('p2');
    });
  });
});

import { describe, expect, it } from 'vitest';
import CardValueLabelLayout from '@/game/zone/CardValueLabelLayout';

// VIEW-47, VIEW-48
describe('CardValueLabelLayout', () => {
  const layout = new CardValueLabelLayout();
  const corner = (x: number, y: number) => ({ x, y, z: 0, scale: 1 });
  const LABEL_SIZE = { width: 80, height: 30 };
  const SLOT_CENTER = { x: 100, y: 200 };
  /** A slot of 40 by 60 whose bottom edge in the frame of its zone is on the given side of the screen. */
  const cornersFacing = {
    BOTTOM: { bl: corner(-20, 30), br: corner(20, 30) },
    TOP: { bl: corner(20, -30), br: corner(-20, -30) },
    LEFT: { bl: corner(-30, -20), br: corner(-30, 20) },
    RIGHT: { bl: corner(30, 20), br: corner(30, -20) }
  };

  describe('place', () => {
    it('puts the label below the card in the local zone', () => {
      const { side, position } = layout.place(SLOT_CENTER, cornersFacing.BOTTOM, LABEL_SIZE, 1);

      expect([side, position]).toEqual(['BOTTOM', { x: 100, y: 200 + 30 + 15 + 4 }]);
    });

    it('puts the label above the card in a zone of the top side', () => {
      const { side, position } = layout.place(SLOT_CENTER, cornersFacing.TOP, LABEL_SIZE, 1);

      expect([side, position]).toEqual(['TOP', { x: 100, y: 200 - 30 - 15 - 4 }]);
    });

    it('puts the label to the left of the card in a zone of the left side', () => {
      const { side, position } = layout.place(SLOT_CENTER, cornersFacing.LEFT, LABEL_SIZE, 1);

      expect([side, position]).toEqual(['LEFT', { x: 100 - 30 - 40 - 4, y: 200 }]);
    });

    it('puts the label to the right of the card in a zone of the right side', () => {
      const { side, position } = layout.place(SLOT_CENTER, cornersFacing.RIGHT, LABEL_SIZE, 1);

      expect([side, position]).toEqual(['RIGHT', { x: 100 + 30 + 40 + 4, y: 200 }]);
    });

    it('scales the size of the label, and not the size of the card, into the units of the board', () => {
      const { position } = layout.place(SLOT_CENTER, cornersFacing.BOTTOM, LABEL_SIZE, 2);

      expect(position).toEqual({ x: 100, y: 200 + 30 + (15 + 4) * 2 });
    });
  });

  describe('farthestFirst', () => {
    const at = (name: string, x: number, y: number) => ({ name, center: { x, y } });

    it('draws last the item closest to the leader', () => {
      const items = [at('near', 10, 0), at('far', 100, 0), at('middle', 50, 0)];

      expect(layout.farthestFirst(items, { x: 0, y: 0 }).map((item) => item.name)).toEqual(['far', 'middle', 'near']);
    });

    it('measures the distance in a straight line', () => {
      const items = [at('diagonal', 30, 40), at('axis', 45, 0)];

      expect(layout.farthestFirst(items, { x: 0, y: 0 }).map((item) => item.name)).toEqual(['diagonal', 'axis']);
    });

    it('keeps the order of the items at the same distance', () => {
      const items = [at('first', 10, 0), at('second', 0, 10)];

      expect(layout.farthestFirst(items, { x: 0, y: 0 }).map((item) => item.name)).toEqual(['first', 'second']);
    });

    it('does not change the list it receives', () => {
      const items = [at('near', 10, 0), at('far', 100, 0)];

      layout.farthestFirst(items, { x: 0, y: 0 });

      expect(items.map((item) => item.name)).toEqual(['near', 'far']);
    });
  });
});

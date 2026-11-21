import { describe, expect, it } from 'vitest';
import type { Corners3D } from '@/domain/Geometry';
import { cardScreenHeight, shadowOffset, shadowOutline } from '@/game/zone/CardLiftLayout';

// VIEW-4
describe('CardLiftLayout', () => {
  const flat = (x: number, y: number) => ({ x, y, z: 0, scale: 1 });
  const slot: Corners3D = { tl: flat(0, 0), tr: flat(100, 0), bl: flat(0, 200), br: flat(100, 200) };
  const upright = { rotation: 0, scale: 1 };

  describe('cardScreenHeight', () => {
    it('returns the height of a slot with straight sides', () => {
      expect(cardScreenHeight(slot)).toBe(200);
    });

    it('returns the mean of the left and right sides of a slot in perspective', () => {
      const trapezoid: Corners3D = { tl: flat(0, 0), tr: flat(100, 0), bl: flat(0, 200), br: flat(100, 100) };

      expect(cardScreenHeight(trapezoid)).toBe(150);
    });
  });

  describe('shadowOutline', () => {
    it('returns the corners of the slot relative to the point the card grows from', () => {
      const outline = shadowOutline(slot, { x: 50, y: 100 });

      expect(outline).toEqual([{ x: -50, y: -100 }, { x: 50, y: -100 }, { x: 50, y: 100 }, { x: -50, y: 100 }]);
    });
  });

  describe('shadowOffset', () => {
    it('falls down by the fraction of the height of the card', () => {
      const offset = shadowOffset(slot, 0.06, upright);

      expect(offset.x).toBeCloseTo(0);
      expect(offset.y).toBeCloseTo(12);
    });

    it('is divided by the scale of the containers of the slot', () => {
      const offset = shadowOffset(slot, 0.06, { rotation: 0, scale: 2 });

      expect(offset.y).toBeCloseTo(6);
    });

    it('still falls down on the screen when the containers of the slot are rotated', () => {
      const rotation = Math.PI / 2;
      const offset = shadowOffset(slot, 0.06, { rotation, scale: 1 });

      const x = offset.x * Math.cos(rotation) - offset.y * Math.sin(rotation);
      const y = offset.x * Math.sin(rotation) + offset.y * Math.cos(rotation);
      expect(x).toBeCloseTo(0);
      expect(y).toBeCloseTo(12);
    });
  });
});

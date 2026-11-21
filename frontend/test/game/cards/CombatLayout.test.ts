import { describe, expect, it } from 'vitest';
import type { Corners3D } from '@/domain/Geometry';
import { boxOfSlot, damageTextSize, lungeVector, shakeOffset, toSlotSpace } from '@/game/cards/CombatLayout';

describe('CombatLayout', () => {
  const flat = (x: number, y: number) => ({ x, y, z: 0, scale: 1 });
  const slot: Corners3D = { tl: flat(-50, -100), tr: flat(50, -100), bl: flat(-50, 100), br: flat(50, 100) };

  describe('boxOfSlot', () => {
    it('holds the corners of the slot around its origin', () => {
      expect(boxOfSlot(slot, { x: 300, y: 400 })).toEqual({ center: { x: 300, y: 400 }, width: 100, height: 200 });
    });

    it('holds a slot in perspective by its widest and tallest points', () => {
      const trapezoid: Corners3D = { tl: flat(-20, -100), tr: flat(20, -100), bl: flat(-50, 100), br: flat(50, 100) };

      expect(boxOfSlot(trapezoid, { x: 0, y: 0 }).width).toBe(100);
    });
  });

  // VIEW-5
  describe('lungeVector', () => {
    const attacker = { center: { x: 0, y: 0 }, width: 100, height: 200 };

    it('stops when the cards touch, in a straight line towards the target', () => {
      const target = { center: { x: 0, y: -500 }, width: 100, height: 200 };

      expect(lungeVector(attacker, target)).toEqual({ x: 0, y: -300 });
    });

    it('stops when the cards touch sideways', () => {
      const target = { center: { x: 400, y: 0 }, width: 100, height: 200 };

      expect(lungeVector(attacker, target)).toEqual({ x: 300, y: 0 });
    });

    it('keeps the direction of the center of the target when it is diagonal', () => {
      const target = { center: { x: 400, y: 400 }, width: 100, height: 200 };

      const { x, y } = lungeVector(attacker, target);

      expect(x).toBeCloseTo(y);
      expect(x).toBeGreaterThan(0);
      expect(Math.abs(x)).toBeLessThan(400);
    });

    it('does not move when the cards already touch', () => {
      const target = { center: { x: 50, y: 50 }, width: 100, height: 200 };

      expect(lungeVector(attacker, target)).toEqual({ x: 0, y: 0 });
    });

    it('does not move when both cards are in the same place', () => {
      expect(lungeVector(attacker, attacker)).toEqual({ x: 0, y: 0 });
    });
  });

  describe('toSlotSpace', () => {
    it('is the same vector when the slot is not rotated nor scaled', () => {
      expect(toSlotSpace({ x: 3, y: 4 }, { rotation: 0, scale: 1 })).toEqual({ x: 3, y: 4 });
    });

    it('is divided by the scale', () => {
      expect(toSlotSpace({ x: 4, y: 8 }, { rotation: 0, scale: 2 })).toEqual({ x: 2, y: 4 });
    });

    it('turns against the rotation so the vector keeps its direction on the screen', () => {
      const rotation = Math.PI / 2;
      const local = toSlotSpace({ x: 1, y: 0 }, { rotation, scale: 1 });

      expect(local.x * Math.cos(rotation) - local.y * Math.sin(rotation)).toBeCloseTo(1);
      expect(local.x * Math.sin(rotation) + local.y * Math.cos(rotation)).toBeCloseTo(0);
    });
  });

  // VIEW-5
  describe('shakeOffset', () => {
    it('starts and ends where the card was', () => {
      expect([shakeOffset(0, 3, 6), shakeOffset(1, 3, 6)].map((offset) => Math.abs(offset) < 1e-9)).toEqual([true, true]);
    });

    it('goes from side to side with less amplitude each time', () => {
      const first = shakeOffset(1 / 12, 3, 6);
      const last = shakeOffset(1 - 1 / 12, 3, 6);

      expect(first).toBeGreaterThan(0);
      expect(Math.abs(last)).toBeLessThan(first);
    });

    it('swings the given number of times', () => {
      const samples = Array.from({ length: 1000 }, (_, index) => shakeOffset(index / 1000, 3, 6));
      const crossings = samples.filter((offset, index) => index > 0 && Math.sign(offset) !== Math.sign(samples[index - 1])).length;

      expect(crossings).toBeGreaterThanOrEqual(5);
    });
  });

  // VIEW-6
  describe('damageTextSize', () => {
    it('is 40% of the long side of the target', () => {
      expect(damageTextSize(200, 0.4, 24)).toBe(80);
    });

    it('is never less than the minimum', () => {
      expect(damageTextSize(30, 0.4, 24)).toBe(24);
    });
  });
});

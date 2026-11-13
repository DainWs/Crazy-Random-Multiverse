import { describe, expect, it } from 'vitest';
import AttackArrowLayout from '@/game/perspectives/AttackArrowLayout';
import type { Corners3D } from '@/domain/Geometry';
import * as Constants from '@/core/Constants';

const point = (x: number, y: number) => ({ x, y, z: 0, scale: 1 });
const squareCorners = (half: number): Corners3D => ({ tl: point(-half, -half), tr: point(half, -half), bl: point(-half, half), br: point(half, half) });

describe('AttackArrowLayout', () => {
  describe('targetRadius', () => {
    it('is the distance from the center to the corners of a square slot', () => {
      expect(AttackArrowLayout.targetRadius(squareCorners(30))).toBeCloseTo(Math.hypot(30, 30));
    });

    it('is the mean of the distances when the slot is not a square', () => {
      const corners: Corners3D = { tl: point(-10, 0), tr: point(10, 0), bl: point(-30, 0), br: point(30, 0) };

      expect(AttackArrowLayout.targetRadius(corners)).toBeCloseTo(20);
    });
  });

  describe('tip', () => {
    const layout = new AttackArrowLayout({ x: 0, y: 0 });

    it('follows the pointer when there is no valid target under it', () => {
      expect(layout.tip({ x: 120, y: 40 })).toEqual({ x: 120, y: 40 });
    });

    // UI-5
    it('stops before the target, on the side of the attacker', () => {
      const tip = layout.tip({ x: 300, y: 0 }, { center: { x: 300, y: 0 }, radius: 50 });

      expect(tip.x).toBeCloseTo(300 - 50 - Constants.ATTACK_ARROW_TARGET_GAP);
      expect(tip.y).toBeCloseTo(0);
    });

    it('stops on the line between the attacker and the target', () => {
      const tip = layout.tip({ x: 310, y: 210 }, { center: { x: 300, y: 400 }, radius: 50 });

      expect(tip.x / tip.y).toBeCloseTo(300 / 400);
    });

    it('follows the pointer when the attacker is inside the reach of the target', () => {
      const closeLayout = new AttackArrowLayout({ x: 290, y: 0 });

      expect(closeLayout.tip({ x: 305, y: 5 }, { center: { x: 300, y: 0 }, radius: 50 })).toEqual({ x: 305, y: 5 });
    });
  });

  describe('head', () => {
    it('has its first vertex at the tip', () => {
      const layout = new AttackArrowLayout({ x: 0, y: 0 });

      expect(layout.head({ x: 100, y: 0 }).slice(0, 2)).toEqual([100, 0]);
    });

    it('opens backwards, towards the attacker', () => {
      const layout = new AttackArrowLayout({ x: 0, y: 0 });

      const [, , leftX, , rightX] = layout.head({ x: 100, y: 0 });

      expect([leftX < 100, rightX < 100]).toEqual([true, true]);
    });

    it('has sides of the length of the head', () => {
      const layout = new AttackArrowLayout({ x: 0, y: 0 });

      const [tipX, tipY, leftX, leftY] = layout.head({ x: 100, y: 0 });

      expect(Math.hypot(leftX - tipX, leftY - tipY)).toBeCloseTo(Constants.ATTACK_ARROW_HEAD_LENGTH);
    });
  });
});

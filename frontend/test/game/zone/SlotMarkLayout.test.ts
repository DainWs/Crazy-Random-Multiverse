import { describe, expect, it } from 'vitest';
import type { Corners3D } from '@/domain/Geometry';
import { ownZoneLines, readyCorners, sourceDashes } from '@/game/zone/SlotMarkLayout';

// VIEW-39
describe('SlotMarkLayout', () => {
  const flat = (x: number, y: number) => ({ x, y, z: 0, scale: 1 });
  const slot: Corners3D = { tl: flat(0, 0), tr: flat(100, 0), bl: flat(0, 200), br: flat(100, 200) };

  describe('ownZoneLines', () => {
    it('returns nine lines', () => {
      expect(ownZoneLines(slot)).toHaveLength(9);
    });

    it('returns lines parallel to the top right to bottom left diagonal', () => {
      const directions = ownZoneLines(slot).map(([start, end]) => (end.y - start.y) / (end.x - start.x));

      expect(directions.every((direction) => Math.abs(direction + 2) < 1e-9)).toBe(true);
    });

    it('starts the middle line at the top right corner', () => {
      const [start] = ownZoneLines(slot)[4];

      expect(start).toEqual({ x: 100, y: 0 });
    });

    it('ends the first line on the top edge and the left edge', () => {
      const [start, end] = ownZoneLines(slot)[0];

      expect([start, end]).toEqual([{ x: 20, y: 0 }, { x: 0, y: 40 }]);
    });
  });

  describe('readyCorners', () => {
    it('returns one L per corner', () => {
      expect(readyCorners(slot)).toHaveLength(4);
    });

    it('draws the top left L with arms of 30% of each edge', () => {
      expect(readyCorners(slot)[0]).toEqual([{ x: 30, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 60 }]);
    });

    it('draws the bottom right L ending at the bottom right corner', () => {
      expect(readyCorners(slot)[3][1]).toEqual({ x: 100, y: 200 });
    });
  });

  describe('sourceDashes', () => {
    it('returns 24 dashes: 5 on each horizontal edge and 7 on each vertical one', () => {
      expect(sourceDashes(slot)).toHaveLength(24);
    });

    it('covers 60% of each stretch of the top edge, centered', () => {
      const [first] = sourceDashes(slot);

      expect(first[0].x).toBeCloseTo(4);
      expect(first[1].x).toBeCloseTo(16);
    });

    it('covers 60% of each stretch of the left edge, centered', () => {
      const [first] = sourceDashes(slot).slice(10);

      expect(first[0].y).toBeCloseTo((200 / 7) * 0.2);
      expect(first[1].y).toBeCloseTo((200 / 7) * 0.8);
    });
  });
});

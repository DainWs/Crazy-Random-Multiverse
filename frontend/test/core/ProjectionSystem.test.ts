import { describe, expect, it } from 'vitest';
import ProjectionSystem from '@/core/ProjectionSystem';

describe('ProjectionSystem', () => {
  describe('toPoint3D', () => {
    it('projects the origin correctly', () => {
      const result = ProjectionSystem.toPoint3D({ x: 0, y: 0 });
      // depth = 7000 - 0 = 7000, scale = 1800 / 7000
      const expectedScale = 1800 / 7000;
      expect(result.x).toBeCloseTo(0, 5);
      expect(result.y).toBeCloseTo(0, 5);
      expect(result.z).toBe(7000);
      expect(result.scale).toBeCloseTo(expectedScale, 5);
    });

    it('applies perspective scaling - closer points (larger y) appear larger', () => {
      const far = ProjectionSystem.toPoint3D({ x: 100, y: -1000 });
      const near = ProjectionSystem.toPoint3D({ x: 100, y: 1000 });

      // Closer points (positive y, smaller depth) have a higher scale
      expect(near.scale).toBeGreaterThan(far.scale);
    });

    it('scales x and y proportionally by the perspective factor', () => {
      const point = { x: 500, y: 2000 };
      const result = ProjectionSystem.toPoint3D(point);
      const expectedDepth = 7000 - 2000;
      const expectedScale = 1800 / expectedDepth;

      expect(result.x).toBeCloseTo(point.x * expectedScale, 5);
      expect(result.y).toBeCloseTo(point.y * expectedScale, 5);
      expect(result.z).toBe(expectedDepth);
      expect(result.scale).toBeCloseTo(expectedScale, 5);
    });
  });

  describe('toCorners3D', () => {
    it('projects all four corners', () => {
      const corners = {
        tl: { x: -100, y: -100 },
        tr: { x: 100, y: -100 },
        bl: { x: -100, y: 100 },
        br: { x: 100, y: 100 }
      };

      const result = ProjectionSystem.toCorners3D(corners);

      // All corners should have different scales based on their y position
      expect(result.tl.scale).toBeCloseTo(result.tr.scale, 10);
      expect(result.bl.scale).toBeCloseTo(result.br.scale, 10);
      expect(result.bl.scale).toBeGreaterThan(result.tl.scale);
    });
  });

  describe('createCorners2D', () => {
    it('creates symmetric corners centered at origin', () => {
      const result = ProjectionSystem.createCorners2D(200, 300);

      expect(result.tl).toEqual({ x: -100, y: -150 });
      expect(result.tr).toEqual({ x: 100, y: -150 });
      expect(result.bl).toEqual({ x: -100, y: 150 });
      expect(result.br).toEqual({ x: 100, y: 150 });
    });
  });
});

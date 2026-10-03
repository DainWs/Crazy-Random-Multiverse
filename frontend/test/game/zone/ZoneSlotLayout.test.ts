import { describe, expect, it } from 'vitest';
import ZoneSlotLayout from '@/game/zone/ZoneSlotLayout';

describe('ZoneSlotLayout', () => {
  const defaultOptions = {
    position: { x: 100, y: 200 },
    rotation: 0,
    slotSize: { width: 100, height: 150 },
    spaceBetweenSlots: 10
  };

  describe('resolveOffsetForPosition', () => {
    it('centers single slot at (0, 0)', () => {
      const layout = new ZoneSlotLayout(defaultOptions);
      const offset = layout.resolveOffsetForPosition({ row: 0, column: 0 }, 1, 1);
      expect(offset).toEqual({ x: 0, y: 0 });
    });

    it('spaces columns horizontally with slotSize.width + spaceBetweenSlots', () => {
      const layout = new ZoneSlotLayout(defaultOptions);
      const col0 = layout.resolveOffsetXForPosition(0, 2);
      const col1 = layout.resolveOffsetXForPosition(1, 2);

      expect(col1 - col0).toBe(100 + 10);
      expect(col0).toBe(-55);
      expect(col1).toBe(55);
    });

    it('spaces rows vertically with slotSize.height + spaceBetweenSlots', () => {
      const layout = new ZoneSlotLayout(defaultOptions);
      const row0 = layout.resolveOffsetYForPosition(0, 2);
      const row1 = layout.resolveOffsetYForPosition(1, 2);

      expect(row1 - row0).toBe(150 + 10);
      expect(row0).toBe(-80);
      expect(row1).toBe(80);
    });
  });

  describe('rotateBoardOffset', () => {
    it('keeps offset unchanged at 0 degrees', () => {
      const layout = new ZoneSlotLayout({ ...defaultOptions, rotation: 0 });
      const rotated = layout.rotateBoardOffset({ x: 10, y: 20 });
      expect(rotated.x).toBeCloseTo(10, 5);
      expect(rotated.y).toBeCloseTo(20, 5);
    });

    it('rotates 90 degrees correctly', () => {
      const layout = new ZoneSlotLayout({ ...defaultOptions, rotation: 90 });
      const rotated = layout.rotateBoardOffset({ x: 10, y: 20 });
      // (10, 20) rotated 90 deg -> (10*0 - 20*1, 10*1 + 20*0) = (-20, 10)
      expect(rotated.x).toBeCloseTo(-20, 5);
      expect(rotated.y).toBeCloseTo(10, 5);
    });

    it('rotates 180 degrees correctly', () => {
      const layout = new ZoneSlotLayout({ ...defaultOptions, rotation: 180 });
      const rotated = layout.rotateBoardOffset({ x: 10, y: 20 });
      expect(rotated.x).toBeCloseTo(-10, 5);
      expect(rotated.y).toBeCloseTo(-20, 5);
    });
  });

  describe('calculateSlotBoardPosition', () => {
    it('adds zone position to rotated offset', () => {
      const layout = new ZoneSlotLayout(defaultOptions);
      const boardPos = layout.calculateSlotBoardPosition({ row: 0, column: 0 }, 1, 1);
      expect(boardPos).toEqual({ x: 100, y: 200 });
    });
  });

  describe('resolveOBBForSlot', () => {
    it('computes oriented bounding box in local screen coordinates', () => {
      const layout = new ZoneSlotLayout(defaultOptions);
      const obb = layout.resolveOBBForSlot(
        { row: 0, column: 0 },
        { x: 0, y: 0 },
        1,
        1
      );

      expect(obb.width).toBe(100);
      expect(obb.height).toBe(150);
      expect(obb.rotation).toBe(0);
      expect(obb.corners).toBeDefined();
      expect(obb.corners.tl).toBeDefined();
      expect(obb.corners.tr).toBeDefined();
      expect(obb.corners.bl).toBeDefined();
      expect(obb.corners.br).toBeDefined();
    });
  });
});

import { describe, expect, it } from 'vitest';
import HandLayoutCalculator, { DEFAULT_SPACE_BETWEEN_CARDS } from '@/game/hand/HandLayoutCalculator';

describe('HandLayoutCalculator', () => {
  describe('calculateSpaceBetweenCards', () => {
    it('returns 0 when card length is 0 or negative', () => {
      const calculator = new HandLayoutCalculator();
      expect(calculator.calculateSpaceBetweenCards(0)).toBe(0);
      expect(calculator.calculateSpaceBetweenCards(-1)).toBe(0);
    });

    it('returns max spacing for 1 card', () => {
      const calculator = new HandLayoutCalculator();
      expect(calculator.calculateSpaceBetweenCards(1)).toBe(DEFAULT_SPACE_BETWEEN_CARDS.max);
    });

    it('decreases spacing exponentially as card count increases', () => {
      const calculator = new HandLayoutCalculator();
      const spacing1 = calculator.calculateSpaceBetweenCards(1);
      const spacing2 = calculator.calculateSpaceBetweenCards(2);
      const spacing5 = calculator.calculateSpaceBetweenCards(5);
      const spacing10 = calculator.calculateSpaceBetweenCards(10);

      expect(spacing1).toBeGreaterThan(spacing2);
      expect(spacing2).toBeGreaterThan(spacing5);
      expect(spacing5).toBeGreaterThan(spacing10);
      expect(spacing10).toBeGreaterThanOrEqual(DEFAULT_SPACE_BETWEEN_CARDS.min);
    });

    it('respects custom spacing options', () => {
      const calculator = new HandLayoutCalculator({ min: 10, max: 100, decayFactor: 0.5 });
      expect(calculator.calculateSpaceBetweenCards(1)).toBe(100);
      expect(calculator.calculateSpaceBetweenCards(100)).toBeCloseTo(10, 1);
    });
  });

  describe('calculateTotalWidth', () => {
    it('returns 0 when card length is 0 or negative', () => {
      const calculator = new HandLayoutCalculator();
      expect(calculator.calculateTotalWidth(0, 200)).toBe(0);
      expect(calculator.calculateTotalWidth(-2, 200)).toBe(0);
    });

    it('returns card width for a single card', () => {
      const calculator = new HandLayoutCalculator();
      expect(calculator.calculateTotalWidth(1, 200)).toBe(200);
    });

    it('calculates total width for multiple cards', () => {
      const calculator = new HandLayoutCalculator();
      const spacing = calculator.calculateSpaceBetweenCards(3);
      expect(calculator.calculateTotalWidth(3, 200)).toBe(2 * spacing + 200);
    });
  });

  describe('calculateSlotPositionFromIndex', () => {
    it('centers single card at x = 0', () => {
      const calculator = new HandLayoutCalculator();
      const handWidth = calculator.calculateTotalWidth(1, 200);
      const pos = calculator.calculateSlotPositionFromIndex(0, 1, handWidth, 200);
      expect(pos).toEqual({ x: 0, y: 0 });
    });

    it('symmetrically distributes cards around the hand center', () => {
      const calculator = new HandLayoutCalculator();
      const handWidth = calculator.calculateTotalWidth(3, 200);

      const pos0 = calculator.calculateSlotPositionFromIndex(0, 3, handWidth, 200);
      const pos1 = calculator.calculateSlotPositionFromIndex(1, 3, handWidth, 200);
      const pos2 = calculator.calculateSlotPositionFromIndex(2, 3, handWidth, 200);

      expect(pos1.x).toBeCloseTo(0, 5);
      expect(pos0.x).toBeCloseTo(-pos2.x, 5);
    });
  });

  describe('calculateXOffsetForSlicedCard', () => {
    it('calculates sliced overlap offset from card width and spacing', () => {
      const calculator = new HandLayoutCalculator();
      const spacing = calculator.calculateSpaceBetweenCards(5);
      const offset = calculator.calculateXOffsetForSlicedCard(5, 200);
      expect(offset).toBe(200 - spacing);
    });
  });

  describe('calculateHandBasePosition', () => {
    it('centers horizontally and aligns to bottom margin', () => {
      const calculator = new HandLayoutCalculator();
      const basePos = calculator.calculateHandBasePosition(400, 300, 1080);
      expect(basePos).toEqual({
        x: 200,
        y: 1080 - 150
      });
    });
  });
});

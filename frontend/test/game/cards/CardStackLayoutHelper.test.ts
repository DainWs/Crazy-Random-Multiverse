import { describe, expect, it } from 'vitest';
import {
  calculateRevealedOffset as calculateRevealedCardOffset,
  calculateOffset as calculateStackedCardOffset
} from '@/game/cards/CardStackLayoutHelper';

describe('CardStackLayoutHelper', () => {
  describe('calculateStackedCardOffset', () => {
    it('returns [-offset, 0] for 0 degrees (default)', () => {
      expect(calculateStackedCardOffset(0)).toEqual([-20, 0]);
    });

    it('returns [0, offset] for 90 degrees', () => {
      expect(calculateStackedCardOffset(90)).toEqual([0, 20]);
    });

    it('returns [offset, 0] for 180 degrees', () => {
      expect(calculateStackedCardOffset(180)).toEqual([20, 0]);
    });

    it('returns [0, -offset] for -90 degrees', () => {
      expect(calculateStackedCardOffset(-90)).toEqual([0, -20]);
    });
  });

  describe('calculateRevealedCardOffset', () => {
    const cardWidth = 200;
    const offset = 20;
    const total = 220;

    it('returns [-total, 0] for 0 degrees', () => {
      expect(calculateRevealedCardOffset(0, cardWidth)).toEqual([-total, 0]);
    });

    it('returns [0, total] for 90 degrees', () => {
      expect(calculateRevealedCardOffset(90, cardWidth)).toEqual([0, total]);
    });

    it('returns [total, 0] for 180 degrees', () => {
      expect(calculateRevealedCardOffset(180, cardWidth)).toEqual([total, 0]);
    });

    it('returns [0, -total] for -90 degrees', () => {
      expect(calculateRevealedCardOffset(-90, cardWidth)).toEqual([0, -total]);
    });
  });
});

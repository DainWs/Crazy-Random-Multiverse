import { describe, expect, it } from 'vitest';
import { calculateFittingFontSize } from '@/game/utils/TextUtils';

describe('TextUtils', () => {
  describe('calculateFittingFontSize', () => {
    it('returns initial font size when text already fits', () => {
      const measure = (size: number) => ({ width: size * 5, height: size });
      const finalSize = calculateFittingFontSize(16, 100, 30, measure, 6);
      expect(finalSize).toBe(16);
    });

    it('decreases font size until text fits target dimensions', () => {
      // At size 20: width is 200, height is 40. Target width is 100.
      // At size 10: width is 100, height is 20. Fits!
      const measure = (size: number) => ({ width: size * 10, height: size * 2 });
      const finalSize = calculateFittingFontSize(20, 100, 50, measure, 6);
      expect(finalSize).toBe(10);
    });

    it('clamps to minFontSize when text cannot fit even at min size', () => {
      const measure = (size: number) => ({ width: size * 100, height: size * 100 });
      const finalSize = calculateFittingFontSize(20, 10, 10, measure, 8);
      expect(finalSize).toBe(8);
    });
  });
});

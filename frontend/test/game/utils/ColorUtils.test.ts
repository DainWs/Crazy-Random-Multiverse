import { describe, expect, it } from 'vitest';
import { isHexColor, toRGBColor } from '@/game/utils/ColorUtils';

describe('ColorUtils', () => {
  describe('isHexColor', () => {
    it('returns true for 3-digit hex colors', () => {
      expect(isHexColor('#fff')).toBe(true);
      expect(isHexColor('#A1B')).toBe(true);
    });

    it('returns true for 6-digit hex colors', () => {
      expect(isHexColor('#ffffff')).toBe(true);
      expect(isHexColor('#1a1a2e')).toBe(true);
    });

    it('returns true for 8-digit hex colors (with alpha)', () => {
      expect(isHexColor('#ffffff80')).toBe(true);
    });

    it('returns false for non-hex strings', () => {
      expect(isHexColor('red')).toBe(false);
      expect(isHexColor('#12')).toBe(false);
      expect(isHexColor('#12345')).toBe(false);
      expect(isHexColor('#gggggg')).toBe(false);
    });
  });

  describe('toRGBColor', () => {
    it('converts 6-digit hex color to RGB', () => {
      expect(toRGBColor('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(toRGBColor('#00ff00')).toEqual({ r: 0, g: 255, b: 0 });
      expect(toRGBColor('#0000ff')).toEqual({ r: 0, g: 0, b: 255 });
    });

    it('converts 8-digit hex color to RGBA', () => {
      expect(toRGBColor('#ff000080')).toEqual({ r: 255, g: 0, b: 0, a: 128 });
    });

    it('returns RGBColor untouched if already RGB object', () => {
      const rgb = { r: 10, g: 20, b: 30 };
      expect(toRGBColor(rgb)).toBe(rgb);
    });
  });
});

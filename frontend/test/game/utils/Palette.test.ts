import { describe, expect, it } from 'vitest';
import { PALETTE, paletteFill, paletteRgba, paletteText } from '@/game/utils/Palette';

describe('Palette', () => {
  describe('paletteFill', () => {
    it('returns the color as a number', () => {
      expect(paletteFill('MARK_READY')).toBe(0x00e5ff);
    });
  });

  describe('paletteText', () => {
    it('returns the color as #rrggbb', () => {
      expect(paletteText('PANEL_FILL')).toBe('#1b2631');
    });

    it('pads the colors with leading zeros to six digits', () => {
      expect(paletteText('TEXT_OUTLINE')).toBe('#000000');
    });
  });

  describe('paletteRgba', () => {
    it('returns the color as rgba with the given alpha', () => {
      expect(paletteRgba('TARGETING_VIGNETTE_EDGE', 0.5)).toBe('rgba(26, 97, 155, 0.5)');
    });
  });

  it('gives every color a value of up to six hexadecimal digits', () => {
    for (const value of PALETTE.values()) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(0xffffff);
    }
  });
});

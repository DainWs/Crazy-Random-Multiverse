import { afterEach, describe, expect, it } from 'vitest';
import { PALETTE, paletteFill, paletteMixedWithWhite, paletteRgba, paletteText } from '@/game/utils/Palette';

describe('Palette', () => {
  describe('paletteFill', () => {
    it('returns the color as a number', () => {
      expect(paletteFill('MARK_READY')).toBe(0x00e5ff);
    });
  });

  // UI-31
  describe('accessible mode', () => {
    afterEach(() => {
      window.history.replaceState(null, '', '/');
    });

    it('keeps the base colors of the own zone and of the eliminated zone without the parameter', () => {
      expect([paletteFill('SLOT_OWN_TINT'), paletteFill('SLOT_OWN_BORDER'), paletteFill('ELIMINATED_VEIL_BORDER')]).toEqual([0x9fd8ff, 0x3d9bff, 0x1a0000]);
    });

    it('gives those colors the accessible values with accessible=1', () => {
      window.history.replaceState(null, '', '/?accessible=1');

      expect([paletteFill('SLOT_OWN_TINT'), paletteFill('SLOT_OWN_BORDER'), paletteFill('ELIMINATED_VEIL_BORDER')]).toEqual([0x1a4f95, 0x061a3a, 0xc04545]);
    });

    it('does not change any other color', () => {
      window.history.replaceState(null, '', '/?accessible=1');

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

  describe('paletteMixedWithWhite', () => {
    it('returns the color itself with no white', () => {
      expect(paletteMixedWithWhite('HUD_BUTTON_PRIMARY', 0)).toBe('#1a5fa8');
    });

    it('mixes each channel with white by the share', () => {
      // 0x1a5fa8 is 26, 95, 168
      expect(paletteMixedWithWhite('HUD_BUTTON_PRIMARY', 0.2)).toBe('#487fb9');
    });

    it('returns white with all white', () => {
      expect(paletteMixedWithWhite('HUD_BUTTON_PRIMARY', 1)).toBe('#ffffff');
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

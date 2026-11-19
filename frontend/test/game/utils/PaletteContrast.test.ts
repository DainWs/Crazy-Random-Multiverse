import { describe, expect, it } from 'vitest';
import type { PaletteColor } from '@/game/utils/Palette';
import { paletteFill } from '@/game/utils/Palette';

type Rgb = [number, number, number];

const SLOT_FILL_ALPHA = 0.45;
const TEXT_MINIMUM = 4.5;
const MARK_MINIMUM = 3;

function toRgb(color: PaletteColor): Rgb {
  const value = paletteFill(color);

  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function over(color: Rgb, behind: Rgb, alpha: number): Rgb {
  return color.map((channel, index) => channel * alpha + behind[index] * (1 - alpha)) as Rgb;
}

function luminance(color: Rgb): number {
  const [red, green, blue] = color.map((channel) => {
    const unit = channel / 255;

    return unit <= 0.03928 ? unit / 12.92 : Math.pow((unit + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrast(first: Rgb, second: Rgb): number {
  const [lighter, darker] = [luminance(first), luminance(second)].sort((a, b) => b - a);

  return (lighter + 0.05) / (darker + 0.05);
}

// VIEW-40
describe('Palette contrast', () => {
  const table = toRgb('TABLE_CLASSIC_BACKGROUND');
  const neutralSlot = over(toRgb('SLOT_FILL'), table, SLOT_FILL_ALPHA);
  const ownSlot = over(toRgb('SLOT_OWN_TINT'), table, SLOT_FILL_ALPHA);

  it.each([
    { text: 'HUD_TEXT', background: 'PANEL_FILL' },
    { text: 'HUD_TEXT_LOCAL_TURN', background: 'PANEL_FILL' },
    { text: 'HUD_SPECTATOR_TEXT', background: 'PANEL_FILL' },
    { text: 'HUD_TEXT', background: 'HUD_BUTTON' },
    { text: 'HUD_TEXT', background: 'HUD_BUTTON_HOVER' }
  ] as const)('reaches 4.5:1 for $text on $background', ({ text, background }) => {
    expect(contrast(toRgb(text), toRgb(background))).toBeGreaterThanOrEqual(TEXT_MINIMUM);
  });

  it.each([
    { mark: 'MARK_READY' },
    { mark: 'MARK_TURN_GLOW' },
    { mark: 'MARK_VALID' },
    { mark: 'MARK_SOURCE' }
  ] as const)('reaches 3:1 for $mark against its edge', ({ mark }) => {
    expect(contrast(toRgb(mark), toRgb('MARK_EDGE'))).toBeGreaterThanOrEqual(MARK_MINIMUM);
  });

  it('reaches 3:1 for the edge of a mark against a light slot', () => {
    expect(contrast(toRgb('MARK_EDGE'), neutralSlot)).toBeGreaterThanOrEqual(MARK_MINIMUM);
  });

  it('reaches 3:1 for the tint of the own zone against a neutral slot', () => {
    expect(contrast(ownSlot, neutralSlot)).toBeGreaterThanOrEqual(MARK_MINIMUM);
  });

  it('reaches 3:1 for the lines of the own zone against its tint', () => {
    expect(contrast(toRgb('OWN_ZONE_LINES'), ownSlot)).toBeGreaterThanOrEqual(MARK_MINIMUM);
  });

  it('reaches 3:1 for the border of an eliminated slot against its veil', () => {
    const veil = over(toRgb('ELIMINATED_VEIL'), table, 0.8);

    expect(contrast(toRgb('ELIMINATED_VEIL_BORDER'), veil)).toBeGreaterThanOrEqual(MARK_MINIMUM);
  });
});

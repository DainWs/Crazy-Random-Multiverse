import { describe, expect, it } from 'vitest';
import DamageTextLayout from '@/game/cards/DamageTextLayout';
import { DAMAGE_TEXT_GAP, DAMAGE_TEXT_RISE } from '@/core/Constants';

describe('DamageTextLayout', () => {
  const center = { x: 100, y: 400 };
  const layout = new DamageTextLayout(center);

  it('starts the first text at the center of the slot', () => {
    expect(layout.startPosition(0)).toEqual(center);
  });

  it('stacks the next text above the previous one', () => {
    expect(layout.startPosition(1)).toEqual({ x: center.x, y: center.y - DAMAGE_TEXT_GAP });
  });

  it('rises from where the text started', () => {
    expect(layout.riseTargetY(1)).toBe(center.y - DAMAGE_TEXT_GAP - DAMAGE_TEXT_RISE);
  });
});

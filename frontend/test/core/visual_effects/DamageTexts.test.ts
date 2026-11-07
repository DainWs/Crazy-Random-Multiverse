import { describe, expect, it } from 'vitest';
import type { CombatResult } from '@/domain/CombatResult';
import { toDamageTexts } from '@/core/visual_effects/DamageTexts';
import { ARMOR_DAMAGE_TEXT_COLOR, HEALTH_DAMAGE_TEXT_COLOR } from '@/core/Constants';

describe('toDamageTexts', () => {
  const createCombat = (armorDamage: number, healthDamage: number) => ({ armorDamage, healthDamage }) as CombatResult;

  it('shows the armor lost and then the health lost', () => {
    const texts = toDamageTexts(createCombat(2, 3));

    expect(texts).toEqual([
      { text: '-2', color: ARMOR_DAMAGE_TEXT_COLOR },
      { text: '-3', color: HEALTH_DAMAGE_TEXT_COLOR }
    ]);
  });

  it('shows only the health when the armor held', () => {
    const texts = toDamageTexts(createCombat(0, 5));

    expect(texts).toEqual([{ text: '-5', color: HEALTH_DAMAGE_TEXT_COLOR }]);
  });

  it('shows only the armor when it absorbed the whole attack', () => {
    const texts = toDamageTexts(createCombat(4, 0));

    expect(texts).toEqual([{ text: '-4', color: ARMOR_DAMAGE_TEXT_COLOR }]);
  });

  it('shows nothing when the attack did no damage', () => {
    expect(toDamageTexts(createCombat(0, 0))).toEqual([]);
  });
});

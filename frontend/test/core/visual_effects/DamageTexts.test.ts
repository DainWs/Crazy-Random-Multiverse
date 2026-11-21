import { describe, expect, it } from 'vitest';
import type { CombatResult } from '@/domain/CombatResult';
import { toDamageText } from '@/core/visual_effects/DamageTexts';

// VIEW-6
describe('toDamageText', () => {
  const createCombat = (armorDamage: number, healthDamage: number) => ({ armorDamage, healthDamage }) as CombatResult;

  it('shows the health lost in red with a heart', () => {
    expect(toDamageText(createCombat(0, 5), 'PHYSICAL')).toEqual({ text: '−5', icon: 'HEART', color: 'HIT_FLASH' });
  });

  it('shows the physical armor lost in steel grey with a shield', () => {
    expect(toDamageText(createCombat(4, 0), 'PHYSICAL')).toEqual({ text: '−4', icon: 'SHIELD', color: 'HIT_FLASH_ARMOR' });
  });

  it('shows the magic armor lost with the shield of magic armor', () => {
    expect(toDamageText(createCombat(2, 0), 'MAGIC').icon).toBe('MAGIC_SHIELD');
  });

  it('shows the plain shield when the card has no armor type', () => {
    expect(toDamageText(createCombat(2, 0), undefined).icon).toBe('SHIELD');
  });

  it('shows a white 0 without icon when the attack took nothing', () => {
    expect(toDamageText(createCombat(0, 0), 'PHYSICAL')).toEqual({ text: '0', icon: null, color: 'NOTICE_TEXT' });
  });
});

import 'phaser';
import { describe, expect, it } from 'vitest';
import type { CombatantCard } from '@/domain/Card';
import type { StatisticType } from '@/domain/Statistics';
import { statisticChanges, toFloatingText } from '@/core/visual_effects/Placement';

/** A combatant that only answers for its statistics. */
function createCombatant(values: Partial<Record<StatisticType, number>>, armorType?: 'PHYSICAL' | 'MAGIC'): CombatantCard {
  return {
    getStatistic: (type: StatisticType) => (values[type] === undefined ? undefined : { type, value: values[type], valueType: type === 'Armor' ? armorType : undefined })
  } as unknown as CombatantCard;
}

// VIEW-36
describe('statisticChanges', () => {
  it('lists each statistic the equipment changed, in the order of the texts', () => {
    const before = createCombatant({ Damage: 3, Armor: 1, Health: 5 });
    const after = createCombatant({ Damage: 5, Armor: 1, Health: 6 });

    expect(statisticChanges(before, after)).toEqual([
      { type: 'Damage', from: 3, to: 5 },
      { type: 'Health', from: 5, to: 6 }
    ]);
  });

  it('lists nothing when the equipment changes nothing', () => {
    const card = createCombatant({ Damage: 3, Armor: 1, Health: 5 });

    expect(statisticChanges(card, card)).toEqual([]);
  });

  it('counts the armor a card did not have from 0', () => {
    const before = createCombatant({ Damage: 3, Health: 5 });
    const after = createCombatant({ Damage: 3, Armor: 2, Health: 5 }, 'PHYSICAL');

    expect(statisticChanges(before, after)).toEqual([{ type: 'Armor', from: 0, to: 2 }]);
  });

  it('lists a value that goes down', () => {
    const before = createCombatant({ Damage: 3, Health: 5 });
    const after = createCombatant({ Damage: 1, Health: 5 });

    expect(statisticChanges(before, after)).toEqual([{ type: 'Damage', from: 3, to: 1 }]);
  });

  it('shows the new value as the change when the card was not known before', () => {
    expect(statisticChanges(undefined, createCombatant({ Damage: 2 }))).toEqual([{ type: 'Damage', from: 0, to: 2 }]);
  });
});

// VIEW-36
describe('toFloatingText', () => {
  it('shows a value that goes up as +N in green with a sword for the damage', () => {
    const text = toFloatingText({ type: 'Damage', from: 3, to: 5 }, createCombatant({ Damage: 5 }));

    expect(text).toEqual({ text: '+2', icon: 'SWORD', color: 'TOOLTIP_POSITIVE' });
  });

  it('shows a value that goes down as −N in red with a heart for the health', () => {
    const text = toFloatingText({ type: 'Health', from: 5, to: 4 }, createCombatant({ Health: 4 }));

    expect(text).toEqual({ text: '−1', icon: 'HEART', color: 'TOOLTIP_NEGATIVE' });
  });

  it('shows the physical armor with a shield', () => {
    const text = toFloatingText({ type: 'Armor', from: 0, to: 2 }, createCombatant({ Armor: 2 }, 'PHYSICAL'));

    expect(text.icon).toBe('SHIELD');
  });

  it('shows the magic armor with the shield of magic armor', () => {
    const text = toFloatingText({ type: 'Armor', from: 0, to: 2 }, createCombatant({ Armor: 2 }, 'MAGIC'));

    expect(text.icon).toBe('MAGIC_SHIELD');
  });
});

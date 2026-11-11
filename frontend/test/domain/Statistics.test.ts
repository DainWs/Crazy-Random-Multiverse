import { describe, expect, it } from 'vitest';
import { Armor, Bonus, Health, valueAfterDamage, withValue } from '@/domain/Statistics';

describe('Statistics', () => {
  describe('Bonus', () => {
    // EQUIP-1, CON-34
    it('has no type of its own', () => {
      const statistic = Bonus('Damage', 15);

      expect(statistic.valueType).toBeUndefined();
    });

    it('throws when asked for an icon', () => {
      expect(() => Bonus('Armor', 5).icon()).toThrow('A Armor bonus of a piece of equipment has no icon');
    });
  });

  describe('withValue', () => {
    it('keeps the maximum of a health', () => {
      const statistic = withValue(Health(10, 15), 7);

      expect(statistic.text()).toBe('7/15');
    });

    it('keeps the type of an armor', () => {
      const statistic = withValue(Armor('MAGIC', 5), 2);

      expect(statistic).toMatchObject({ type: 'Armor', valueType: 'MAGIC', value: 2 });
    });
  });

  describe('valueAfterDamage', () => {
    it('subtracts the damage', () => {
      expect(valueAfterDamage(Health(10, 15), 4)).toBe(6);
    });

    it('never goes below 0', () => {
      expect(valueAfterDamage(Health(3, 15), 9)).toBe(0);
    });
  });
});

import { describe, expect, it } from 'vitest';
import { Armor, Health } from '@/domain/Statistics';
import { valueAfterDamage, withValue } from '@/core/visual_effects/StatisticCount';

describe('StatisticCount', () => {
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

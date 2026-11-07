import type { ArmorType, Statistic } from '@/domain/Statistics';
import { Armor, Health } from '@/domain/Statistics';

/** The statistic of an armor or health at an intermediate value, keeping its maximum and type, for the count of VIEW-6. */
function withValue(statistic: Statistic, value: number): Statistic {
  if (statistic.type === 'Health') {
    return Health(value, statistic.maxValue ?? statistic.value);
  }

  return Armor(statistic.valueType as ArmorType, value);
}

/** The value a statistic ends at after losing `damage`, never below 0 (CON-21). */
function valueAfterDamage(statistic: Statistic, damage: number): number {
  return Math.max(0, statistic.value - damage);
}

export { valueAfterDamage, withValue };

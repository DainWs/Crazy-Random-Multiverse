import { HEALTH_ICON_KEY, statisticIconKey } from "@/domain/ResourceKeys";

type DamageType = 'PHYSICAL' | 'MAGIC' | 'TRUE';
type ArmorType = 'PHYSICAL' | 'MAGIC';

type StatisticType = 'Damage' | 'Armor' | 'Health';

interface Statistic {
  type: StatisticType;
  value: number;
  valueType?: DamageType | ArmorType;
  maxValue?: number;
  text(): string;
  icon(): string;
}

type Damage = Statistic;
type Armor = Statistic;
type Health = Statistic;

function Damage(type: DamageType, value: number): Statistic {
  return {
    type: 'Damage',
    value,
    valueType: type,
    text: () => `${value}`,
    icon: () => statisticIconKey('damage', type)
  }
}

function Armor(type: ArmorType, value: number): Statistic {
  return {
    type: 'Armor',
    value,
    valueType: type,
    text: () => `${value}`,
    icon: () => statisticIconKey('armor', type)
  }
}

function Health(value: number, maxValue: number): Statistic {
  return {
    type: 'Health',
    value,
    maxValue,
    text: () => `${value}/${maxValue}`,
    icon: () => HEALTH_ICON_KEY
  }
}

/** The armor or health at another value, keeping its maximum and type. */
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

export type { StatisticType, DamageType, ArmorType, Statistic };
export { Damage, Armor, Health, withValue, valueAfterDamage };
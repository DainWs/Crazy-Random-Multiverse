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

export type { StatisticType, DamageType, ArmorType, Statistic };
export { Damage, Armor, Health };
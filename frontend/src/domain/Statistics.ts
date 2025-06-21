type DamageType = 'PHYSICAL' | 'MAGIC' | 'TRUE';
type ArmorType = 'PHYSICAL' | 'MAGIC';

interface Statistic {
  type: 'Damage' | 'Armor' | 'Health';
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
    icon: () => `statistic-icon_${type.toLowerCase()}_damage`
  }
}

function Armor(type: ArmorType, value: number): Statistic {
  return {
    type: 'Armor',
    value,
    valueType: type,
    text: () => `${value}`,
    icon: () => `statistic-icon_${type.toLowerCase()}_armor`
  }
}

function Health(value: number, maxValue: number): Statistic {
  return {
    type: 'Health',
    value,
    maxValue,
    text: () => `${value}/${maxValue}`,
    icon: () => 'statistic-icon_health'
  }
}

export type { DamageType, ArmorType, Statistic };
export { Damage, Armor, Health };
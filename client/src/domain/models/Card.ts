type CardType = 'LEADER' | 'WARRIOR' | 'EQUIPMENT' | 'SPELL';
type CardRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MITHIC';
type DamageType = 'PHYSICAL' | 'MAGIC' | 'TRUE';
type ArmorType = 'PHYSICAL' | 'MAGIC';

class CardCode {
  public code: number;
  public type: CardType;

  public constructor(code: number, type: CardType) {
    this.code = code;
    this.type = type;
  }

  public equals(that: CardCode) {
    return this.code == that.code && this.type == that.type;
  }

  public toString() {
    return `[${this.type},${this.code}]`;
  }
}

class Card {
  public code: CardCode;
  public name: string;
  public description: string;
  public type: CardType;
  public rarity?: CardRarity;
  public damage?: number;
  public damageType?: DamageType;
  public armor?: number;
  public armorType?: ArmorType;
  public health?: number;
  public maxHealth?: number;
  // TODO agregar posibilidad de tener equipada una carta de tipo 'Equipment'

  public constructor(code: CardCode, type: CardType) {
    this.code = code;
    this.type = type;
    this.name = '';
    this.description = '';
  }

  public isType(type: CardType): boolean {
    return this.type === type;
  }

  public isCombatant(): boolean {
    return this.isType('LEADER') || this.isType('WARRIOR');
  }

  public hasStatistics(): boolean {
    return this.isCombatant() || this.isType('EQUIPMENT');
  }

  public getTypeDescription(): string {
    if (!this.isType('WARRIOR')) {
      return this.type;
    }

    if (this.rarity == undefined) {
      throw new Error('Card of type Warriror requires rarity as not null');
    }

    return this.rarity;
  }

  public equals(that: Card) {
    return this.code.equals(that.code);
  }
}

export { CardCode, CardType, CardRarity, DamageType, ArmorType };
export default Card;

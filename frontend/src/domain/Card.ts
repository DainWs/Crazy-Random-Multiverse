import { Armor, Damage, Health } from "@/domain/Statistics";

type CardType = 'LEADER' | 'WARRIOR' | 'EQUIPMENT' | 'SPELL';
type CardRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MITHIC';
type CardTexture = 'card' | 'common-card' | 'uncommon-card' | 'rare-card' | 'epic-card' | 'legendary-card' | 'mithic-card';

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

  public text() {
    return `${this.type}-${this.code}`;
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
  public damage?: Damage;
  public armor?: Armor
  public health?: Health;
  // TODO agregar posibilidad de tener equipada una carta de tipo 'Equipment'

  public constructor(code: CardCode, type: CardType) {
    this.code = code;
    this.type = type;
    this.name = '';
    this.description = '';
  }

  public isType(type: CardType, rarity?: CardRarity): boolean {
    return this.type === type && (rarity === undefined || this.rarity === rarity);
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

  public getTexture(): CardTexture {
    if (this.isType("WARRIOR")) {
      return `${this.rarity?.toLowerCase()}-card` as CardTexture;
    }
  
    return 'card';
  }

  public equals(that: Card) {
    return this.code.equals(that.code);
  }
}

export { CardCode };
export type { CardType, CardRarity, CardTexture };
export default Card;

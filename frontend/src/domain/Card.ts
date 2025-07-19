import { Armor, Damage, Health } from "@/domain/Statistics";
import Skill from "@/domain/Skills";

type CardType = 'LEADER' | 'WARRIOR' | 'EQUIPMENT' | 'SPELL';
type CardRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MITHIC';
type WarriorTexture = 
  | 'card' 
  | 'common-card' 
  | 'uncommon-card'
  | 'rare-card' 
  | 'epic-card' 
  | 'legendary-card' 
  | 'mithic-card';

type CardTexture = 
  | WarriorTexture
  | 'leader-card' 
  | 'equipment-card' 
  | 'spell-card';

type CardAudioType = 'put' | 'attack' | 'die';
type Resource = string;

class CardCode {
  public readonly code: number;
  public readonly type: CardType;

  public constructor(code: number, type: CardType) {
    this.code = code;
    this.type = type;
  }

  public equals(that: CardCode) {
    return this.code == that.code && this.type == that.type;
  }

  public number() {
    return this.code;
  }

  public text() {
    return `${this.type}-${this.code}`;
  }

  public toString() {
    return `[${this.type},${this.code}]`;
  }
}

type CardOptions = {
  code: CardCode;
  name: string;
  description: string;
  type: CardType;
  rarity?: CardRarity;
}

type Require<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
type RequireAndOmit<T, K extends keyof T, I extends keyof T> = Omit<T, I | K> & { [P in K]-?: NonNullable<T[P]> };

type CombatantCard = Require<Card, 'damage' | 'armor' | 'health'>;
type LeaderCard = CombatantCard;
type WarriorCard = Require<Card, 'rarity'>;
type EquipmentCard = RequireAndOmit<Card, 'damage' | 'armor' | 'health', 'activeSkill' | 'equipment'>;
type SpellCard = RequireAndOmit<Card, 'activeSkill', 'rarity' | 'damage' | 'armor' | 'health' | 'passiveSkill' | 'equipment'>;

class Card {
  public readonly code: CardCode;
  public readonly name: string;
  public readonly description: string;
  public readonly type: CardType;
  public readonly rarity?: CardRarity;
  public damage?: Damage;
  public armor?: Armor
  public health?: Health;
  public activeSkill?: Skill;
  public passiveSkill?: Skill;
  public equipment?: EquipmentCard;

  public constructor(options: CardOptions) {
    this.code = options.code;
    this.name = options.name;
    this.description = options.description;
    this.type = options.type;
    this.rarity = options.rarity;
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

  public hasSkills(): boolean {
    return !!this.activeSkill || !!this.passiveSkill;
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

  public getAudio(type: CardAudioType): Resource {
    if (this.isType("WARRIOR")) {
      const number = (type == 'attack') ? Math.floor(Math.random() * 3) + 1 : 1;
      return `${this.rarity?.toLowerCase()}-${type}-${this.code.number()}-${number}`;
    }
  
    return `${this.type.toLowerCase()}-${type}-${this.code.number()}`;
  }

  public getImage(): Resource {
    if (this.isType("WARRIOR")) {
      return `${this.rarity?.toLowerCase()}-${this.code.number()}`;
    }
  
    return `${this.type.toLowerCase()}-${this.code.number()}`;
  }

  public getTexture(): CardTexture {
    if (this.isType("WARRIOR")) {
      return `${this.rarity?.toLowerCase()}-card` as WarriorTexture;
    }
  
    return `${this.type.toLowerCase()}-card` as CardTexture;
  }

  public equals(that: Card) {
    return this.code.equals(that.code);
  }
}

export { CardCode };
export type { CardAudioType, CardOptions, CardType, CardRarity, CardTexture };
export type { CombatantCard, LeaderCard, WarriorCard, EquipmentCard, SpellCard };
export default Card;

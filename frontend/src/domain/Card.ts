import { Armor, Damage, Health, Statistic, StatisticType } from "@/domain/Statistics";
import Skill from "@/domain/Skills";
import { ATTACK_AUDIO_VARIANTS, cardAudioKey, cardFrameKey, cardImageKey } from "@/domain/ResourceKeys";

type CardType = 'LEADER' | 'WARRIOR' | 'EQUIPMENT' | 'SPELL';
type CardRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';
type CardAudioType = 'put' | 'attack' | 'die';
type Resource = string;

class CardCode {
  public readonly code: string;
  public readonly type: CardType;

  public constructor(code: string, type: CardType) {
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
  public readonly uuid: string;
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
  public isProtected: boolean;
  public isTargetable: boolean;
  public isAttackAvailable: boolean;

  public constructor(options: CardOptions) {
    this.uuid = self.crypto.randomUUID();
    this.code = options.code;
    this.name = options.name;
    this.description = options.description;
    this.type = options.type;
    this.rarity = options.rarity;

    this.isProtected = false;
    this.isTargetable = false;
    this.isAttackAvailable = false;
  }

  public getStatistic(statisticType: StatisticType): Statistic | undefined {
    if (statisticType == 'Damage') return this.damage;
    if (statisticType == 'Armor') return this.armor;
    if (statisticType == 'Health') return this.health;
    throw new Error(`Unknown statistic type: ${statisticType}`);
  }

  public isType(type: CardType, rarity?: CardRarity): boolean {
    return this.type === type && (rarity === undefined || this.rarity === rarity);
  }

  public isCombatant(): boolean {
    return this.isType('LEADER') || this.isType('WARRIOR');
  }

  public hasAlreadyEquipment(): boolean {
    return this.equipment !== null;
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
    const variant = Math.floor(Math.random() * ATTACK_AUDIO_VARIANTS) + 1;
    return cardAudioKey(this.getImage(), type, variant);
  }

  public getImage(): Resource {
    return cardImageKey(this.type, this.code.code, this.rarity);
  }

  public getTexture(): Resource {
    return cardFrameKey(this.type, this.rarity);
  }

  public equals(that: Card) {
    return this.uuid === that.uuid && this.code.equals(that.code);
  }
}

export { CardCode };
export type { CardAudioType, CardOptions, CardType, CardRarity };
export type { CombatantCard, LeaderCard, WarriorCard, EquipmentCard, SpellCard };
export default Card;

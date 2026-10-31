import type { CardOptions, CardRarity, CardType, EquipmentCard } from "@/domain/Card";
import type { ArmorType, DamageType } from "@/domain/Statistics";
import { Armor, Damage, Health } from "@/domain/Statistics";
import Card, { CardCode } from "@/domain/Card";

interface CardCodeDto {
  code: string;
  type: CardType;
}

interface CardDto {
  code: CardCodeDto;
  name: string;
  description: string;
  type: CardType;
  rarity?: CardRarity;

  // Statistics
  damage?: number;
  damageType?: DamageType;

  armor?: number;
  armorType?: ArmorType;

  health?: number;
  maxHealth?: number;

  // Combatant 
  equipment?: CardDto;

  // Runtime state, only meaningful for cards inside game.zones
  protected?: boolean;
  attackAvailable?: boolean;
  targetable?: boolean;
}

function toCardCodeDto(cardCode: CardCode | undefined): CardCodeDto | undefined {
  if (!cardCode) return undefined;
  return { code: cardCode.code, type: cardCode.type };
}

function toCardCode(dto: CardCodeDto): CardCode {
  return new CardCode(dto.code, dto.type);
}

function toDamage(dto: CardDto): Damage | undefined {
  if (!dto.damage || !dto.damageType) {
    return undefined;
  }

  return Damage(dto.damageType, dto.damage);
}

function toArmor(dto: CardDto): Armor | undefined {
  if (!dto.armor || !dto.armorType) {
    return undefined;
  }

  return Armor(dto.armorType, dto.armor);
}

function toHealth(dto: CardDto): Health | undefined {
  if (!dto.health) {
    return undefined;
  }

  const maxVal = typeof dto.maxHealth === 'number' ? dto.maxHealth : dto.health;
  return Health(dto.health, maxVal);
}

const toCard = (dto: CardDto): Card => {
  const cardOptions: CardOptions = {
    code: toCardCode(dto.code),
    name: dto.name,
    description: dto.description,
    type: dto.type,
    rarity: dto.rarity
  }

  const card = new Card(cardOptions);
  card.damage = toDamage(dto);
  card.armor = toArmor(dto);
  card.health = toHealth(dto);
  card.isProtected = dto.protected ?? false;
  card.isAttackAvailable = dto.attackAvailable ?? false;
  card.isTargetable = dto.targetable ?? false;

  if (dto.equipment) {
    card.equipment = toCard(dto.equipment) as EquipmentCard;
  }

  return card;
}

export type { CardCodeDto, CardDto };
export { toCardCodeDto, toCardCode, toCard };
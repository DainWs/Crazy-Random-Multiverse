import Card, { CardCode, CardRarity, CardType } from "@/domain/Card";
import { EquipmentCard, LeaderCard, SpellCard, WarriorCard } from "@/domain/Card";
import { Armor, ArmorType, Damage, DamageType, Health } from "@/domain/Statistics";
import Skill, { SkillCode } from "@/domain/Skills";

type CardAbstractFactoryMethod = (code: CardCode, name?: string, description?: string) => Card;
const typeBasedFactoryMethods = new Map<CardType, CardAbstractFactoryMethod>();
typeBasedFactoryMethods.set("LEADER", createLeaderCard);
typeBasedFactoryMethods.set("EQUIPMENT", createEquipmentCard);
typeBasedFactoryMethods.set("SPELL", createSpellCard);

const createCardCode = (value?: number, type?: CardType): CardCode => {
  if (!value) value = Math.floor(Math.random() * 10000);
  if (!type) type = getRandomCardType();
  return new CardCode(value, type);
}

const createSkillCode = (value?: number): SkillCode => {
  if (!value) value = Math.floor(Math.random() * 10000);
  return value;
}

const createCard = (code?: CardCode, name?: string, description?: string) => {
  if (!code) code = createCardCode();
  if (code.type == "WARRIOR") {
    return createWarriorCard({ code, name, description });
  }

  const cardFactoryMethod = typeBasedFactoryMethods.get(code.type) as CardAbstractFactoryMethod;
  return cardFactoryMethod(code, name, description);
}

/** Purposely function: typeBasedFactoryMethods binding  */
function createLeaderCard(code?: CardCode, name?: string, description?: string, 
  damage?: number, damageType?: DamageType, 
  armor?: number, armorType?: ArmorType, 
  health?: number, maxHealth?: number
): LeaderCard {
  if (!code) code = createCardCode(undefined, 'LEADER');
  const card = createCardOptions(code, 'LEADER', name, description);
  fillStatistics(card, damage, damageType, armor, armorType, health, maxHealth);
  return card as LeaderCard;
}

/** Purposely function: typeBasedFactoryMethods binding  */
function createWarriorCard(options: {code?: CardCode, name?: string, description?: string, 
  rarity?: CardRarity, 
  damage?: number, damageType?: DamageType, 
  armor?: number, armorType?: ArmorType, 
  health?: number, maxHealth?: number
}): WarriorCard {
  if (!options.code) options.code = createCardCode(undefined, 'WARRIOR');
  if (!options.rarity) options.rarity = getRandomCardRarity();
  const card = createCardOptions(options.code, 'WARRIOR', options.name, options.description, options.rarity);
  if (shouldSpawn(10)) { // 10% of spawnRate
    card.passiveSkill = createSkill();
    fillStatisticsWithLimits(card, 
      options.damage, options.damageType, 40, 
      options.armor, options.armorType,  40,
      options.health, options.maxHealth, 400
    );
  } else {
    fillStatistics(card, options.damage, options.damageType, options.armor, options.armorType, options.health, options.maxHealth);
  }
  if (shouldSpawn(30)) { // 30% of spawnRate
    card.equipment = createEquipmentCard();
  }
  return card as WarriorCard;
}

/** Purposely function: typeBasedFactoryMethods binding  */
function createEquipmentCard(code?: CardCode, name?: string, description?: string, 
  damage?: number, damageType?: DamageType, 
  armor?: number, armorType?: ArmorType, 
  health?: number, maxHealth?: number
): EquipmentCard {
  if (!code) code = createCardCode(undefined, 'EQUIPMENT');
  const card = createCardOptions(code, 'EQUIPMENT', name, description);
  if (shouldSpawn(40)) { // 40% of spawnRate
    card.passiveSkill = createSkill();
    fillStatisticsWithZero(card);
  } else {
    fillStatistics(card, damage, damageType, armor, armorType, health, maxHealth);
  }
  return card as EquipmentCard;
}

/** Purposely function: typeBasedFactoryMethods binding  */
function createSpellCard(code?: CardCode, name?: string, description?: string): SpellCard {
  if (!code) code = createCardCode(undefined, 'SPELL');
  if (!description) description = "As das dasasd asdasdasdadadada dsada sdasd asdasdadsasdad  dasd a das dad as das dasd sad as dasdasdad a";
  const card = createCardOptions(code, 'SPELL', name, description);
  card.activeSkill = createSkill();
  return card as SpellCard;
}

function createCardOptions(code: CardCode, type: CardType, name?: string, description?: string, rarity?: CardRarity) {
  if (!name) name = `${type}-${Math.floor(Math.random() * 10000)}`;
  if (!description) description = `${type}-${Math.floor(Math.random() * 10000)}`;
  return new Card({
    code, name, description, type, rarity
  });
}

function createSkill(code?: SkillCode, name?: string, description?: string): Skill {
  if (!code) code = createSkillCode();
  if (!name) name = `${code}-${Math.floor(Math.random() * 10000)}`;
  if (!description) description = `${code}-${Math.floor(Math.random() * 10000)}`;
  return { code, name, description };
}

function fillStatisticsWithZero(combatant: Card) {
  combatant.damage = Damage('PHYSICAL', 0);
  combatant.armor = Armor('PHYSICAL', 0);
  combatant.health = Health(0, 0);
}

function fillStatistics(combatant: Card,
  damage?: number, damageType?: DamageType, 
  armor?: number, armorType?: ArmorType, 
  health?: number, maxHealth?: number
) {
  fillStatisticsWithLimits(combatant, 
    damage, damageType, undefined,
    armor, armorType, undefined,
    health, maxHealth, undefined
  );
}

function fillStatisticsWithLimits(combatant: Card,
  damage?: number, damageType?: DamageType, damageLimit?: number,
  armor?: number, armorType?: ArmorType, armorLimit?: number,
  health?: number, maxHealth?: number, healthLimit?: number
) {
  if (!damageLimit) damageLimit = 100;
  if (!damage) damage = Math.floor(Math.random() * damageLimit);
  if (!damageType) damageType = getRandomDamageType();
  if (!armorLimit) armorLimit = 100;
  if (!armor) armor = Math.floor(Math.random() * armorLimit);
  if (!armorType) armorType = getRandomArmorType();
  if (!healthLimit) healthLimit = 999;
  if (!health) health = Math.floor(Math.random() * healthLimit);
  if (!maxHealth) maxHealth = health;
  combatant.damage = Damage(damageType, damage);
  combatant.armor = Armor(armorType, armor);
  combatant.health = Health(health, maxHealth);
}

const getRandomCardType = (): CardType => {
  const cardTypes: CardType[] = ["EQUIPMENT", "LEADER", "SPELL", "WARRIOR"];
  return cardTypes[Math.floor(Math.random()*cardTypes.length)];
}

const getRandomCardRarity = (): CardRarity => {
  const cardRarities: CardRarity[] = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY", "MITHIC"];
  return cardRarities[Math.floor(Math.random()*cardRarities.length)];
}

const getRandomDamageType = (): DamageType => {
  const damageTypes: DamageType[] = ["PHYSICAL", "MAGIC", "TRUE"];
  return damageTypes[Math.floor(Math.random()*damageTypes.length)];
}
const getRandomArmorType = (): ArmorType => {
  const armorTypes: ArmorType[] = ["PHYSICAL", "MAGIC"];
  return armorTypes[Math.floor(Math.random()*armorTypes.length)];
}

const shouldSpawn = (spawnRateInPercent: number = 50) => {
  return Math.random() < (spawnRateInPercent / 100);
}

const cardFactory = {
  createCardCode,
  createCard,
  createLeaderCard,
  createWarriorCard,
  createEquipmentCard,
  createSpellCard,
  getRandomCardType,
  getRandomCardRarity,
  getRandomDamageType,
  getRandomArmorType
};

export default cardFactory;
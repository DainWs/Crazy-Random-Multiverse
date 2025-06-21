import Card, { CardCode, CardRarity, CardType } from "@/domain/Card";
import { Armor, ArmorType, Damage, DamageType, Health } from "@/domain/Statistics";

/*
type CardAbstractFactoryMethod = (code: CardCode, name?: string, description?: string) => Card;
const typeBasedFactoryMethods = new Map<CardType, CardAbstractFactoryMethod>();
typeBasedFactoryMethods.set("LEADER", createLeaderCard);
typeBasedFactoryMethods.set("WARRIOR", createWarriorCard);
typeBasedFactoryMethods.set("EQUIPMENT", createEquipmentCard);
typeBasedFactoryMethods.set("SPELL", createSpellCard);

*/
const createCardCode = (value?: number, type?: CardType): CardCode => {
  if (!value) value = Math.floor(Math.random() * 10000);
  if (!type) type = getRandomCardType();
  return new CardCode(value, type);
}

/*
const createCard = (code?: CardCode, name?: string, description?: string) => {
  if (!code) code = createCardCode();
  const cardFactoryMethod = typeBasedFactoryMethods.get(code.type);
  if (!cardFactoryMethod) throw new Error(`CardAbstractFactoryMethod should not be undefined for type ${code}`);
  return cardFactoryMethod(code, name, description);
}
*/

/** Purposely function: typeBasedFactoryMethods binding  */
function createLeaderCard(code?: CardCode, name?: string, description?: string, 
  damage?: number, damageType?: DamageType, 
  armor?: number, armorType?: ArmorType, 
  health?: number, maxHealth?: number
): Card {
  if (!code) code = createCardCode(undefined, 'LEADER');
  const card = fillCard(code, 'LEADER', name, description);
  fillStatistics(card, damage, damageType, armor, armorType, health, maxHealth);
  return card;
}

/** Purposely function: typeBasedFactoryMethods binding  */
function createWarriorCard(options: {code?: CardCode, name?: string, description?: string, 
  rarity?: CardRarity, 
  damage?: number, damageType?: DamageType, 
  armor?: number, armorType?: ArmorType, 
  health?: number, maxHealth?: number
}): Card {
  if (!options.code) options.code = createCardCode(undefined, 'WARRIOR');
  if (!options.rarity) options.rarity = getRandomCardRarity();
  const card = fillCard(options.code, 'WARRIOR', options.name, options.description, options.rarity);
  fillStatistics(card, options.damage, options.damageType, options.armor, options.armorType, options.health, options.maxHealth);
  return card;
}

/** Purposely function: typeBasedFactoryMethods binding  */
function createEquipmentCard(code?: CardCode, name?: string, description?: string, 
  damage?: number, damageType?: DamageType, 
  armor?: number, armorType?: ArmorType, 
  health?: number, maxHealth?: number
): Card {
  if (!code) code = createCardCode(undefined, 'EQUIPMENT');
  const card = fillCard(code, 'EQUIPMENT', name, description);
  fillStatistics(card, damage, damageType, armor, armorType, health, maxHealth);
  return card;
}

/** Purposely function: typeBasedFactoryMethods binding  */
function createSpellCard(code?: CardCode, name?: string, description?: string): Card {
  if (!code) code = createCardCode(undefined, 'SPELL');
  return fillCard(code, 'SPELL', name, description);
}

function fillCard(code: CardCode, cardType: CardType, name?: string, description?: string, rarity?: CardRarity) {
  if (!name) name = `${cardType}-${Math.floor(Math.random() * 10000)}`;
  if (!description) description = `${cardType}-${Math.floor(Math.random() * 10000)}`;
  const card = new Card(code, cardType);
  card.name = name;
  card.description = description;
  card.rarity = rarity;
  return card;
}

function fillStatistics(combatant: Card,
  damage?: number, damageType?: DamageType, 
  armor?: number, armorType?: ArmorType, 
  health?: number, maxHealth?: number
) {
  if (!damage) damage = Math.floor(Math.random() * 100);
  if (!damageType) damageType = getRandomDamageType();
  if (!armor) armor = Math.floor(Math.random() * 100);
  if (!armorType) armorType = getRandomArmorType();
  if (!health) health = Math.floor(Math.random() * 1000);
  if (!maxHealth) maxHealth = Math.floor(Math.random() * 100) + health;
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

export default {
  createCardCode,
  //createCard,
  createLeaderCard,
  createWarriorCard,
  createEquipmentCard,
  createSpellCard,
  getRandomCardType,
  getRandomCardRarity,
  getRandomDamageType,
  getRandomArmorType
}
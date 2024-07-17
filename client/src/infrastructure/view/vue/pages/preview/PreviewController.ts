import Card, { ArmorType, CardCode, CardRarity, CardType, DamageType } from "@/domain/models/Card";
import router from '@vue-root/configuration/router';

type CardAbstractFactoryMethod = (code: CardCode, name?: string, description?: string) => Card;
const typeBasedFactoryMethods = new Map<CardType, CardAbstractFactoryMethod>();
typeBasedFactoryMethods.set("LEADER", createLeaderCard);
typeBasedFactoryMethods.set("WARRIOR", createWarriorCard);
typeBasedFactoryMethods.set("EQUIPMENT", createEquipmentCard);
typeBasedFactoryMethods.set("SPELL", createSpellCard);

const generateCards = (count: number): Card[] => {
  const cards: Card[] = [];
  for (let i = 0; i < count; i++) {
    cards.push(createCard());
  }

  return cards;
}

function createCard(code?: CardCode, name?: string, description?: string) {
  if (!code) code = createCardCode();
  const cardFactoryMethod = typeBasedFactoryMethods.get(code.type);
  if (!cardFactoryMethod) throw new Error(`CardAbstractFactoryMethod should not be undefined for type ${code}`);
  return cardFactoryMethod(code, name, description);
}

function createCardCode(value?: number, type?: CardType): CardCode {
  if (!value) value = Math.floor(Math.random() * 10000);
  if (!type) type = getRandomCardType();
  return new CardCode(value, type);
}

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
function createWarriorCard(code?: CardCode, name?: string, description?: string, 
  rarity?: CardRarity, 
  damage?: number, damageType?: DamageType, 
  armor?: number, armorType?: ArmorType, 
  health?: number, maxHealth?: number
): Card {
  if (!code) code = createCardCode(undefined, 'WARRIOR');
  if (!rarity) rarity = getRandomCardRarity();
  const card = fillCard(code, 'WARRIOR', name, description, rarity);
  fillStatistics(card, damage, damageType, armor, armorType, health, maxHealth);
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
  if (!name) name = `cardname-${cardType}-${Math.floor(Math.random() * 10000)}`;
  if (!description) description = `description--${cardType}-${Math.floor(Math.random() * 10000)}`;
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
  combatant.damage = damage;
  combatant.damageType = damageType;
  combatant.armor = armor;
  combatant.armorType = armorType;
  combatant.health = health;
  combatant.maxHealth = maxHealth;
}

function getRandomCardType(): CardType {
  const cardTypes: CardType[] = ["EQUIPMENT", "LEADER", "SPELL", "WARRIOR"];
  return cardTypes[Math.floor(Math.random()*cardTypes.length)];
}

function getRandomCardRarity(): CardRarity {
  const cardRarities: CardRarity[] = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY", "MITHIC"];
  return cardRarities[Math.floor(Math.random()*cardRarities.length)];
}

function getRandomDamageType(): DamageType {
  const damageTypes: DamageType[] = ["PHYSICAL", "MAGIC", "TRUE"];
  return damageTypes[Math.floor(Math.random()*damageTypes.length)];
}

function getRandomArmorType(): ArmorType {
  const armorTypes: ArmorType[] = ["PHYSICAL", "MAGIC"];
  return armorTypes[Math.floor(Math.random()*armorTypes.length)];
}

const onBackClick = () => {
  router.push('/');
};

export default {
  generateCards,
  onBackClick
};

export type CardType = 'LEADER' | 'WARRIOR' | 'EQUIPMENT' | 'SPELL';

export type CardCode = {
    value: Number,
    type: CardType
};

export type CardRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MITHIC';
export type DamageType = 'PHYSICAL' | 'MAGIC' | 'TRUE';
export type ArmorType = 'PHYSICAL' | 'MAGIC';

export type Card = {
    code: CardCode,
    name: String,
    description: String,
    type: CardType,
    rarity: CardRarity?,
    damage: Number?,
    damageType: DamageType?,
    armor: Number?,
    armorType: ArmorType?,
    health: Number?,
    maxHealth: Number?
}


export declare function isCardOfType(card: Card, type: CardType) : boolean; 
export declare function isCardACombatant(card: Card) : boolean;
export declare function hasCardStatistics(card: Card) : boolean;
export declare function getCardTypeDescription(card: Card) : String;
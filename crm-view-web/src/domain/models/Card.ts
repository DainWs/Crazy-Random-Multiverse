type CardType = 'LEADER' | 'WARRIOR' | 'EQUIPMENT' | 'SPELL';
type CardRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MITHIC';
type DamageType = 'PHYSICAL' | 'MAGIC' | 'TRUE';
type ArmorType = 'PHYSICAL' | 'MAGIC';

class CardCode {
    public value: Number;
    public type: CardType;

    public constructor(value: Number, type: CardType) {
        this.value = value;
        this.type = type;
    }

    public equals(that: CardCode) {
        return (this.value == that.value && this.type == that.type);
    }
};

class Card {
    public code: CardCode;
    public name: String;
    public description: String;
    public type: CardType;
    public rarity?: CardRarity;
    public damage?: Number;
    public damageType?: DamageType;
    public armor?: Number;
    public armorType?: ArmorType;
    public health?: Number;
    public maxHealth?: Number;

    public constructor(code: CardCode, type: CardType) {
        this.code = code;
        this.type = type;
        this.name = '';
        this.description = '';
    }

    public isType(type: CardType) : boolean {
        return this.type === type
    }

    public isCombatant() : boolean {
        return this.isType('LEADER') || this.isType('WARRIOR');
    }

    public hasStatistics() : boolean {
        return this.isCombatant() || this.isType('EQUIPMENT');
    }

    public getTypeDescription() : String {
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
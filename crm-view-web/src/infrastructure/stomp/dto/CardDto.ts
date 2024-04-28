type CardTypeDto = 'LEADER' | 'WARRIOR' | 'EQUIPMENT' | 'SPELL';

type CardCodeDto = {
    value: Number,
    type: CardTypeDto
};

type CardRarityDto = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MITHIC';
type DamageTypeDto = 'PHYSICAL' | 'MAGIC' | 'TRUE';
type ArmorTypeDto = 'PHYSICAL' | 'MAGIC';

type CardDto = {
    code : CardCodeDto
    name : String
    description : String
    type : CardTypeDto
    rarity : CardRarityDto
    damage : Number
    damageType : DamageTypeDto
    armor : Number
    armorType : ArmorTypeDto
    health : Number
    maxHealth : Number
}

export default CardDto;
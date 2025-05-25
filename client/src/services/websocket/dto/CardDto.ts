type CardTypeDto = 'LEADER' | 'WARRIOR' | 'EQUIPMENT' | 'SPELL';

type CardCodeDto = {
  code: number;
  type: CardTypeDto;
};

type CardRarityDto = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MITHIC';
type DamageTypeDto = 'PHYSICAL' | 'MAGIC' | 'TRUE';
type ArmorTypeDto = 'PHYSICAL' | 'MAGIC';

type CardDto = {
  code: CardCodeDto;
  name: string;
  description: string;
  type: CardTypeDto;
  rarity: CardRarityDto;
  damage: number;
  damageType: DamageTypeDto;
  armor: number;
  armorType: ArmorTypeDto;
  health: number;
  maxHealth: number;
};

export default CardDto;

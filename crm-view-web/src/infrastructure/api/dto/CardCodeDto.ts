type CardTypeDto = 'LEADER' | 'WARRIOR' | 'EQUIPMENT' | 'SPELL';

class CardCodeDto {
  public value: number;
  public type: CardTypeDto;

  public constructor(value: number, type: CardTypeDto) {
    this.value = value;
    this.type = type;
  }
}

export {CardTypeDto};
export default CardCodeDto;

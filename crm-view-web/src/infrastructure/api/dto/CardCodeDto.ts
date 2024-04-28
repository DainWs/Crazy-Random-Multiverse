type CardTypeDto = 'LEADER' | 'WARRIOR' | 'EQUIPMENT' | 'SPELL';

class CardCodeDto {
    public value: Number;
    public type: CardTypeDto;

    public constructor(value: Number, type: CardTypeDto) {
        this.value = value;
        this.type = type;
    }
}

export { CardTypeDto };
export default CardCodeDto;
import Player, { PlayerCode } from '@/domain/models/Player';
import Card, { CardCode } from '@/domain/models/Card';

class Hand {
  public owner: Player;
  public cards: Card[];

  public constructor(owner: Player) {
    this.owner = owner;
    this.cards = new Array();
  }

  public isOwner(playerCode: PlayerCode) {
    return this.owner.code == playerCode;
  }

  public addCard(card: Card): void {
    this.cards.push(card);
  }

  public removeCard(cardToRemove: Card): void {
    const index = this.cards.findIndex((card) => card.equals(cardToRemove));
    this.cards.splice(index, 1);
  }

  public findCard(cardCode: CardCode): Card | undefined {
    return this.cards.find((card) => card.code.equals(cardCode));
  }
}

export default Hand;

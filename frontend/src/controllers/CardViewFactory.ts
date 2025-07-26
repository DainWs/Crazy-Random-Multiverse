import CardController from "@/controllers/CardController";
import Card from "@/domain/Card";
import CardView from "@/game/cards/CardView";

class CardViewFactory {
  private cardController: CardController;

  public constructor(cardController: CardController) {
    this.cardController = cardController;
  }

  public createCardView(scene: Phaser.Scene, card: Card): CardView {
    const cardView = new CardView(scene, this.cardController, card);
    return cardView;
  }
}

export default CardViewFactory;
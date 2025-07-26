import Card from "@/domain/Card";
import CardView from "@/game/cards/CardView";
import HandView from "@/game/hand/HandView";

class HandController {
  private scene: Phaser.Scene;

  public readonly handView: HandView;
  
  public constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.handView = new HandView(scene);
    this.scene.children.add(this.handView);

    this.scene.events.on('grabCard', this.onGrabCard.bind(this));
  }

  public addCards(...cards: Card[]) {
    const cardsToAdd = this.createCardViews(cards);
    this.handView.addCards(...cardsToAdd);
  }

  private createCardViews(cards: Card[]): CardView[] {
    return cards.map(card => this.createCardView(card));
  }

  private createCardView(card: Card): CardView {
    const cardView = new CardView(this.scene, card);
    return cardView;
  }

  public onGrabCard(event: InteractionEvent<Card>) {
    const cardView = this.findCardViewOf(event.source);
    if (cardView) {
      event.onComplete(() => this.handView.removeCard(cardView));
    }
  }

  private findCardViewOf(card: Card): CardView | undefined {
    const cardViews = this.handView.getCards();
    return cardViews.find(cardView => cardView.card.equals(card));
  }
}

export default HandController;
import CardViewFactory from "@/controllers/CardViewFactory";
import Card from "@/domain/Card";
import CardView from "@/game/cards/CardView";
import HandView from "@/game/hand/HandView";
import { GameScene } from "@/scenes/Game";

class HandController {
  private readonly scene: GameScene;
  private readonly cardViewFactory: CardViewFactory;

  private handView: HandView;

  public constructor(scene: GameScene, cardViewFactory: CardViewFactory) {
    this.scene = scene;
    this.cardViewFactory = cardViewFactory;
  }

  public init() {
    this.handView = new HandView(this.scene);

    this.scene.children.add(this.handView);
    this.scene.events.on('grabCard', this.onGrabCard.bind(this));
  }

  public addCards(...cards: Card[]) {
    const cardsToAdd = this.createCardViews(cards);
    this.handView.addCards(...cardsToAdd);
  }

  private createCardViews(cards: Card[]): CardView[] {
    return cards.map(card => this.cardViewFactory.createCardView(this.scene, card));
  }

  public clearCards() {
    this.handView.clearCards();
  }

  // Useless?
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
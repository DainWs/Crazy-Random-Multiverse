import type { GameScene } from "@/scenes/Game";
import type CardView from "@/game/cards/CardView";
import type Card from "@/domain/Card";
import CardViewFactory from "@/controllers/CardViewFactory";
import HandView from "@/game/hand/HandView";

class HandController {
  private readonly scene: GameScene;

  private handView: HandView;

  public constructor(scene: GameScene) {
    this.scene = scene;
  }

  public init() {
    this.handView = new HandView(this.scene);

    this.scene.children.add(this.handView);
    this.scene.events.on('grabCard', this.onGrabCard.bind(this));
    this.scene.input.on('gameout', () => this.handView.disableCardListeners(false));
    this.scene.input.on('gameover', () => this.handView.enableCardListeners());
  }

  public update() {
    this.handView.updateBounds();
  }

  public addCards(...cards: Card[]) {
    const cardsToAdd = this.createCardViews(cards);
    this.handView.addCards(...cardsToAdd);
  }

  private createCardViews(cards: Card[]): CardView[] {
    return cards.map(card => CardViewFactory.createCardView(this.scene, card));
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
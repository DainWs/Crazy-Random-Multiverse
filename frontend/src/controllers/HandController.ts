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

  /** Shows the hand as it is, without animating it (VIEW-8). */
  public restoreCards(cards: Card[]) {
    this.clearCards();
    this.handView.restoreCards(...this.createCardViews(cards));
  }

  /** Animates the cards that arrived and removes the ones that left, keeping the rest in place. */
  public syncCards(cards: Card[]) {
    const shownViews = this.handView.getCards();
    const leftViews = shownViews.filter((view) => !cards.some((card) => card.equals(view.card)));
    const arrivedCards = cards.filter((card) => !shownViews.some((view) => view.card.equals(card)));

    this.destroyCardViews(leftViews);
    if (arrivedCards.length > 0) {
      this.addCards(...arrivedCards);
    }
  }

  private createCardViews(cards: Card[]): CardView[] {
    return cards.map(card => CardViewFactory.createCardView(this.scene, card));
  }

  public clearCards() {
    const views = [...this.handView.getCards()];
    this.handView.clearCards();
    this.destroyCardViews(views);
  }

  private destroyCardViews(views: CardView[]) {
    for (const view of views) {
      this.handView.removeCard(view);
      this.scene.tweens.killTweensOf(view);
      view.destroy();
    }
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
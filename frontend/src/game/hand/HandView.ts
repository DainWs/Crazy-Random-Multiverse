import InteractiveObjectManager from "@/core/interactions/InteractiveObjectManager";
import { showDebugBoxes } from "@/env";
import CardView from "@/game/cards/CardView";
import HandAnimator from "@/game/hand/HandAnimator";
import HandInteractionManager from "@/game/hand/HandInteractionManager";
import HandLayoutHelper, { SpaceBetweenCardOptions } from "@/game/hand/HandLayoutHelper";

interface HandViewOptions {
  spaceBetweenCards?: SpaceBetweenCardOptions;
  maxCards: number;
}

const defaultOptions: HandViewOptions = {
  maxCards: 10
};

const NONE_CARD_IS_HOVER: number = Number.MAX_VALUE;

class HandView extends Phaser.GameObjects.Container {
  private readonly options: HandViewOptions;
  private readonly interactionManager: HandInteractionManager;
  private readonly layoutHelper: HandLayoutHelper;
  private readonly animator: HandAnimator;

  private cardsDepth: number;
  private hoverIndex: number;
  private cards: CardView[];
  private cardListenersEnabled: boolean;

  constructor(
    scene: Phaser.Scene,
    options: Partial<HandViewOptions> = defaultOptions
  ) {
    super(scene);
    this.options = { ...defaultOptions, ...options };
    this.interactionManager = new HandInteractionManager();
    this.layoutHelper = new HandLayoutHelper(this.options.maxCards, this.options.spaceBetweenCards);
    this.animator = new HandAnimator();
     this.hoverIndex = NONE_CARD_IS_HOVER;
    this.cards = [];
    this.cardListenersEnabled = true;
    this.scale = 1
    this.depth = 499;
    this.cardsDepth = this.depth + 1;
    this.setScrollFactor(0);

    this.initializeView();
    this.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.width, this.height), Phaser.Geom.Rectangle.Contains);
    this.scene.add.existing(this);
    InteractiveObjectManager.registerGameObject(this.scene, this);
  }

  private initializeView() {
    const camera = this.scene.cameras.main;
    camera.on(Phaser.Cameras.Scene2D.Events.FOLLOW_UPDATE, this.updatePositionFromCamera);
    this.updatePositionFromCamera();

    if (showDebugBoxes) {
      this.scene.add.rectangle(this.x, this.y, this.width, this.height, 0xFFFF00)
    }
  }

  private updatePositionFromCamera() {
    const camera = this.scene.cameras.main;
    this.layoutHelper.setBoundPositionTo(camera);
    this.x = this.layoutHelper.handBounds.x;
    this.y = this.layoutHelper.handBounds.y;
    this.width = this.layoutHelper.handBounds.width;
    this.height = this.layoutHelper.handBounds.height;
    this.setSize(this.width, this.height);
    
    if (this.input && this.input.hitArea) {
      (this.input.hitArea as Phaser.Geom.Rectangle).setTo(0, 0, this.width, this.height);
    }
  }

  public addCards(...incomingCards: CardView[]) {
    const newCardLength = this.cards.length + incomingCards.length;

    for (let i = this.cards.length; i < newCardLength; i++) {
      const incomingCard = incomingCards[i];

      const slotPosition = this.layoutHelper.calculateSlotPositionFromIndex(i, newCardLength);
      incomingCard.setScrollFactor(0);
      incomingCard.setOriginalPosition(slotPosition.x, slotPosition.y);
      incomingCard.setOriginalDepth(this.cardsDepth + i);

      this.interactionManager.attachListeners(this, incomingCard);
      this.cards[i] = incomingCard;
    }

    const onCompleteAnimation = () => this.updateCards();
    this.animator.animateIncomingCards(this.cards, incomingCards, onCompleteAnimation);
  }

  public removeCard(card: CardView) {
    if (!this.cards.includes(card)) return;
    this.interactionManager.deattachListeners(this, card);
    card.setScrollFactor(1);

    const index = this.cards.indexOf(card);
    if (this.hoverIndex == index) {
      this.hoverIndex = NONE_CARD_IS_HOVER;
    }

    this.cards.splice(index, 1);
    this.updateCards();
  }

  public clearCards() {
    this.cards.forEach(card => this.removeCard(card));
  }

  public updateCards() {
    const cardLength = this.cards.length;
    console.log("updateCards", cardLength);

    for (let i = 0; i < this.cards.length; i++) {
      const position = this.layoutHelper.calculateSlotPositionFromIndex(i, cardLength);

      const cardView = this.cards[i];
      const newDepth = this.cardsDepth + i;
      cardView.setDepth(newDepth);
      cardView.setOriginalDepth(newDepth);
      cardView.setOriginalPosition(position.x, position.y);
      this.animator.sliceCard(cardView, position.x, position.y);
    }
  }

  public onHoverCard(hoverCard: CardView) {
    if (!this.cardListenersEnabled) return;
    const hoverIndex = this.cards.indexOf(hoverCard);

    if (hoverIndex != -1 && (this.hoverIndex === NONE_CARD_IS_HOVER || this.hoverIndex !== hoverIndex)) {
      this.hoverIndex = hoverIndex;
      this.sliceCardsToShowHoverIndex();
    }
  }

  public onUnhoverCard(unhoverCard: CardView) {
    if (!this.cardListenersEnabled) return;
    const unhoverIndex = this.cards.indexOf(unhoverCard);

    if (this.hoverIndex === unhoverIndex) {
      this.hoverIndex = NONE_CARD_IS_HOVER;
      this.sliceCardsToShowHoverIndex();
    }
  }

  private sliceCardsToShowHoverIndex() {
    const xOffset = this.layoutHelper.calculateXOffsetForSlicedCard(this.cards.length);
  
    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];
      let x = card.getOriginalPosition().x;
      let y = card.getOriginalPosition().y;

      if (i > this.hoverIndex) x += xOffset;
      this.animator.sliceCard(card, x, y);
    }
  }

  public getCards() {
    return this.cards;
  }

  public enableCardListeners() {
    this.cardListenersEnabled = true;
  }

  public disableCardListeners() {
    this.cardListenersEnabled = false;
    this.hoverIndex = NONE_CARD_IS_HOVER;
    this.sliceCardsToShowHoverIndex();
  }

  protected preDestroy(): void {
    super.preDestroy();
    this.scene.cameras.main.off(Phaser.Cameras.Scene2D.Events.FOLLOW_UPDATE, this.updatePositionFromCamera);
  }
}

export default HandView;
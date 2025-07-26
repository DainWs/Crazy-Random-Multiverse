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

  private hoverIndex: number;
  private cards: CardView[];

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
    this.scale = 1
    this.depth = 500;

    this.initializeView();

    this.scene.add.existing(this)
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
    console.log(arguments);

    const camera = this.scene.cameras.main;
    this.layoutHelper.setBoundPositionTo(camera);
    this.x = this.layoutHelper.handBounds.x;
    this.y = this.layoutHelper.handBounds.y;
    this.width = this.layoutHelper.handBounds.width
    this.height = this.layoutHelper.handBounds.height;
  }

  public addCards(...incomingCards: CardView[]) {
    const newCardLength = this.cards.length + incomingCards.length;

    for (let i = this.cards.length; i < newCardLength; i++) {
      const incomingCard = incomingCards[i];

      const slotPosition = this.layoutHelper.calculateSlotPositionFromIndex(i, newCardLength);
      incomingCard.setOriginalPosition(slotPosition.x, slotPosition.y);
      incomingCard.setOriginalDepth(this.depth + i);

      this.interactionManager.attachListeners(this, incomingCard);
      this.cards[i] = incomingCard;
    }

    const onCompleteAnimation = () => this.updateCards();
    this.animator.animateIncomingCards(this.cards, incomingCards, onCompleteAnimation);
  }

  public removeCard(card: CardView) {
    if (!this.cards.includes(card)) return;
    this.interactionManager.deattachListeners(this, card);

    const index = this.cards.indexOf(card);
    this.cards.splice(index, 1);
    this.updateCards();
  }

  public updateCards() {
    const cardLength = this.cards.length;

    for (let i = 0; i < this.cards.length; i++) {
      const position = this.layoutHelper.calculateSlotPositionFromIndex(i, cardLength);
      this.animator.sliceCard(this.cards[i], position.x, position.y);
    }
  }

  public onHoverCard(hoverCard: CardView) {
    const hoverIndex = this.cards.indexOf(hoverCard);

    if (hoverIndex != -1 && (this.hoverIndex === NONE_CARD_IS_HOVER || this.hoverIndex !== hoverIndex)) {
      this.hoverIndex = hoverIndex;
      this.sliceCardsToShowHoverIndex();
    }
  }

  public onUnhoverCard(unhoverCard: CardView) {
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
      let x = card.x;
      let y = card.y;

      if (i > this.hoverIndex) x += xOffset;
      this.animator.sliceCard(card, x, y);
    }
  }

  public getCards() {
    return this.cards;
  }
}

export default HandView;
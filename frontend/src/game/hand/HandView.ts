import InteractiveObjectManager from "@/core/interactions/InteractiveObjectManager";
import { showDebugBoxes } from "@/env";
import CardView from "@/game/cards/CardView";
import HandAnimator from "@/game/hand/HandAnimator";
import HandInteractionManager from "@/game/hand/HandInteractionManager";
import HandLayoutHelper, { SpaceBetweenCardOptions } from "@/game/hand/HandLayoutHelper";
import { GameScene } from "@/scenes/Game";

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
  private isExpanded: boolean;

  constructor(
    scene: GameScene,
    options: Partial<HandViewOptions> = defaultOptions
  ) {
    super(scene);
    this.options = { ...defaultOptions, ...options };
    this.interactionManager = new HandInteractionManager();
    this.layoutHelper = new HandLayoutHelper(scene.cameraSystem, this.options.maxCards, this.options.spaceBetweenCards);
    this.animator = new HandAnimator();
    this.hoverIndex = NONE_CARD_IS_HOVER;
    this.cards = [];
    this.cardListenersEnabled = true;
    this.isExpanded = false;
    this.scale = 1
    this.depth = 499;
    this.cardsDepth = this.depth + 1;
    
    this.initializeView();
    this.setInteractive(this.layoutHelper.getInteractiveBounds(), Phaser.Geom.Rectangle.Contains);
    scene.add.existing(this);
    scene.cameraSystem.showOnlyInUICamera(this);
    InteractiveObjectManager.registerGameObject(this.scene, this);
  }

  private initializeView() {
    this.scene.cameras.main.on(Phaser.Cameras.Scene2D.Events.ZOOM_COMPLETE, this.updateBounds, this);
    this.updateBounds();

    if (showDebugBoxes) {
      const debugBox = this.scene.add.rectangle(0, 0, this.width, this.height, 0xFFFF00)
      debugBox.setDepth(- 10);
      this.add(debugBox);
    }
  }

  private updateBounds() {
    this.layoutHelper.updateBounds();
    const { x, y, width, height } = this.getExpandedLayoutBounds();

    this.setPosition(x, y);
    this.setSize(width, height);
    
    if (this.input && this.input.hitArea) {
      (this.input.hitArea as Phaser.Geom.Rectangle).setTo(0, 0, width, height);
    }
  }

  public addCards(...incomingCards: CardView[]) {
    const newCardLength = this.cards.length + incomingCards.length;

    for (let i = this.cards.length; i < newCardLength; i++) {
      const slotPosition = this.layoutHelper.calculateSlotPositionFromIndex(i, newCardLength);

      const incomingCard = incomingCards[i];
      incomingCard.setOriginalPosition(slotPosition.x, slotPosition.y);
      incomingCard.setOriginalDepth(this.cardsDepth + i);
      console.log(this.cardsDepth + i)

      this.interactionManager.attachListeners(this, incomingCard);
      this.cards[i] = incomingCard;
      this.add(incomingCard);
    }

    // From TOP of camera
    const fromPoint = {
      x: 0, 
      y: -(this.y + this.height + CardView.HEIGHT) 
    };

    const onCompleteAnimation = () => this.updateCards();
    this.animator.animateIncomingCards(fromPoint, this.cards, incomingCards, onCompleteAnimation);
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
    this.remove(card, false);
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
    this.isExpanded = true;
    const { y } = this.getExpandedLayoutBounds();
    this.animator.animateHandExpansion(this, y);

    const hoverIndex = this.cards.indexOf(hoverCard);
    if (hoverIndex != -1 && (this.hoverIndex === NONE_CARD_IS_HOVER || this.hoverIndex !== hoverIndex)) {
      this.hoverIndex = hoverIndex;
      this.sliceCardsToShowHoverIndex();
    }
  }

  public onUnhoverCard(unhoverCard: CardView) {
    if (!this.cardListenersEnabled) return;
    this.isExpanded = false;
    const { y } = this.getExpandedLayoutBounds();
    this.animator.animateHandExpansion(this, y);

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

  private getExpandedLayoutBounds() {
    const { x, y, width, height } = this.layoutHelper.handBounds;

    const hidePercent = 0.75;
    const hiddenSize = CardView.HEIGHT * hidePercent;
    let expandedY = y + hiddenSize;
    if (this.isExpanded) {
      expandedY -= hiddenSize;
    }

    return { x, y: expandedY, width, height };
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
}

export default HandView;
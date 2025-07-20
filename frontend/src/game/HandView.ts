import { showDebugBoxes } from "@/env";
import CardView from "@/game/cards/CardView";

type SpaceBetweenCardOptions = {
  min: number;
  max: number;
  decayFactor: number;
}

interface HandViewOptions {
  spaceBetweenCards: SpaceBetweenCardOptions;
  horizontalSlideMinCards: number;
  maxCards: number;
}

const defaultOptions: HandViewOptions = {
  spaceBetweenCards: {
    min: 20,
    max: 250,
    decayFactor: 0.2
  },
  horizontalSlideMinCards: 2,
  maxCards: 10
};

type HandBounds = {
  x: number;
  y: number;
  margin: number;
  width: number;
  height: number;
  spaceBetweenCards: number;
}

const NONE_CARD_IS_HOVER: number = Number.MAX_VALUE;

class HandView extends Phaser.GameObjects.Container {
  private readonly options: HandViewOptions;
  private lastAddedCardTimeout?: NodeJS.Timeout;

  private hoverIndex: number;
  private cards: CardView[];

  constructor(
    scene: Phaser.Scene,
    options: Partial<HandViewOptions> = defaultOptions
  ) {
    super(scene);
    this.options = { ...defaultOptions, ...options };
    this.hoverIndex = NONE_CARD_IS_HOVER;
    this.cards = [];
    this.scale = 1
    this.depth = 500;

    this.initializeView();

    this.scene.add.existing(this)
  }

  private initializeView() {
    const bounds = this.calculateHandBounds(this.options.maxCards);

    this.width = bounds.width
    this.height = bounds.height;

    const camera = this.scene.cameras.main;
    this.x = camera.centerX;
    this.y = (camera.y + camera.height) - this.height / 2;

    camera.on(Phaser.Cameras.Scene2D.Events.FOLLOW_UPDATE, this.updatePositionFromCamera);

    if (showDebugBoxes) {
      this.scene.add.rectangle(this.x, this.y, this.width, this.height, 0xFFFF00)
    }
  }

  private updatePositionFromCamera() {
    console.log(arguments);
  }

  public addCards(...cards: CardView[]) {
    const handBounds = this.calculateHandBounds(this.cards.length + cards.length);
    [...this.cards, ...cards].forEach(card => card.disableInteractive());

    for (const card of cards) {
      this.addCard(card, handBounds);
    }

    const refreshDelay = 200 * (this.cards.length + 1);
    setTimeout(() => {
      this.cards.forEach(card => card.setInteractive());
      this.updateCards();
    }, refreshDelay);
  }

  private addCard(card: CardView, handBounds: HandBounds) {
    const index = this.cards.length;
    console.log(index)
    this.cards[index] = card;

    const affectedByHover = index > this.hoverIndex;
    const { x, y } = this.calculateSlotPositionFromIndex(index, affectedByHover, handBounds);
    card.setOriginalPosition(x, y);
    card.setOriginalDepth(this.depth + index);
    console.log(200 * index)
    card.applyTween('move_to_hand', x, y, 200 * index);

    card.on("pointerover", () => this.onSlotHover(index));
    card.on("pointerout", () => this.onSlotHoverEnd(index));
  }

  public removeCard(card: CardView) {
    if (!this.cards.includes(card)) return;

    const index = this.cards.indexOf(card);
    card.off("pointerover", () => this.onSlotHover(index));
    card.off("pointerout", () => this.onSlotHoverEnd(index));
    this.cards.splice(index, 1);
    this.updateCards();
  }

  private onSlotHover(hoverIndex: number) {
    if (this.hoverIndex === NONE_CARD_IS_HOVER || this.hoverIndex !== hoverIndex) {
      this.hoverIndex = hoverIndex;
      this.updateCards();
    }
  }

  private onSlotHoverEnd(unhoverIndex: number) {
    if (this.hoverIndex === unhoverIndex) {
      this.hoverIndex = NONE_CARD_IS_HOVER;
      this.updateCards();
    }
  }

  public updateCards() {
    const handBounds = this.calculateHandBounds();

    for (let i = 0; i < this.cards.length; i++) {
      const affectedByHover = i > this.hoverIndex;
      const { x, y } = this.calculateSlotPositionFromIndex(i, affectedByHover, handBounds);
      this.cards[i].applyTween('hand_horizontal_slide', x, y);
    }

    const bounds = this.getBounds();
    this.width = bounds.width;
    this.height = bounds.height;
  }

  private calculateSlotPositionFromIndex(index: number, affectedByHover: boolean = false, bounds?: HandBounds) {
    if (!bounds) bounds = this.calculateHandBounds();

    let xOffset = CardView.WIDTH/2 + (index * bounds.spaceBetweenCards);
    if (affectedByHover) {
      xOffset += CardView.WIDTH - bounds.spaceBetweenCards;
    }

    const x = bounds.x + bounds.margin + xOffset;
    const y = bounds.y;
    return { x, y };
  }

  private calculateHandBounds(cardLength: number = this.cards.length): HandBounds {
    const spaceBetweenCards = this.calculateSpaceBetweenCards(cardLength);
    const totalWidth = (cardLength - 1) * spaceBetweenCards + CardView.WIDTH;
    return {
      x: this.x - this.width/2,
      y: this.y,
      margin: (this.width - totalWidth) / 2,
      width: totalWidth,
      height: CardView.HEIGHT * 1.30,
      spaceBetweenCards
    }
  }

  private calculateSpaceBetweenCards(cardLength: number = this.cards.length) {
    if (cardLength <= 0) return 0;
    
    const option = this.options.spaceBetweenCards;
  
    const spacingRange = option.max - option.min;
    const decay = Math.exp(-option.decayFactor * (cardLength - 1));
    return option.min + spacingRange * decay;
  }
}

export default HandView;
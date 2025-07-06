import { showDebugBoxes } from "@/env";
import CardView from "@/game/cards/CardView";

type SpaceBetweenCardOption = {
  min: number;
  max: number;
  decayFactor: number;
}

interface HandViewOptions {
  spaceBetweenCards?: SpaceBetweenCardOption
  extraSpaceOnHoverCard?: number;
}

type AllHandViewOptions = Required<HandViewOptions>;
const defaultOptions: AllHandViewOptions = {
  spaceBetweenCards: {
    min: 20,
    max: 250,
    decayFactor: 0.2
  },
  extraSpaceOnHoverCard: 50,
};

type HandPreBounds = {
  x: number;
  y: number;
  margin: number;
  spaceBetweenCards: number;
}

class HandView extends Phaser.GameObjects.Container {
  private readonly options: AllHandViewOptions;

  private cards: CardView[];

  constructor(
    scene: Phaser.Scene,
    cards: CardView[],
    options: HandViewOptions = defaultOptions
  ) {
    super(scene);
    this.options = { ...defaultOptions, ...options };
    this.cards = cards;
    this.scale = 1
    this.depth = 500;

    this.defineArea();
    this.initializeView();

    const bounds = this.getBounds();
    this.width = bounds.width;
    this.height = bounds.height;

    this.scene.add.existing(this)
  }

  private defineArea() {
    this.width = CardView.WIDTH * 6;
    this.height = CardView.HEIGHT * 1.30;

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

  private initializeView() {
    const cardLength = this.cards.length;
    const spaceBetweenOption = this.options.spaceBetweenCards;
    const preBounds = calculateBox(cardLength, this, spaceBetweenOption);
    if (showDebugBoxes) this.drawDebugBoxes(preBounds);

    for (let i = 0; i < cardLength; i++) {
      const xOffset = CardView.WIDTH/2 + (i * preBounds.spaceBetweenCards);
      const x = preBounds.x + preBounds.margin + xOffset;
      const y = preBounds.y;
      const slot = this.scene.add.rectangle(x, y, CardView.WIDTH, CardView.HEIGHT, 0x3498db);
      slot.setStrokeStyle(1, 0x000000);
      slot.setOrigin(0.5, 0.5);
      slot.setDepth(this.depth - 5);
      const card = this.cards[i];
      card.setOriginalPosition(x, y);
      card.setOriginalDepth(this.depth + i);
      card.resetPosition();
    }
  }

  private drawDebugBoxes(preBounds: HandPreBounds) {
    const { x, y, margin } = preBounds;
    
    this.scene.add.rectangle(x + margin/2, y + 50, margin, 50, 0xFF00FF).setDepth(999999)
    this.scene.add.rectangle(x + this.width - margin/2, y + 50, margin, 50, 0xFF00FF).setDepth(999999)

    const boxWidth = 50;
    for (let i = 0; i < this.width / boxWidth; i++) {      
      const color = (i % 2) ? 0x000000 : 0xffffff;
      const slot = this.scene.add.rectangle(0, 0, boxWidth, boxWidth, color);
      slot.setStrokeStyle(1, 0x000000);
      slot.setOrigin(0, 0.5);
      slot.setPosition(x + boxWidth * i, this.y);
    }
  }
}

function calculateBox(length: number, hand: HandView, option: SpaceBetweenCardOption): HandPreBounds {
  let spaceBetweenCards = 0;
  if (length > 0) {
    const spacingRange = option.max - option.min;
    const decay = Math.exp(-option.decayFactor * (length - 1));
    spaceBetweenCards = option.min + spacingRange * decay;
  }

  const totalWidth = (length - 1) * spaceBetweenCards + CardView.WIDTH;
  return {
    x: hand.x - hand.width/2,
    y: hand.y,
    margin: (hand.width - totalWidth) / 2,
    spaceBetweenCards
  }
}

export default HandView;
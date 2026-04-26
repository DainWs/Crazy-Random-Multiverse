import CardView from "@/game/cards/CardView";

type Camera2D = Phaser.Cameras.Scene2D.Camera;

type SpaceBetweenCardOptions = {
  min: number;
  max: number;
  decayFactor: number;
}

const defaultOptions: SpaceBetweenCardOptions = {
  min: 20,
  max: 250,
  decayFactor: 0.2
};

class HandLayoutHelper {
  public readonly handBounds: Phaser.Geom.Rectangle;
  public readonly options: SpaceBetweenCardOptions;

  public constructor(maxCards: number, options?: Partial<SpaceBetweenCardOptions>) {
    this.options = { ...defaultOptions, ...options };
    this.handBounds = this.createBounds(maxCards);
  }

  private createBounds(maxCards: number): Phaser.Geom.Rectangle {
    const spaceBetweenCards = this.calculateSpaceBetweenCards(maxCards);
    const totalWidth = (maxCards - 1) * spaceBetweenCards + CardView.WIDTH;
    const totalHeight = CardView.HEIGHT * 1.30;
    return new Phaser.Geom.Rectangle(0, 0, totalWidth, totalHeight);
  }

  public setBoundPositionTo(camera: Camera2D) {
    const paddingX = -100;
    this.handBounds.x = camera.x + paddingX + (this.handBounds.width / 2);
    this.handBounds.y = (camera.y + camera.height) + 180;
  }

  public calculateSlotPositionFromIndex(
    index: number, 
    cardLength: number
  ) {
    const spaceBetweenCards = this.calculateSpaceBetweenCards(cardLength);
    const xOffset = CardView.WIDTH / 2 + (index * spaceBetweenCards);
    
    const x = (this.handBounds.x - this.handBounds.width / 2) + xOffset;
    const y = this.handBounds.y;
    return { x, y };
  }
  
  public calculateSpaceBetweenCards(cardLength: number) {
    if (cardLength <= 0) return 0;
    const spacingRange = this.options.max - this.options.min;
    const decay = Math.exp(-this.options.decayFactor * (cardLength - 1));
    return this.options.min + spacingRange * decay;
  }

  public calculateXOffsetForSlicedCard(cardLength: number) {
    return CardView.WIDTH - this.calculateSpaceBetweenCards(cardLength);
  }

}

export type { SpaceBetweenCardOptions}
export default HandLayoutHelper;
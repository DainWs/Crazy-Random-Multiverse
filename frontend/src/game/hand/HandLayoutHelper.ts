import CameraSystem from "@/core/CameraSystem";
import { Point2D } from "@/domain/Geometry";
import CardView from "@/game/cards/CardView";

type SpaceBetweenCardOptions = {
  min: number;
  max: number;
  decayFactor: number;
}

const defaultOptions: SpaceBetweenCardOptions = {
  min: 20,
  max: 250,
  decayFactor: 0.2,
};

const MARGIN_X = 0;
const MARGIN_Y = 0;

class HandLayoutHelper {
  public readonly handBounds: Phaser.Geom.Rectangle;
  public readonly options: SpaceBetweenCardOptions;
  private readonly cameraSystem: CameraSystem;

  public constructor(cameraSystem: CameraSystem, maxCards: number, options?: Partial<SpaceBetweenCardOptions>) {
    this.cameraSystem = cameraSystem;
    this.options = { ...defaultOptions, ...options };
    this.handBounds = this.createBounds(maxCards);
  }

  private createBounds(maxCards: number): Phaser.Geom.Rectangle {
    const spaceBetweenCards = this.calculateSpaceBetweenCards(maxCards);
    const totalWidth = (maxCards - 1) * spaceBetweenCards + CardView.WIDTH;
    const totalHeight = CardView.HEIGHT;
    const { x, y } = this.calculateHandPosition(totalWidth, totalHeight);

    return new Phaser.Geom.Rectangle(x, y, totalWidth, totalHeight);
  }

  public updateBounds() {
    const totalWidth = this.handBounds.width;
    const totalHeight = this.handBounds.height;

    const { x, y } = this.calculateHandPosition(totalWidth, totalHeight);
    this.handBounds.setPosition(x, y);
  }

  private calculateHandPosition(totalWidth: number, totalHeight: number): Point2D {
    const halfWidth = totalWidth / 2;
    const halfHeight = totalHeight / 2;
    // Position the hand exactly at the bottom-left corner of the UI screen
    const uiCorners = this.cameraSystem.getUIScreenCorners();
    const x = uiCorners.bl.x + (MARGIN_X + halfWidth);
    const y = uiCorners.bl.y - (MARGIN_Y + halfHeight);
    return { x, y };
  }

  public calculateSlotPositionFromIndex(
    index: number, 
    cardLength: number
  ) {
    const spaceBetweenCards = this.calculateSpaceBetweenCards(cardLength);
    const xOffset = CardView.WIDTH / 2 + (index * spaceBetweenCards);
    
    const x = xOffset - (this.handBounds.width / 2);
    const y = this.handBounds.y;
    return { x, y: 0 };
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
 
  public getInteractiveBounds(): Phaser.Geom.Rectangle {
    return new Phaser.Geom.Rectangle(0, 0, this.handBounds.width, this.handBounds.height);
  }
}

export type { SpaceBetweenCardOptions}
export default HandLayoutHelper;
import CameraSystem from "@/core/CameraSystem";
import { Point2D } from "@/domain/Geometry";
import CardView from "@/game/cards/CardView";
import HandLayoutCalculator, { SpaceBetweenCardOptions } from "@/game/hand/HandLayoutCalculator";

type Rectangle = Phaser.Geom.Rectangle & {
  scale: number;
  zoom: number;
};

/**
 * the boundary between the calculator, CameraSystem and Phaser.Geom.Rectangle
 */
class HandLayoutHelper {
  public readonly handBounds: Rectangle;
  public readonly calculator: HandLayoutCalculator;
  private readonly cameraSystem: CameraSystem;

  public constructor(cameraSystem: CameraSystem, maxCards: number, options?: Partial<SpaceBetweenCardOptions>) {
    this.cameraSystem = cameraSystem;
    this.calculator = new HandLayoutCalculator(options);
    this.handBounds = this.createBounds(maxCards);
  }

  private createBounds(maxCards: number): Rectangle {
    const totalWidth = this.calculator.calculateTotalWidth(maxCards, CardView.WIDTH);
    const totalHeight = CardView.HEIGHT;
    const { x, y } = this.calculateHandPosition(totalWidth, totalHeight);

    const rectangle = new Phaser.Geom.Rectangle(x, y, totalWidth, totalHeight) as Rectangle;
    rectangle.zoom = this.cameraSystem.getCamera().zoom;
    rectangle.scale = 1 / rectangle.zoom;
    return rectangle;
  }

  public updateBounds() {
    const totalWidth = this.handBounds.width;
    const totalHeight = this.handBounds.height;

    const { x, y } = this.calculateHandPosition(totalWidth, totalHeight);
    this.handBounds.setPosition(x, y);
    this.handBounds.zoom = this.cameraSystem.getCamera().zoom;
    this.handBounds.scale = 1 / this.handBounds.zoom;
  }

  private calculateHandPosition(totalWidth: number, totalHeight: number): Point2D {
    const screenHeight = this.cameraSystem.getScale().height;
    const basePosition = this.calculator.calculateHandBasePosition(totalWidth, totalHeight, screenHeight);
    return this.cameraSystem.getHUDPosition(basePosition.x, basePosition.y);
  }

  public calculateSlotPositionFromIndex(index: number, cardLength: number): Point2D {
    return this.calculator.calculateSlotPositionFromIndex(
      index,
      cardLength,
      this.handBounds.width,
      CardView.WIDTH
    );
  }

  public calculateSpaceBetweenCards(cardLength: number): number {
    return this.calculator.calculateSpaceBetweenCards(cardLength);
  }

  public calculateXOffsetForSlicedCard(cardLength: number): number {
    return this.calculator.calculateXOffsetForSlicedCard(cardLength, CardView.WIDTH);
  }

  public getInteractiveBounds(): Phaser.Geom.Rectangle {
    return new Phaser.Geom.Rectangle(0, 0, this.handBounds.width, this.handBounds.height);
  }
}

export type { SpaceBetweenCardOptions };
export default HandLayoutHelper;
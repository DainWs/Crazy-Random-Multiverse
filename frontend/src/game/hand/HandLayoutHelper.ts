import type CameraSystem from "@/core/CameraSystem";
import type { Point2D } from "@/domain/Geometry";
import Phaser from "phaser";
import { CARD_WIDTH, CARD_HEIGHT } from "@/game/cards/CardDimensions";
import HandLayoutCalculator, { HAND_CARD_SCALE, SpaceBetweenCardOptions } from "@/game/hand/HandLayoutCalculator";

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

  public constructor(cameraSystem: CameraSystem, options?: Partial<SpaceBetweenCardOptions>) {
    this.cameraSystem = cameraSystem;
    this.calculator = new HandLayoutCalculator(options);
    this.handBounds = new Phaser.Geom.Rectangle(0, 0, 0, CARD_HEIGHT) as Rectangle;
    this.updateBounds(0);
  }

  /** The hand is as wide as the cards it holds and stays centered on the screen (VIEW-25). */
  public updateBounds(cardCount: number) {
    const totalWidth = this.calculator.calculateTotalWidth(cardCount, CARD_WIDTH);
    const { x, y } = this.calculateHandPosition();
    this.handBounds.setPosition(x, y);
    this.handBounds.setSize(totalWidth, CARD_HEIGHT);
    this.handBounds.zoom = this.cameraSystem.getCamera().zoom;
    this.handBounds.scale = HAND_CARD_SCALE / this.handBounds.zoom;
  }

  private calculateHandPosition(): Point2D {
    const { width, height } = this.cameraSystem.getScale();
    const basePosition = this.calculator.calculateHandBasePosition(CARD_HEIGHT * HAND_CARD_SCALE, width, height);
    return this.cameraSystem.getHUDPosition(basePosition.x, basePosition.y);
  }

  public calculateSlotPositionFromIndex(index: number, cardLength: number): Point2D {
    const handWidth = this.calculator.calculateTotalWidth(cardLength, CARD_WIDTH);
    return this.calculator.calculateSlotPositionFromIndex(index, cardLength, handWidth, CARD_WIDTH);
  }

  public calculateSpaceBetweenCards(cardLength: number): number {
    return this.calculator.calculateSpaceBetweenCards(cardLength);
  }

  public calculateXOffsetForSlicedCard(cardLength: number): number {
    return this.calculator.calculateXOffsetForSlicedCard(cardLength, CARD_WIDTH);
  }

  public calculateHiddenOffset(hiddenRatio: number): number {
    return this.calculator.calculateHiddenOffset(hiddenRatio, CARD_HEIGHT * HAND_CARD_SCALE, this.handBounds.zoom);
  }

  public getInteractiveBounds(): Phaser.Geom.Rectangle {
    return new Phaser.Geom.Rectangle(0, 0, this.handBounds.width, this.handBounds.height);
  }
}

export type { SpaceBetweenCardOptions };
export default HandLayoutHelper;

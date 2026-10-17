import type { CardRender } from "@/game/cards/renders/CardRender";
import type { OriginalBounds, OriginalPosition, OriginalScale } from "@/game/cards/CardBounds";
import type Card from "@/domain/Card";
import { CARD_WIDTH, CARD_HEIGHT } from "@/game/cards/CardDimensions";
import InteractiveObjectManager from "@/core/interactions/InteractiveObjectManager";
import Phaser from "phaser";

abstract class CardView extends Phaser.GameObjects.Container {

  private originalBounds: OriginalBounds;

  private background: Phaser.GameObjects.Image;
  private cardImage: Phaser.GameObjects.Image;
  public abstract get cardRender(): CardRender;

  public readonly card: Card;

  protected allowClicks: boolean; // TODO search a way to improve this

  constructor(
    scene: Phaser.Scene,
    card: Card
  ) {
    super(scene);
    this.scale = 1;
    this.depth = 10;
    this.x = 0;
    this.y = 0;
    this.width = CARD_WIDTH;
    this.height = CARD_HEIGHT;
    this.setSize(this.width, this.height);

    this.originalBounds = {
      position: { x: this.x, y: this.y },
      size: { width: this.width, height: this.height },
      scale: { scaleX: this.scaleX, scaleY: this.scaleY },
      depth: this.depth
    };

    this.card = card;

    this.initializeView();
    this.setInteractive({ draggable: true, useHandCursor: true });
    this.allowClicks = true;

    scene.input.setDraggable(this);
    scene.add.existing(this);
    InteractiveObjectManager.registerGameObject(this.scene, this);
  }

  protected initializeView() {
    this.initializeBackground();
    this.initializeCardImage();
    this.add([this.cardImage, this.background]);
    this.add(this.cardRender.render(this.scene, this, this.width, this.height));
  }

  protected initializeBackground() {
    this.background = this.scene.add.image(0, 0, this.card.getTexture());
    this.background.setScale(this.scaleX, this.scaleY);
    this.background.setDisplaySize(this.width, this.height);
  }

  protected initializeCardImage() {
    let cardImage = this.card.getImage();
    if (!this.scene.textures.exists(cardImage)) {
      cardImage = 'warrior-0';
    }

    const cardImageSize = this.background.displayWidth;
    const cardY = -(cardImageSize - this.background.displayHeight / 2);
    this.cardImage = this.scene.add.image(0, cardY, cardImage);
    this.cardImage.setDisplaySize(cardImageSize, cardImageSize);
    this.cardImage.setOrigin(0.5, 0.5);
  }

  // General

  public canBeClicked(): boolean {
    return this.allowClicks;
  }

  public disableClicks(): void {
    this.allowClicks = false;
  }

  // Bounds modification methods
  public setPosition(x?: number, y?: number, z?: number, w?: number): this {
    return super.setPosition(x, y, z, w);
  }

  public setDepth(depth: number): this {
    return super.setDepth(depth);
  }

  public setScale(scaleX: number, scaleY?: number): this {
    return super.setScale(scaleX, scaleY);
  }

  // Original bounds methods
  public getOriginalBounds(): OriginalBounds {
    return this.originalBounds;
  }

  public setOriginalPosition(originalX: number, originalY: number, originalZ?: number, originalW?: number) {
    this.originalBounds.position = { x: originalX, y: originalY, z: originalZ, w: originalW };
  }

  public getOriginalPosition(): OriginalPosition {
    return this.originalBounds.position;
  }

  public setOriginalDepth(originalDepth: number) {
    this.originalBounds.depth = originalDepth;
  }

  public getOriginalDepth(): number {
    return this.originalBounds.depth;
  }

  public setOriginalScale(originalScaleX: number, originalScaleY?: number) {
    this.originalBounds.scale = { scaleX: originalScaleX, scaleY: originalScaleY };
  }

  public getOriginalScale(): OriginalScale {
    return this.originalBounds.scale;
  }


  // Reset bounds methods
  public reset(): void {
    this.resetPosition();
    this.resetScale();
    this.resetDepth();
  }

  public resetPosition(): void {
    const { x, y, z, w } = this.originalBounds.position;
    this.setPosition(x, y, z, w);
  }

  public resetDepth(): void {
    this.setDepth(this.originalBounds.depth);
  }

  public resetScale(): void {
    const { scaleX, scaleY } = this.originalBounds.scale;
    this.setScale(scaleX, scaleY);
  }

  // Others
  protected preDestroy(): void {
    super.preDestroy();
    InteractiveObjectManager.unregisterGameObject(this.scene, this);
  }
}

export { CardView };
export default CardView;

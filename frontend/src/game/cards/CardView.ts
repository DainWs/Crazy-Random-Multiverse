import CardController from "@/controllers/CardController";
import InteractiveObjectManager from "@/core/interactions/InteractiveObjectManager";
import { CardAnimation } from "@/game/cards/CardAnimations";
import { CardTween } from "@/game/cards/CardTweens";
import Card, { CardAudioType } from "@/domain/Card";
import CardStackHelper from "@/game/cards/CardStackHelper";
import CardTooltipView from "@/game/cards/CardTooltipView";
import { dispatchCardViewStrategy } from "@/game/cards/CardViewStrategyDispatcher";
import CardAnimator from "@/game/cards/CardAnimator";
import { Size2D } from "@/domain/Geometry";

type OriginalPosition = {
  x: number;
  y: number;
  z?: number;
  w?: number;
}

type OriginalSize = {
  width: number;
  height: number;
}

type OriginalScale = {
  scaleX: number;
  scaleY: number | undefined;
}

type OriginalBounds = {
  position: OriginalPosition;
  size: OriginalSize;
  scale: OriginalScale;
  depth: number;
}

class CardView extends Phaser.GameObjects.Container {
  public static readonly WIDTH: number = 200;
  public static readonly HEIGHT: number = 300;
  public static readonly SIZE: Size2D = { width: CardView.WIDTH, height: CardView.HEIGHT };

  private background: Phaser.GameObjects.Image;
  private cardImage: Phaser.GameObjects.Image;

  // TODO when mouse over stacked card, it should show the tooltip of the stacked card, this include to slide the cards to show the stacked card
  private stackHelper?: CardStackHelper;
  private tooltip?: CardTooltipView;

  public readonly card: Card;

  private allowClicks: boolean; // TODO search a way to improve this

  private originalBounds: OriginalBounds;

  constructor(
    scene: Phaser.Scene,
    cardController: CardController,
    card: Card
  ) {
    super(scene);
    this.scale = 1;
    this.depth = 10;
    this.x = 0;
    this.y = 0;
    this.width = CardView.WIDTH;
    this.height = CardView.HEIGHT;
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

  private initializeView() {
    this.initializeBackground();
    this.initializeCardImage();
    this.add([this.cardImage, this.background]);

    const cardViewStrategy = dispatchCardViewStrategy(this.card);
    this.stackHelper = cardViewStrategy.createStackHelper(this.scene, this);
    this.tooltip = cardViewStrategy.createTooltip(this.scene, this);
    this.add(cardViewStrategy.createObjects(this.scene, this, this.displayWidth, this.displayHeight));
  }

  private initializeBackground() {
    this.background = this.scene.add.image(0, 0, this.card.getTexture());
    this.background.setScale(this.scaleX, this.scaleY);
    this.background.setDisplaySize(this.width, this.height);
  }

  private initializeCardImage() {
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

  public hasCardStacked(): boolean {
    if (!this.stackHelper) return false;
    return this.stackHelper.hasCardStacked();
  }

  public stack(card: CardView) {
    if (this.stackHelper && this.stackHelper.canStackMore()) {
      this.stackHelper.stack(card);
      card.allowClicks = false; // TODO deprecated and temporal
    }
  }

  public playSoundForAction(type: CardAudioType) {
    const audioResource = this.card.getAudio(type);
    if (this.scene.cache.audio.exists(audioResource)) {
      this.scene.sound.play(audioResource, { volume: 0.5 });
    } else {
      console.warn(`Audio key "${audioResource}" not found in cache.`);
    }
  }

  public canBeClicked(): boolean {
    return this.allowClicks;
  }

  public showTooltip(): void { 
    this.tooltip?.show(this);
  }

  public hideTooltip(): void {
    this.tooltip?.hide();
  }

  public applyAnimation(animation: CardAnimation): void {
    CardAnimator.playAnimation(this, animation);
  }

  public applyTween(tween: CardTween, ...args: unknown[]): void {
    CardAnimator.playTween(this, tween, ...args);
  }

  public stopTweens() {
    this.scene.tweens.killTweensOf(this);
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

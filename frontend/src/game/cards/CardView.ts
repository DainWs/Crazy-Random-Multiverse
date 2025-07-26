import CardController from "@/controllers/CardController";
import InteractiveObjectManager from "@/core/interactions/InteractiveObjectManager";
import { CardAnimation } from "@/game/cards/CardAnimations";
import { CardTween } from "@/game/cards/CardTweens";
import Card, { CardAudioType } from "@/domain/Card";
import CardStackHelper from "@/game/cards/CardStackHelper";
import { CardTooltipView } from "@/game/cards/CardTooltipView";
import { dispatchCardViewStrategy } from "@/game/cards/CardViewStrategyDispatcher";
import CardAnimator from "@/game/cards/CardAnimator";

class CardView extends Phaser.GameObjects.Container {
  public static readonly WIDTH: number = 200;
  public static readonly HEIGHT: number = 300;

  private background: Phaser.GameObjects.Image;
  private cardImage: Phaser.GameObjects.Image;

  private stackHelper?: CardStackHelper;
  private tooltip?: CardTooltipView;

  public readonly card: Card;

  private allowClicks: boolean; // TODO search a way to improve this

  private originalDepth: number; // TODO maybe this is not needed if we use getDepth() and default depth
  private originalX: number;
  private originalY: number;

  constructor(
    scene: Phaser.Scene,
    cardController: CardController,
    card: Card
  ) {
    super(scene);
    this.x = this.scene.cameras.main.x - CardView.WIDTH;
    this.y = this.scene.cameras.main.y - CardView.HEIGHT;
    this.originalX = this.x;
    this.originalY = this.y;
    this.depth = 10;
    this.originalDepth = this.depth;
    this.scale = 1;
    this.width = CardView.WIDTH;
    this.height = CardView.HEIGHT;

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
    this.scene.sound.play(audioResource, { volume: 0.5 });
  }

  public canBeClicked(): boolean {
    return this.allowClicks;
  }








  public onPointerOver() {
    if (this.canBeClicked()) {
      this.scene.input.manager.canvas.style.cursor = "grab";
    }

    CardAnimator.playTween(this, 'hover');
    this.tooltip?.show(this);
  }
  
  public onPointerOut() {
    this.scene.input.manager.canvas.style.cursor = "default";

    CardAnimator.playTween(this, 'unhover');
    this.tooltip?.hide();
  }

  /** @deprecated */
  public showTooltip(): void { 
    this.tooltip?.show(this);
  }

  /** @deprecated */
  public hideTooltip(): void {
    this.tooltip?.hide();
  }

  public applyAnimation(animation: CardAnimation): void {
    CardAnimator.playAnimation(this, animation);
  }

  public applyTween(tween: CardTween, ...args: unknown[]): void {
    CardAnimator.playTween(this, tween, ...args);
  }

  public setPosition(x?: number, y?: number, z?: number, w?: number): this {
    this.stackHelper?.propagatePosition(x, y, z, w);
    return super.setPosition(x, y, z, w);
  }

  public setDepth(depth: number): this {
    this.stackHelper?.propagateDepth(depth);
    return super.setDepth(depth);
  }

  public setOriginalPosition(originalX: number, originalY: number) {
    this.stackHelper?.propagateOriginalPosition(originalX, originalY);
    this.originalX = originalX;
    this.originalY = originalY;
  }

  public getOriginalPosition(): { x: number, y: number } {
    return { x: this.originalX, y: this.originalY }; 
  }

  public setOriginalDepth(originalDepth: number) {
    this.stackHelper?.propagateOriginalDepth(originalDepth);
    this.originalDepth = originalDepth;
  }

  public getOriginalDepth(): number {
    return this.originalDepth;
  }

  public resetPosition(): void {
    this.stackHelper?.propagatePositionReset();
    this.setPosition(this.originalX, this.originalY);
    this.setDepth(this.originalDepth);
  }

  public resetDepth(): void {
    this.stackHelper?.propagateDepthReset();
    this.setDepth(this.originalDepth);
  }

  protected preDestroy(): void {
    super.preDestroy();
    InteractiveObjectManager.unregisterGameObject(this.scene, this);
  }
}

export { CardView };
export default CardView;

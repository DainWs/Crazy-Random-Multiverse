import InteractiveObjectManager from "@/core/interactions/InteractiveObjectManager";
import applyAnimation, { CardAnimation } from "@/core/visual_effects/CardAnimations";
import resolveTween, { CardMoveTypeTweens, CardTween } from "@/core/visual_effects/CardTweens";
import Card, { CardAudioType, CardTexture } from "@/domain/Card";
import { CardTooltipView } from "@/game/cards/CardTooltipView";
import { dispatchCardViewStrategy } from "@/game/cards/CardViewStrategyDispatcher";

const BEHIND_CARD_OFFSET = 20;

class CardView extends Phaser.GameObjects.Container {
  public static readonly WIDTH: number = 200;
  public static readonly HEIGHT: number = 300;

  private background: Phaser.GameObjects.Image;
  private cardImage: Phaser.GameObjects.Image;
  private tooltip?: CardTooltipView;
  
  public readonly card: Card;
  private cardBehind?: CardView;

  private allowClicks: boolean; // TODO search a way to improve this

  private originalDepth: number; // TODO maybe this is not needed if we use getDepth() and default depth
  private originalX: number;
  private originalY: number;

  constructor(
    scene: Phaser.Scene,
    card: Card
  ) {
    super(scene);
    this.x = this.scene.cameras.main.x - (CardView.WIDTH + 50);
    this.y = this.scene.cameras.main.y - (CardView.HEIGHT + 50);
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
    this.background = this.scene.add.image(0, 0, this.card.getTexture());
    this.background.setScale(this.scaleX, this.scaleY);
    this.background.setDisplaySize(this.width, this.height);

    const cardImageSize = this.background.displayWidth;
    const cardY = -(cardImageSize - this.background.displayHeight / 2);

    let cardImage = this.card.getImage();
    if (!this.scene.textures.exists(cardImage)) {
      cardImage = 'warrior-0';
    }

    this.cardImage = this.scene.add.image(0, cardY, cardImage);
    this.cardImage.setDisplaySize(cardImageSize, cardImageSize);
    this.cardImage.setOrigin(0.5, 0.5);

    this.add([this.cardImage, this.background]);

    const cardViewStrategy = dispatchCardViewStrategy(this.card);
    this.tooltip = cardViewStrategy.createTooltip(this.scene, this);
    this.add(cardViewStrategy.createObjects(this.scene, this, this.displayWidth, this.displayHeight));
  }

  public hasCardBehind(): boolean {
    return this.cardBehind != undefined;
  }

  public equip(card: CardView) {
    if (this.cardBehind) {
      throw new Error("There is already a card behind this card.");
    }

    this.cardBehind = card;
    this.cardBehind.setOriginalPosition(this.x - BEHIND_CARD_OFFSET, this.y - BEHIND_CARD_OFFSET);
    this.cardBehind.setOriginalDepth(this.originalDepth - 1);
    this.cardBehind.resetPosition();

    this.scene.input.setDraggable(this.cardBehind, false);
    this.cardBehind.setInteractive({ useHandCursor: false });
    this.cardBehind.allowClicks = false;
  }

  public playSoundForAction(type: CardAudioType) {
    const audioResource = this.card.getAudio(type);
    this.scene.sound.play(audioResource, { volume: 0.5 });
  }

  public applyAnimation(animation: CardAnimation): void {
    applyAnimation(this, animation);
  }

  public applyTween(tween: CardTween, ...args: unknown[]): Phaser.Tweens.Tween {
    return this.scene.tweens.add(resolveTween(this, tween, ...args));
  }

  public loadCardTexture(texture: CardTexture): void {
    this.background.setTexture(texture);
  }

  public hideTooltip(): void {
    this.tooltip?.setVisible(false);
  }

  public showTooltip(): void { 
    const x = this.x + this.background.displayWidth / 2 + 20;
    const y = this.y - this.background.displayHeight / 2;
    this.tooltip?.setPosition(x, y);
    this.tooltip?.setVisible(true);
    this.tooltip?.setDepth(this.depth + 100);
  }

  public canBeClicked(): boolean {
    return this.allowClicks;
  }

  public setPosition(x?: number, y?: number, z?: number, w?: number): this {
    const xWithOffset = x ? x - BEHIND_CARD_OFFSET : undefined;
    const yWithOffset = y ? y - BEHIND_CARD_OFFSET : undefined;
    this.cardBehind?.setPosition(xWithOffset, yWithOffset, z, w);
    return super.setPosition(x, y, z, w);
  }

  public setDepth(depth: number): this {
    this.cardBehind?.setDepth(depth - 1);
    return super.setDepth(depth);
  }

  public setOriginalPosition(originalX: number, originalY: number) {
    this.cardBehind?.setOriginalPosition(originalX - BEHIND_CARD_OFFSET, originalY - BEHIND_CARD_OFFSET);
    this.originalX = originalX;
    this.originalY = originalY;
  }

  public getOriginalPosition(): { x: number, y: number } {
    return { x: this.originalX, y: this.originalY }; 
  }

  public setOriginalDepth(originalDepth: number) {
    this.cardBehind?.setOriginalDepth(originalDepth -1);
    this.originalDepth = originalDepth;
  }

  public resetPosition(): void {
    this.cardBehind?.resetPosition();
    this.setPosition(this.originalX, this.originalY);
    this.setDepth(this.originalDepth);
  }

  public resetDepth(): void {
    this.cardBehind?.resetDepth();
    this.setDepth(this.originalDepth);
  }

  protected preDestroy(): void {
    super.preDestroy();
    InteractiveObjectManager.unregisterGameObject(this.scene, this);
  }
}

export { CardView };
export default CardView;

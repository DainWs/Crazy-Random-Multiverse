import applyAnimation, { CardAnimation } from "@/core/visual_effects/CardAnimations";
import resolveTween, { CardTween } from "@/core/visual_effects/CardTweens";
import Card, { CardTexture } from "@/domain/Card";
import { CardTooltipView } from "@/game/cards/CardTooltipView";
import { dispatchCardViewStrategy } from "@/game/cards/CardViewStrategyDispatcher";
import { GameScene } from "@/game/scenes/Game";

const BEHIND_CARD_OFFSET = 20;

class CardView extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Image;
  private cardImage: Phaser.GameObjects.Image;
  private tooltip?: CardTooltipView;
  
  public readonly card: Card;
  private cardBehind?: CardView;

  private allowGrab: boolean; // TODO search a way to improve this

  private originalDepth: number; // TODO maybe this is not needed if we use getDepth() and default depth
  private originalX: number;
  private originalY: number;

  constructor(
    scene: GameScene,
    x: number,
    y: number,
    card: Card
  ) {
    super(scene, x, y);
    this.originalX = x;
    this.originalY = y;
    this.depth = 10;
    this.originalDepth = this.depth;
    this.scale = 1;
    this.width = 200;
    this.height = 300;

    this.card = card;

    this.initializeView();
    this.setInteractive({ useHandCursor: true });
    this.allowGrab = true;

    scene.input.setDraggable(this);
    scene.add.existing(this);
    scene.interactionSystem.registerCard(this);
  }

  private initializeView() {
    this.background = this.scene.add.image(0, 0, this.card.getTexture());
    this.background.setScale(this.scaleX, this.scaleY);
    this.background.setDisplaySize(this.width, this.height);

    const cardImageSize = this.background.displayWidth;
    const cardY = -(cardImageSize - this.background.displayHeight / 2);
    this.cardImage = this.scene.add.image(0, cardY, 'warrior-0');
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
    this.cardBehind.allowGrab = false;
  }

  public applyAnimation(animation: CardAnimation): void {
    applyAnimation(this, animation);
  }

  public applyTween(tween: CardTween): void {
    this.scene.tweens.add(resolveTween(this, tween));
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

  public canBeGrabbed(): boolean {
    return this.allowGrab;
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
}

export { CardView };

import Card, { CardTexture } from "@/domain/Card";
import { CardTooltipView } from "@/game/cards/CardTooltipView";
import { dispatchCardViewStrategy } from "@/game/cards/CardViewStrategyDispatcher";
import { GameScene } from "@/game/scenes/Game";

class CardView extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Image;
  private cardImage: Phaser.GameObjects.Image;
  private tooltip?: CardTooltipView;

  public readonly definition: Card;
  private cardsBehind: Set<CardView>;

  private originalX: number;
  private originalY: number;

  constructor(
    scene: GameScene,
    x: number,
    y: number,
    definition: Card
  ) {
    super(scene, x, y);
    this.originalX = x;
    this.originalY = y;
    this.scale = 1;
    this.width = 200;
    this.height = 300;

    this.definition = definition;
    this.cardsBehind = new Set<CardView>();

    this.initializeView();
    this.setInteractive({ useHandCursor: true });

    scene.input.setDraggable(this);
    scene.add.existing(this);
    scene.interactionSystem.registerCard(this);
  }

  private initializeView() {
    this.background = this.scene.add.image(0, 0, this.definition.getTexture());
    this.background.setScale(this.scaleX, this.scaleY);
    this.background.setDisplaySize(this.width, this.height);

    const cardImageSize = this.background.displayWidth;
    const cardY = -(cardImageSize - this.background.displayHeight / 2);
    this.cardImage = this.scene.add.image(0, cardY, 'warrior-0');
    this.cardImage.setDisplaySize(cardImageSize, cardImageSize);
    this.cardImage.setOrigin(0.5, 0.5);

    this.add([this.cardImage, this.background]);

    const cardViewStrategy = dispatchCardViewStrategy(this.definition);
    this.tooltip = cardViewStrategy.createTooltip(this.scene, this);
    this.add(cardViewStrategy.createObjects(this.scene, this, this.displayWidth, this.displayHeight));
  }

  public addCardBehind(card: CardView) {
    this.add(card);
    this.cardsBehind.add(card);
    this.redrawCardsBehind();
  }

  public removeCardBehind(card: CardView) {
    this.remove(card);
    this.cardsBehind.delete(card);
    this.redrawCardsBehind();
  }

  private redrawCardsBehind(): void {
    const offset = 20;

    let index = 1;
    for (const card of this.cardsBehind) {
      const currentOffset = offset * index;
      card.setDepth(this.depth - index);
      card.setPosition(this.x + currentOffset, this.y + currentOffset);
      index++;
    }
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
  }

  public setOriginalPosition(originalX: number, originalY: number) {
    this.originalX = originalX;
    this.originalY = originalY;
  }

  public resetPosition(): void {
    this.setPosition(this.originalX, this.originalY);
  }
}

export { CardView };

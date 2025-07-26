import Card from "@/domain/Card";
import CardView from "@/game/cards/CardView";

class CardTooltipView extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Rectangle;
  private nameText: Phaser.GameObjects.Text;
  private descriptionText: Phaser.GameObjects.Text;

  private readonly margin: number;
  private readonly padding: number;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    this.setDepth(10);
    this.margin = 20;
    this.padding = 8;

    this.nameText =  this.scene.add.text(0, 0, "");
    this.nameText.setOrigin(0, 0);
    this.descriptionText =  this.scene.add.text(0, 0, "");
    this.descriptionText.setOrigin(0, 0);
    this.calculateTextPositions();

    this.background = this.scene.add.rectangle(0, 0);
    this.background.setOrigin(0, 0);
    this.background.setFillStyle(0x000000, 0.8);
    this.background.setStrokeStyle(1, 0xffffff);
    this.calculateBackgroundSize();

    this.add([this.background, this.nameText, this.descriptionText]);

    this.setVisible(false);
    scene.add.existing(this);
  }

  public setNameText(content: string) {
    this.nameText.setText(content);
    this.calculateTextPositions();
    this.calculateBackgroundSize();
  }

  public setDescriptionText(content: string) {
    this.descriptionText.setText(content);
    this.calculateTextPositions();
    this.calculateBackgroundSize();
  }

  private calculateTextPositions() {
    this.nameText.setPosition(this.padding, this.padding);
    this.descriptionText.setPosition(this.padding, this.nameText.height + this.padding);
  }

  private calculateBackgroundSize() {
    const widthestText = Math.max(this.nameText.width, this.descriptionText.width);
    const totalTextHeight = this.nameText.height + this.descriptionText.height;
    
    const twoSidesPadding = this.padding * 2;
    const width = (widthestText * 2) + twoSidesPadding;
    const height = (totalTextHeight * 2) + twoSidesPadding;

    this.background.setSize(width, height);
  }

  public show(cardView: CardView) {
    const x = cardView.x + (cardView.displayWidth / 2) + this.margin;
    const y = cardView.y - (cardView.displayHeight / 2);
    this.setPosition(x, y);
    this.setDepth(cardView.depth + 100);
    this.setVisible(true);
  }

  public hide() {
    this.setVisible(false);
  }
}

export { CardTooltipView };
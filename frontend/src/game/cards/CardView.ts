import Card, { CardTexture } from "@/domain/Card";
import { Armor, Damage, Health } from "@/domain/Statistics";
import { showDebugBoxes } from "@/env";
import { CardStatisticView } from "@/game/cards/CardStatisticView";
import { CardTooltipView } from "@/game/cards/CardTooltipView";
import { GameScene } from "@/game/scenes/Game";
import * as TextUtils from "@/game/utils/TextUtils";

class CardView extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Image;
  private cardName: Phaser.GameObjects.Text;
  private cardImage: Phaser.GameObjects.Image;
  private damage: CardStatisticView;
  private armor: CardStatisticView;
  private health: CardStatisticView;
  private tooltip: CardTooltipView;

  public readonly definition: Card;

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

    this.initializeView();

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

    this.tooltip = new CardTooltipView(this.scene, this.width / 2 + 10, 0);
    this.tooltip.setNameText(this.definition.name);
    this.tooltip.setDescriptionText(`${this.definition.rarity}\n\n${this.definition.description}`);

    this.defineCardName(this.definition.name);
    this.defineDamageStat(this.definition.damage);
    this.defineHealthStat(this.definition.health);
    this.defineArmorStat(this.definition.armor);
  }

  private defineCardName(name: string) {
    const horizontalPadding = this.background.displayWidth * 0.2;
    const verticalPadding = this.background.displayHeight * 0.05;
    const width = this.background.displayWidth * 0.70 - horizontalPadding;
    const height = this.background.displayHeight * 0.10 - verticalPadding;
    const x = 0;
    const y = -(this.background.displayHeight / 2) + height / 2 + verticalPadding;
    const fontSize = Math.floor(this.background.displayHeight * 0.08);

    if (showDebugBoxes) {
      const nameBox = this.scene.add.rectangle(x, y);
      nameBox.setSize(width, height);
      nameBox.setFillStyle(0xFF0000, 0.5);
      nameBox.setStrokeStyle(1, 0x000000);
      this.add(nameBox);
    }

    this.cardName = this.scene.add.text(x, y, name);
    this.cardName.setOrigin(0.5, 0.5);
    this.cardName.setSize(width, height);
    this.cardName.setColor('#000');
    this.cardName.setFontSize(fontSize);
    TextUtils.fitText(this.cardName, width, height);
    this.add(this.cardName);
  }

  private defineDamageStat(damageStat: Damage | undefined): void {
    const horizontalPadding = this.background.displayWidth * 0.06;
    const verticalPadding = this.background.displayHeight * 0.03;
    const width = this.background.displayWidth * 0.4 - horizontalPadding * 2;
    const height = this.background.displayHeight * 0.2 - verticalPadding * 2;
    const x = -(width / 2) - horizontalPadding / 2;
    const y = this.background.displayHeight / 2 - (height / 2 + verticalPadding * 2) - this.background.displayHeight * 0.02;

    if (damageStat) {
      this.damage = new CardStatisticView(this.scene, damageStat);
      this.damage.setIconPosition('left');
      this.damage.setPosition(x, y);
      this.damage.setSize(width, height);
      this.add(this.damage);
    }
  }

  private defineHealthStat(healthStat: Health | undefined): void {
    const horizontalPadding = this.background.displayWidth * 0.06;
    const verticalPadding = this.background.displayHeight * 0.03;
    const width = this.background.displayWidth * 0.4 - horizontalPadding * 2;
    const height = this.background.displayHeight * 0.2 - verticalPadding * 2;
    const x = (width / 2) + horizontalPadding / 2;
    const y = this.background.displayHeight / 2 - (height / 2 + verticalPadding * 2) - this.background.displayHeight * 0.02;

    if (healthStat) {
      this.health = new CardStatisticView(this.scene, healthStat);
      this.health.setIconPosition('right');
      this.health.setPosition(x, y);
      this.health.setSize(width, height);
      this.add(this.health);
    }
  }

  private defineArmorStat(armorStat: Armor | undefined): void {
    const width = this.background.displayWidth * 0.40;
    const height = this.background.displayHeight * 0.10;
    const x = 0;
    const y = height * 2;

    if (armorStat) {
      this.armor = new CardStatisticView(this.scene, armorStat);
      this.armor.setIconPosition('top');
      this.armor.setPosition(x, y);
      this.armor.setSize(width, height);
      this.add(this.armor);
    }
  }

  public loadCardTexture(texture: CardTexture): void {
    this.background.setTexture(texture);
  }

  public hideTooltip(): void {
    this.tooltip.setVisible(false);
  }

  public showTooltip(): void { 
    const x = this.x + this.background.displayWidth / 2 + 20;
    const y = this.y - this.background.displayHeight / 2;
    this.tooltip.setPosition(x, y);
    this.tooltip.setVisible(true);
  }

  public resetPosition(): void {
    this.setPosition(this.originalX, this.originalY);
  }
}

export { CardView };

import type { GameScene } from "@/scenes/Game";
import type Card from "@/domain/Card";
import type CardView from "@/game/cards/CardView";
import type { CardTooltip } from "@/game/cards/tooltip";
import { CARD_WIDTH, CARD_HEIGHT } from "@/game/cards/CardDimensions";

const SCALE_FACTOR = 1.6;
const WIDTH = CARD_WIDTH * SCALE_FACTOR;
const HEIGHT = CARD_HEIGHT * SCALE_FACTOR;

const SIDEBAR_WIDTH_RATIO = 0.25;
const SHADOW_OFFSET = 15;
const SHADOW_ALPHA = 0.8;
const PADDING = 20;

const COLOR_BACKGROUND = 0x000000;
const COLOR_NAME = '#ffd700';
const COLOR_DESCRIPTION = '#eeeeee';
const COLOR_STROKE = '#000000';
const COLOR_POSITIVE = '#00ff00';
const COLOR_NEGATIVE = '#ff0000';
const COLOR_EQUIPMENT_NAME = '#aaaaaa';

const NAME_SHADOW: Phaser.Types.GameObjects.Text.TextShadow = { 
  offsetX: 2, offsetY: 2, 
  color: COLOR_STROKE, 
  blur: 2, 
  stroke: true, 
  fill: true 
};

class GlobalCardTooltipView extends Phaser.GameObjects.Container implements CardTooltip {
  public static readonly SCALE_FACTOR = SCALE_FACTOR;
  public static readonly WIDTH = WIDTH;
  public static readonly HEIGHT = HEIGHT;

  private background: Phaser.GameObjects.Rectangle;
  private descriptionContainer: Phaser.GameObjects.Container;
  private cardContainer: Phaser.GameObjects.Container;
  private nameText: Phaser.GameObjects.Text;
  private descriptionText: Phaser.GameObjects.Text;
  private equipmentTexts: Phaser.GameObjects.Text[] = [];

  private currentWidth: number = 0;
  private currentHeight: number = 0;

  public constructor(gameScene: GameScene) {
    super(gameScene);
    this.setDepth(1000);
    this.initialize();
  }

  private initialize() {
    this.initBackground();
    this.initCardContainer();
    this.initDescriptionContainer();

    this.add([this.background, this.cardContainer, this.descriptionContainer]);

    this.setVisible(false);
    this.scene.add.existing(this);

    this.initSyncEvent();
  }

  private initBackground() {
    this.background = this.scene.add.rectangle(0, 0, 100, 100, COLOR_BACKGROUND, 0.9);
    this.background.setOrigin(0.5, 0.5);
  }

  private initCardContainer() {
    this.cardContainer = this.scene.add.container(0, 0);
  }

  private initDescriptionContainer() {
    this.descriptionContainer = this.scene.add.container(0, 0);

    this.nameText = this.createText(28, COLOR_NAME, 'bold', NAME_SHADOW);
    this.nameText.setStroke(COLOR_STROKE, 5);

    this.descriptionText = this.createText(20, COLOR_DESCRIPTION, 'normal');
    this.descriptionText.setLineSpacing(6);

    this.descriptionContainer.add([this.nameText, this.descriptionText]);
  }

  private createText(fontSize: number, color: string, fontStyle: string, shadow?: Phaser.Types.GameObjects.Text.TextShadow) {
    const text = this.scene.add.text(0, 0, "", {
      fontSize: `${fontSize}px`,
      color,
      fontStyle,
      align: 'center',
      shadow
    });
    text.setOrigin(0.5, 0);
    return text;
  }

  private initSyncEvent() {
    this.scene.events.on('prerender', () => {
      if (this.visible) {
        this.updateBounds();
      }
    });
  }

  private updateBounds() {
    const cameraSystem = (this.scene as GameScene).cameraSystem;
    const { width: screenWidth, height: screenHeight } = cameraSystem.getScale();

    this.setScale(1 / cameraSystem.getCamera().zoom);

    this.currentWidth = screenWidth * SIDEBAR_WIDTH_RATIO;
    this.currentHeight = screenHeight;

    this.background.setSize(this.currentWidth, this.currentHeight);

    const x = screenWidth - (this.currentWidth / 2);
    const y = screenHeight / 2;
    const position = cameraSystem.getHUDPosition(x, y);
    this.setPosition(position.x, position.y);
  }

  public show(cardView: CardView) {
    this.updateBounds();

    this.buildCardVisual(cardView);
    this.buildDescription(cardView);

    this.cardContainer.setPosition(0, -this.currentHeight * 0.2);
    this.descriptionContainer.setPosition(0, this.cardContainer.y + (HEIGHT / 2) + PADDING * 2);

    this.setVisible(true);
  }

  public hide() {
    this.setVisible(false);
    this.cardContainer.removeAll(true);
  }

  private buildCardVisual(cardView: CardView) {
    this.cardContainer.removeAll(true);
    const card = cardView.card;

    const shadow = this.addCardShadow();
    const artwork = this.addCardArtwork(card);
    const background = this.addCardBackground(card);
    const strategyObjects = this.addCardStrategyObjects(cardView);

    this.cardContainer.add([shadow, artwork, background, ...strategyObjects]);
  }

  private addCardShadow() {
    const shadow = this.scene.add.rectangle(0, 0, WIDTH, HEIGHT, COLOR_BACKGROUND, SHADOW_ALPHA);
    shadow.setOrigin(0.5, 0.5);
    shadow.setPosition(SHADOW_OFFSET, SHADOW_OFFSET);
    shadow.setInteractive(); // Prevent clicks falling through
    return shadow;
  }

  private addCardBackground(card: Card) {
    const background = this.scene.add.image(0, 0, card.getTexture());
    background.setDisplaySize(WIDTH, HEIGHT);
    background.setName('background');
    return background;
  }

  private addCardArtwork(card: Card) {
    // TODO defensive programming?
    let texture = card.getImage();
    if (!this.scene.textures.exists(texture)) {
      texture = 'warrior-0';
    }
    const imageY = -(WIDTH - HEIGHT / 2);
    const artwork = this.scene.add.image(0, imageY, texture);
    artwork.setDisplaySize(WIDTH, WIDTH);
    artwork.setOrigin(0.5, 0.5);
    return artwork;
  }

  private addCardStrategyObjects(cardView: CardView) {
    return cardView.cardRender.render(cardView.scene, cardView, WIDTH, HEIGHT);
  }

  private buildDescription({ card }: CardView) {
    this.nameText.setText(card.name);
    this.descriptionText.setText(card.description || '');
    this.descriptionText.setWordWrapWidth(this.currentWidth - PADDING * 4);

    this.alignDescriptionText(card);
  }

  private alignDescriptionText(card: Card) {
    this.nameText.setPosition(0, 0);
    this.descriptionText.setPosition(0, this.nameText.y + this.nameText.height + PADDING * 1.5);

    this.clearEquipmentTexts();

    let currentY = this.descriptionText.y + this.descriptionText.height + PADDING;
    // Support for future multiple equipments
    const equipmentCards = card.equipment ? [card.equipment] : [];
    for (const equipmentCard of equipmentCards) {
      currentY = this.renderEquipment(equipmentCard as Card, currentY);
    }
  }

  private clearEquipmentTexts() {
    this.equipmentTexts.forEach(textElement => textElement.destroy());
    this.equipmentTexts = [];
  }

  private renderEquipment(equipmentCard: Card, startYPosition: number): number {
    let currentYPosition = startYPosition;
    currentYPosition = this.renderEquipmentName(equipmentCard.name, currentYPosition);

    // TODO change to english labels and support for future multiple equipments
    if (equipmentCard.damage) currentYPosition = this.renderEquipmentStat('Daño', equipmentCard.damage.value, currentYPosition);
    if (equipmentCard.armor) currentYPosition = this.renderEquipmentStat('Armadura', equipmentCard.armor.value, currentYPosition);
    if (equipmentCard.health) currentYPosition = this.renderEquipmentStat('Vida', equipmentCard.health.value, currentYPosition);
    return currentYPosition + PADDING;
  }

  private renderEquipmentName(equipmentName: string, startYPosition: number): number {
    const equipmentNameText = this.createText(22, COLOR_EQUIPMENT_NAME, 'italic');
    equipmentNameText.setText(`Equipo: ${equipmentName}`);
    equipmentNameText.setStroke(COLOR_STROKE, 2);
    equipmentNameText.setPosition(0, startYPosition);
    this.addEquipmentText(equipmentNameText);
    return startYPosition + equipmentNameText.height + 6;
  }

  private renderEquipmentStat(statLabel: string, statValue: number, startYPosition: number): number {
    const statColor = statValue >= 0 ? COLOR_POSITIVE : COLOR_NEGATIVE;
    const valueSign = statValue > 0 ? '+' : '';
    const statTextElement = this.createText(20, statColor, 'bold');
    statTextElement.setText(`${statLabel}: ${valueSign}${statValue}`);
    statTextElement.setStroke(COLOR_STROKE, 3);
    statTextElement.setPosition(0, startYPosition);
    this.addEquipmentText(statTextElement);
    return startYPosition + statTextElement.height + 2;
  }

  private addEquipmentText(textElement: Phaser.GameObjects.Text) {
    this.descriptionContainer.add(textElement);
    this.equipmentTexts.push(textElement);
  }
}

export default GlobalCardTooltipView;
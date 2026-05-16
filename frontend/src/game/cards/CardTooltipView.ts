import Card from "@/domain/Card";
import CardView from "@/game/cards/CardView";
import { GameScene } from "@/scenes/Game";
import { dispatchCardViewStrategy } from "@/game/cards/CardViewStrategyDispatcher";

class CardTooltipView extends Phaser.GameObjects.Container {
  public static readonly SCALE_FACTOR = 1.6;
  public static readonly WIDTH = CardView.WIDTH * CardTooltipView.SCALE_FACTOR;
  public static readonly HEIGHT = CardView.HEIGHT * CardTooltipView.SCALE_FACTOR;

  private static readonly SIDEBAR_WIDTH_RATIO = 0.25;
  private static readonly SHADOW_OFFSET = 15;
  private static readonly SHADOW_ALPHA = 0.8;
  private static readonly PADDING = 20;

  private static readonly COLOR_BACKGROUND = 0x000000;
  private static readonly COLOR_NAME = '#ffd700';
  private static readonly COLOR_DESCRIPTION = '#eeeeee';
  private static readonly COLOR_STROKE = '#000000';
  private static readonly COLOR_POSITIVE = '#00ff00';
  private static readonly COLOR_NEGATIVE = '#ff0000';
  private static readonly COLOR_EQUIPMENT_NAME = '#aaaaaa';
  
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
    this.background = this.scene.add.rectangle(0, 0, 100, 100, CardTooltipView.COLOR_BACKGROUND, 0.9);
    this.background.setOrigin(0.5, 0.5);
  }

  private initCardContainer() {
    this.cardContainer = this.scene.add.container(0, 0);
  }

  private initDescriptionContainer() {
    this.descriptionContainer = this.scene.add.container(0, 0);

    this.nameText = this.createText(28, CardTooltipView.COLOR_NAME, 'bold', { offsetX: 2, offsetY: 2, color: CardTooltipView.COLOR_STROKE, blur: 2, stroke: true, fill: true });
    this.nameText.setStroke(CardTooltipView.COLOR_STROKE, 5);

    this.descriptionText = this.createText(20, CardTooltipView.COLOR_DESCRIPTION, 'normal');
    this.descriptionText.setLineSpacing(6);

    this.descriptionContainer.add([this.nameText, this.descriptionText]);
  }

  private createText(fontSize: number, color: string, fontStyle: string, shadow?: any) {
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

    this.currentWidth = screenWidth * CardTooltipView.SIDEBAR_WIDTH_RATIO;
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
    this.descriptionContainer.setPosition(0, this.cardContainer.y + (CardTooltipView.HEIGHT / 2) + CardTooltipView.PADDING * 2);

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
    const shadow = this.scene.add.rectangle(0, 0, CardTooltipView.WIDTH, CardTooltipView.HEIGHT, 0x000000, CardTooltipView.SHADOW_ALPHA);
    shadow.setOrigin(0.5, 0.5);
    shadow.setPosition(CardTooltipView.SHADOW_OFFSET, CardTooltipView.SHADOW_OFFSET);
    shadow.setInteractive(); // Prevent clicks falling through
    return shadow;
  }

  private addCardBackground(card: Card) {
    const background = this.scene.add.image(0, 0, card.getTexture());
    background.setDisplaySize(CardTooltipView.WIDTH, CardTooltipView.HEIGHT);
    background.setName('background');
    return background;
  }

  private addCardArtwork(card: Card) {
    // TODO defensive programming?
    let texture = card.getImage();
    if (!this.scene.textures.exists(texture)) {
      texture = 'warrior-0';
    }
    const imageY = -(CardTooltipView.WIDTH - CardTooltipView.HEIGHT / 2);
    const artwork = this.scene.add.image(0, imageY, texture);
    artwork.setDisplaySize(CardTooltipView.WIDTH, CardTooltipView.WIDTH);
    artwork.setOrigin(0.5, 0.5);
    return artwork;
  }

  private addCardStrategyObjects(cardView: CardView) {
    const strategy = dispatchCardViewStrategy(cardView.card);
    return strategy.createObjects(this.scene, cardView, CardTooltipView.WIDTH, CardTooltipView.HEIGHT);
  }

  private buildDescription({ card }: CardView) {
    this.nameText.setText(card.name);
    this.descriptionText.setText(card.description || '');
    this.descriptionText.setWordWrapWidth(this.currentWidth - CardTooltipView.PADDING * 4);

    this.alignDescriptionText(card);
  }

  private alignDescriptionText(card: Card) {
    this.nameText.setPosition(0, 0);
    this.descriptionText.setPosition(0, this.nameText.y + this.nameText.height + CardTooltipView.PADDING * 1.5);

    this.clearEquipmentTexts();
    
    let currentY = this.descriptionText.y + this.descriptionText.height + CardTooltipView.PADDING;
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

    if (equipmentCard.damage) currentYPosition = this.renderEquipmentStat('Daño', equipmentCard.damage.value, currentYPosition);
    if (equipmentCard.armor) currentYPosition = this.renderEquipmentStat('Armadura', equipmentCard.armor.value, currentYPosition);
    if (equipmentCard.health) currentYPosition = this.renderEquipmentStat('Vida', equipmentCard.health.value, currentYPosition);
    return currentYPosition + CardTooltipView.PADDING;
  }

  private renderEquipmentName(equipmentName: string, startYPosition: number): number {
    const equipmentNameText = this.createText(22, CardTooltipView.COLOR_EQUIPMENT_NAME, 'italic');
    equipmentNameText.setText(`Equipo: ${equipmentName}`);
    equipmentNameText.setStroke(CardTooltipView.COLOR_STROKE, 2);
    equipmentNameText.setPosition(0, startYPosition);
    this.addEquipmentText(equipmentNameText);
    return startYPosition + equipmentNameText.height + 6;
  }

  private renderEquipmentStat(statLabel: string, statValue: number, startYPosition: number): number {
    const statColor = statValue >= 0 ? CardTooltipView.COLOR_POSITIVE : CardTooltipView.COLOR_NEGATIVE;
    const valueSign = statValue > 0 ? '+' : '';
    const statTextElement = this.createText(20, statColor, 'bold');
    statTextElement.setText(`${statLabel}: ${valueSign}${statValue}`);
    statTextElement.setStroke(CardTooltipView.COLOR_STROKE, 3);
    statTextElement.setPosition(0, startYPosition);
    this.addEquipmentText(statTextElement);
    return startYPosition + statTextElement.height + 2;
  }

  private addEquipmentText(textElement: Phaser.GameObjects.Text) {
    this.descriptionContainer.add(textElement);
    this.equipmentTexts.push(textElement);
  }
}

export default CardTooltipView;
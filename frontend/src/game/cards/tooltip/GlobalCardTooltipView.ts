import type { GameScene } from "@/scenes/Game";
import type Card from "@/domain/Card";
import type CardView from "@/game/cards/CardView";
import type { CardTooltip } from "@/game/cards/tooltip";
import type { EquipmentValueLine } from "@/game/cards/EquipmentValueLines";
import Phaser from "phaser";
import { CARD_WIDTH, CARD_HEIGHT } from "@/game/cards/CardDimensions";
import { createCardArtwork } from "@/game/cards/CardArtwork";
import { getText } from "@/core/Texts";
import { RENDER_SCALE, TOOLTIP_CLOSE_WAIT_MS, TOOLTIP_DEPTH, TOOLTIP_SLIDE_DISTANCE } from "@/core/Constants";
import { calculateScreenFit, toLogicalScreen } from "@/core/cameras/CameraCalculations";
import TooltipLayout from "@/game/cards/tooltip/TooltipLayout";
import type { TooltipSide } from "@/game/cards/tooltip/TooltipLayout";
import { playMotion } from "@/core/visual_effects/Motion";
import { paletteFill, paletteText } from "@/game/utils/Palette";
import { TEXT_SIZE_BODY, TEXT_SIZE_LABEL, TEXT_SIZE_NUMBERS, UI_FONT_FAMILY } from "@/core/Constants";
import { equipmentValueLines } from "@/game/cards/EquipmentValueLines";
import ZoneSlotView from "@/game/zone/ZoneSlotView";

const SCALE_FACTOR = 1.6;
const WIDTH = CARD_WIDTH * SCALE_FACTOR;
const HEIGHT = CARD_HEIGHT * SCALE_FACTOR;

const SIDEBAR_WIDTH_RATIO = 0.25;
const SHADOW_OFFSET = 15;
const SHADOW_ALPHA = 0.8;
const PADDING = 20;
/** Space in px between the name of a card and the line that says it can attack (VIEW-59). */
const ATTACK_LINE_GAP = PADDING / 2;
/** Space in px between the last line of the heading and the description of a card (VIEW-59). */
const DESCRIPTION_GAP = PADDING * 1.5;


const NAME_SHADOW: Phaser.Types.GameObjects.Text.TextShadow = { 
  offsetX: 2, offsetY: 2, 
  color: paletteText('TEXT_OUTLINE'), 
  blur: 2, 
  stroke: true, 
  fill: true 
};

/** An own card of the board that can attack on the turn of the board shown, the same condition as its cyan frame (VIEW-59). */
function canAttackThisTurn(cardView: CardView): boolean {
  const slot = cardView.parentContainer;

  return slot instanceof ZoneSlotView && slot.holdsCardThatCanAttack();
}

class GlobalCardTooltipView extends Phaser.GameObjects.Container implements CardTooltip {
  public static readonly SCALE_FACTOR = SCALE_FACTOR;
  public static readonly WIDTH = WIDTH;
  public static readonly HEIGHT = HEIGHT;

  private background: Phaser.GameObjects.Rectangle;
  private descriptionContainer: Phaser.GameObjects.Container;
  private cardContainer: Phaser.GameObjects.Container;
  private nameText: Phaser.GameObjects.Text;
  private canAttackText: Phaser.GameObjects.Text;
  private descriptionText: Phaser.GameObjects.Text;
  private equipmentTexts: Phaser.GameObjects.Text[] = [];

  private readonly layout = new TooltipLayout();
  private side: TooltipSide = 'RIGHT';
  /** How much the window is smaller than the reference screen, so the card and the texts of the panel fit its height (VIEW-24). */
  private contentScale = 1;
  private currentWidth: number = 0;
  private currentHeight: number = 0;

  /** The card the panel shows. Its pointer-out never fires if it is destroyed under the pointer (VIEW-64). */
  private shownCardView?: CardView;

  /** How open the panel is, from 0 (closed, transparent and 40 px to the right) to 1 (opaque and in its place) (VIEW-64). */
  private readonly opening = { open: 0 };
  private closing = false;
  private closeTimer?: Phaser.Time.TimerEvent;

  public constructor(gameScene: GameScene) {
    super(gameScene);
    this.setDepth(TOOLTIP_DEPTH);
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
    this.background = this.scene.add.rectangle(0, 0, 100, 100, paletteFill('TOOLTIP_FILL'), 0.9);
    this.background.setOrigin(0.5, 0.5);
  }

  private initCardContainer() {
    this.cardContainer = this.scene.add.container(0, 0);
  }

  private initDescriptionContainer() {
    this.descriptionContainer = this.scene.add.container(0, 0);

    this.nameText = this.createText(TEXT_SIZE_BODY, paletteText('TOOLTIP_NAME'), 'bold', NAME_SHADOW);
    this.nameText.setStroke(paletteText('TEXT_OUTLINE'), 5);

    this.canAttackText = this.createText(TEXT_SIZE_LABEL, paletteText('TOOLTIP_CAN_ATTACK'), 'normal');
    this.canAttackText.setText(getText('ui.card.can_attack'));

    this.descriptionText = this.createText(TEXT_SIZE_LABEL, paletteText('TOOLTIP_DESCRIPTION'), 'normal');
    this.descriptionText.setLineSpacing(6);

    this.descriptionContainer.add([this.nameText, this.canAttackText, this.descriptionText]);
  }

  private createText(fontSize: string, color: string, fontStyle: string, shadow?: Phaser.Types.GameObjects.Text.TextShadow) {
    const text = this.scene.add.text(0, 0, "", {
      fontFamily: UI_FONT_FAMILY,
      fontSize,
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
      if (this.visible && !this.closing && this.isShownCardGone()) {
        this.close();
      }

      if (this.visible) {
        this.updateBounds();
      }
    });
  }

  private isShownCardGone(): boolean {
    return this.shownCardView !== undefined && !this.shownCardView.active;
  }

  private updateBounds() {
    const cameraSystem = (this.scene as GameScene).cameraSystem;
    const { width: screenWidth, height: screenHeight } = cameraSystem.getScale();

    this.setScale(RENDER_SCALE / cameraSystem.getCamera().zoom);

    // The panel is written in the pixels of the window, and the canvas has RENDER_SCALE of its own for each one
    this.currentWidth = (screenWidth * SIDEBAR_WIDTH_RATIO) / RENDER_SCALE;
    this.currentHeight = screenHeight / RENDER_SCALE;

    this.background.setSize(this.currentWidth, this.currentHeight);

    const slide = (1 - this.opening.open) * TOOLTIP_SLIDE_DISTANCE * calculateScreenFit(this.scene.scale);
    const x = this.layout.centerX(this.side, screenWidth, this.currentWidth * RENDER_SCALE, slide);
    const y = screenHeight / 2;
    const position = cameraSystem.getHUDPosition(x, y);
    this.setPosition(position.x, position.y);
  }

  /** It opens sliding from the right while it fades in; if it is already open, waiting or closing, it shows the card at once and stays in its place (VIEW-64). */
  public show(cardView: CardView) {
    const wasClosed = !this.visible;
    this.cancelClose();
    this.shownCardView = cardView;
    this.side = this.layout.sideOf(this.screenShareOf(cardView));
    this.contentScale = Math.min(1, calculateScreenFit(toLogicalScreen(this.scene.scale, RENDER_SCALE)));
    this.cardContainer.setScale(this.contentScale);
    this.descriptionContainer.setScale(this.contentScale);
    this.updateBounds();

    this.buildCardVisual(cardView);
    this.buildDescription(cardView);

    this.cardContainer.setPosition(0, -this.currentHeight * 0.2);
    this.descriptionContainer.setPosition(0, this.cardContainer.y + ((HEIGHT / 2) + PADDING * 2) * this.contentScale);

    this.setVisible(true);
    if (wasClosed) {
      this.setOpen(0);
      this.animateOpen(1);
    } else {
      this.scene.tweens.killTweensOf(this.opening);
      this.setOpen(1);
    }
  }

  /** Where the card is on the screen, from its left edge (0) to its right edge (1) (VIEW-14). */
  private screenShareOf(cardView: CardView): number {
    const view = (this.scene as GameScene).cameraSystem.getCamera().worldView;

    return (cardView.getWorldTransformMatrix().tx - view.x) / view.width;
  }

  /** The pointer left the card: the panel waits, and closes unless the pointer enters another card meanwhile (VIEW-64). */
  public hide() {
    if (!this.visible || this.closing) {
      return;
    }

    this.closeTimer?.remove();
    this.closeTimer = this.scene.time.delayedCall(TOOLTIP_CLOSE_WAIT_MS, () => this.close());
  }

  /** The panel closes without waiting, sliding to the right while it fades out (VIEW-64). */
  public close() {
    this.closeTimer?.remove();
    if (!this.visible || this.closing) {
      return;
    }

    this.closing = true;
    this.animateOpen(0);
  }

  private cancelClose() {
    this.closeTimer?.remove();
    this.closeTimer = undefined;
    if (this.closing) {
      this.closing = false;
      this.scene.tweens.killTweensOf(this.opening);
    }
  }

  /** Opens (1) slowing down at the end, or closes (0) speeding up, in 250 ms; the panel is removed when it ends closed (VIEW-64). */
  private animateOpen(target: 0 | 1) {
    void playMotion(this.scene, {
      targets: this.opening,
      to: { open: target },
      duration: 'MEDIUM',
      curve: target === 1 ? 'ENTER' : 'LEAVE',
      kind: 'ESSENTIAL',
      onUpdate: () => this.setOpen(this.opening.open)
    }).then(() => {
      if (this.closing && this.opening.open === 0) {
        this.finishClosing();
      }
    });
  }

  private setOpen(open: number) {
    this.opening.open = open;
    this.setAlpha(open);
    this.updateBounds();
  }

  private finishClosing() {
    this.closing = false;
    this.shownCardView = undefined;
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
    const shadow = this.scene.add.rectangle(0, 0, WIDTH, HEIGHT, paletteFill('TOOLTIP_FILL'), SHADOW_ALPHA);
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
    const imageY = -(WIDTH - HEIGHT / 2);
    return createCardArtwork(this.scene, card.getImage(), 0, imageY, WIDTH);
  }

  private addCardStrategyObjects(cardView: CardView) {
    return cardView.cardRender.render(cardView.scene, cardView, WIDTH, HEIGHT);
  }

  private buildDescription(cardView: CardView) {
    const { card } = cardView;

    this.nameText.setText(getText(card.name));
    this.canAttackText.setVisible(canAttackThisTurn(cardView));
    this.descriptionText.setText(getText(card.description));
    this.descriptionText.setWordWrapWidth((this.currentWidth - PADDING * 4) / this.contentScale);

    this.alignDescriptionText(card);
  }

  private alignDescriptionText(card: Card) {
    this.nameText.setPosition(0, 0);
    this.canAttackText.setPosition(0, this.nameText.y + this.nameText.height + ATTACK_LINE_GAP);
    const textAbove = this.canAttackText.visible ? this.canAttackText : this.nameText;
    this.descriptionText.setPosition(0, textAbove.y + textAbove.height + DESCRIPTION_GAP);

    this.clearEquipmentTexts();

    let currentY = this.descriptionText.y + this.descriptionText.height + PADDING;
    for (const equipmentCard of card.equipment) {
      currentY = this.renderEquipment(equipmentCard as Card, currentY);
    }
  }

  private clearEquipmentTexts() {
    this.equipmentTexts.forEach(textElement => textElement.destroy());
    this.equipmentTexts = [];
  }

  private renderEquipment(equipmentCard: Card, startYPosition: number): number {
    let currentYPosition = this.renderEquipmentName(getText(equipmentCard.name), startYPosition);

    for (const line of equipmentValueLines(equipmentCard)) {
      currentYPosition = this.renderEquipmentStat(line, currentYPosition);
    }

    return currentYPosition + PADDING;
  }

  private renderEquipmentName(equipmentName: string, startYPosition: number): number {
    const equipmentNameText = this.createText(TEXT_SIZE_LABEL, paletteText('TOOLTIP_EQUIPMENT_NAME'), 'normal');
    equipmentNameText.setText(`${getText('ui.card.equipment')} ${equipmentName}`);
    equipmentNameText.setStroke(paletteText('TEXT_OUTLINE'), 2);
    equipmentNameText.setPosition(0, startYPosition);
    this.addEquipmentText(equipmentNameText);
    return startYPosition + equipmentNameText.height + 6;
  }

  private renderEquipmentStat(line: EquipmentValueLine, startYPosition: number): number {
    const statColor = line.value >= 0 ? paletteText('TOOLTIP_POSITIVE') : paletteText('TOOLTIP_NEGATIVE');
    const statTextElement = this.createText(TEXT_SIZE_NUMBERS, statColor, 'bold');
    statTextElement.setText(line.text);
    statTextElement.setStroke(paletteText('TEXT_OUTLINE'), 3);
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
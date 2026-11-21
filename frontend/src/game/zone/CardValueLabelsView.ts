import type { CardValue } from '@/core/SettingsSystem';
import type Card from '@/domain/Card';
import type { StatisticType } from '@/domain/Statistics';
import type { Point2D, Size2D } from '@/domain/Geometry';
import type { DamageIcon } from '@/game/cards/DamageIcons';
import type ZoneSlotView from '@/game/zone/ZoneSlotView';
import type ZoneView from '@/game/zone/ZoneView';
import Phaser from 'phaser';
import StoreSystem from '@/core/StoreSystem';
import * as Constants from '@/core/Constants';
import { createPanel, createText } from '@/game/hud/HudPieces';
import { damageIconOutline } from '@/game/cards/DamageIcons';
import { paletteFill } from '@/game/utils/Palette';
import CardValueLabelLayout from '@/game/zone/CardValueLabelLayout';

const STATISTIC_BY_CARD_VALUE = new Map<CardValue, StatisticType>([
  ['DAMAGE', 'Damage'],
  ['ARMOR', 'Armor'],
  ['HEALTH', 'Health']
]);

const ICON_BY_CARD_VALUE = new Map<CardValue, DamageIcon>([
  ['DAMAGE', 'SWORD'],
  ['ARMOR', 'SHIELD'],
  ['HEALTH', 'HEART']
]);

interface PlacedLabel {
  label: Phaser.GameObjects.Container;
  /** Size in px on the screen, which does not change with the zoom. */
  size: Size2D;
  center: Point2D;
  slotView: ZoneSlotView;
}

/** The values of the cards of the board that the player turned on, outside each card (VIEW-46, VIEW-47, VIEW-48). */
class CardValueLabelsView extends Phaser.GameObjects.Container {
  private readonly layout = new CardValueLabelLayout();
  private readonly placedLabels: PlacedLabel[];
  private unitsPerPixel = 1;

  /** `skipLeaders` leaves the leaders without a label while they are being placed at the start (VIEW-12). */
  public constructor(scene: Phaser.Scene, zoneViews: ZoneView[], values: readonly CardValue[], skipLeaders = false) {
    super(scene, 0, 0);

    const placed = this.collectPlacedLabels(zoneViews, values, skipLeaders);
    this.placedLabels = this.layout.farthestFirst(placed, this.leaderCenter(zoneViews));
    this.add(this.placedLabels.map((placedLabel) => placedLabel.label));
  }

  /** The labels keep their size on the screen at any zoom, so they are scaled against it (VIEW-46). */
  public applyScale(unitsPerPixel: number) {
    this.unitsPerPixel = unitsPerPixel;

    for (const placedLabel of this.placedLabels) {
      const { position } = this.layout.place(placedLabel.center, placedLabel.slotView.corners, placedLabel.size, unitsPerPixel);
      placedLabel.label.setPosition(position.x, position.y);
      placedLabel.label.setScale(unitsPerPixel);
    }
  }

  public getUnitsPerPixel(): number {
    return this.unitsPerPixel;
  }

  private collectPlacedLabels(zoneViews: ZoneView[], values: readonly CardValue[], skipLeaders: boolean): PlacedLabel[] {
    const placed: PlacedLabel[] = [];

    for (const zoneView of zoneViews) {
      for (const slotView of zoneView.getSlots().flat()) {
        const combatant = slotView.zoneSlot.combatant;
        if (!combatant || (skipLeaders && slotView.zoneSlot.allowedCombatant === 'LEADER')) {
          continue;
        }

        const label = this.createLabel(values.map((value) => this.valueOf(combatant, value)));
        placed.push({ ...label, slotView, center: { x: zoneView.x + slotView.x, y: zoneView.y + slotView.y } });
      }
    }

    return placed;
  }

  private valueOf(combatant: Card, value: CardValue) {
    const statistic = combatant.getStatistic(STATISTIC_BY_CARD_VALUE.get(value)!);

    return { text: `${statistic?.value ?? 0}`, icon: ICON_BY_CARD_VALUE.get(value)! };
  }

  private createLabel(values: { text: string; icon: DamageIcon }[]): Pick<PlacedLabel, 'label' | 'size'> {
    const texts = values.map((value) => createText(this.scene, 'LABEL', { color: 'HUD_TEXT' }, value.text));
    const iconWidth = Constants.CARD_VALUE_LABEL_ICON_SIZE + Constants.CARD_VALUE_LABEL_ICON_GAP;
    const textsWidth = texts.reduce((total, text) => total + iconWidth + text.width, 0) + Constants.CARD_VALUE_LABEL_GAP * (texts.length - 1);
    const size = {
      width: textsWidth + 2 * Constants.CARD_VALUE_LABEL_PADDING,
      height: texts[0].height + 2 * Constants.CARD_VALUE_LABEL_PADDING
    };

    const panel = createPanel(this.scene, 'HUD');
    panel.setSize(size.width, size.height);

    const label = this.scene.add.container(0, 0, [panel]);
    let textX = -textsWidth / 2;
    texts.forEach((text, index) => {
      label.add(this.createIcon(values[index].icon, textX + Constants.CARD_VALUE_LABEL_ICON_SIZE / 2));
      text.setOrigin(0, 0.5);
      text.setPosition(textX + iconWidth, 0);
      textX += iconWidth + text.width + Constants.CARD_VALUE_LABEL_GAP;
      label.add(text);
    });

    return { label, size };
  }

  private createIcon(icon: DamageIcon, centerX: number): Phaser.GameObjects.Graphics {
    const points = damageIconOutline(icon, Constants.CARD_VALUE_LABEL_ICON_SIZE);
    const graphics = this.scene.add.graphics();

    graphics.fillStyle(paletteFill('HUD_TEXT'), 1);
    graphics.beginPath();
    graphics.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach((point) => graphics.lineTo(point.x, point.y));
    graphics.closePath();
    graphics.fillPath();
    graphics.setPosition(centerX, 0);

    return graphics;
  }

  /** The leader slot of the local player's zone, which is what `VIEW-48` measures the distances from. */
  private leaderCenter(zoneViews: ZoneView[]): Point2D {
    const ownZoneView = zoneViews.find((zoneView) => zoneView.zone.isPlayerOwner(StoreSystem.getPlayer()));
    const leaderSlot = ownZoneView?.getSlots().flat().find((slotView) => slotView.zoneSlot.allowedCombatant === 'LEADER');

    return ownZoneView && leaderSlot ? { x: ownZoneView.x + leaderSlot.x, y: ownZoneView.y + leaderSlot.y } : { x: 0, y: 0 };
  }
}

export default CardValueLabelsView;

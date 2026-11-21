import type { GameScene } from "@/scenes/Game";
import type ZoneSlotView from "@/game/zone/ZoneSlotView";
import type CombatantView from "@/game/cards/CombatantView";
import { LIFT_SHADOW_ALPHA } from "@/core/Constants";
import { playMotion } from "@/core/visual_effects/Motion";
import { paletteFill } from "@/game/utils/Palette";
import { shadowOffset, shadowOutline } from "@/game/zone/CardLiftLayout";

/** How much a card grows when it is lifted, and how far down its shadow falls, as a fraction of the height of the card (VIEW-4). */
type LiftSize = { scale: number; shadowOffset: number };

/** A card of the board that grows from its center, with a shadow under it and above every other card (VIEW-4). */
class CardLift {
  private readonly scene: GameScene;
  private readonly slot: ZoneSlotView;
  private readonly size: LiftSize;
  private shadow?: Phaser.GameObjects.Graphics;

  public constructor(scene: GameScene, slot: ZoneSlotView, size: LiftSize) {
    this.scene = scene;
    this.slot = slot;
    this.size = size;
  }

  public lift(): void {
    const card = this.slot.getCombatant();
    if (!card) {
      return;
    }

    this.scene.raiseSlot(this.slot);
    this.slot.setReadyMarkVisible(false);
    this.showShadow(card);
    this.scaleCard(card, this.size.scale);
  }

  /** Frames the lifted card, green if it can be attacked and red, with the crossed circle, if not (VIEW-4). */
  public frame(isValid: boolean): void {
    if (isValid) {
      this.slot.showMarker(paletteFill('MARK_VALID'));
    } else {
      this.slot.showMarker(paletteFill('MARK_INVALID'));
      this.slot.showForbiddenIcon();
    }
  }

  /** The frame goes at once, and the card ends at its rest size with its shadow gone (VIEW-4). */
  public lower(): void {
    if (!this.slot.active) {
      return;
    }

    this.slot.hideMarker();
    this.slot.setReadyMarkVisible(true);
    this.hideShadow();

    const card = this.slot.getCombatant();
    if (card) {
      this.scaleCard(card, 1);
    }
  }

  private scaleCard(card: CombatantView, factor: number): void {
    const rest = card.getOriginalScale();
    this.scene.tweens.killTweensOf(card);

    void playMotion(this.scene, {
      targets: card,
      to: { scaleX: rest.scaleX * factor, scaleY: (rest.scaleY ?? rest.scaleX) * factor },
      duration: 'FAST',
      curve: 'ENTER',
      kind: 'ESSENTIAL'
    });
  }

  /** The shadow has the shape of the card, so it grows from the same point and falls down on the screen (VIEW-4). */
  private showShadow(card: CombatantView): void {
    const pivot = card.getOriginalPosition();
    const world = this.slot.getWorldTransformMatrix();
    const offset = shadowOffset(this.slot.corners, this.size.shadowOffset, { rotation: world.rotation, scale: world.scaleX });

    this.shadow?.destroy();
    this.shadow = this.scene.add.graphics();
    this.shadow.fillStyle(paletteFill('LIFT_SHADOW'), 1);
    const [first, ...rest] = shadowOutline(this.slot.corners, pivot);
    this.shadow.beginPath();
    this.shadow.moveTo(first.x, first.y);
    for (const point of rest) {
      this.shadow.lineTo(point.x, point.y);
    }
    this.shadow.closePath();
    this.shadow.fillPath();
    this.shadow.setPosition(pivot.x, pivot.y);
    this.shadow.setAlpha(0);
    this.slot.addAt(this.shadow, this.slot.getIndex(card));

    void playMotion(this.scene, {
      targets: this.shadow,
      to: {
        x: pivot.x + offset.x,
        y: pivot.y + offset.y,
        scaleX: this.size.scale,
        scaleY: this.size.scale,
        alpha: LIFT_SHADOW_ALPHA
      },
      duration: 'FAST',
      curve: 'ENTER',
      kind: 'ESSENTIAL'
    });
  }

  private hideShadow(): void {
    const shadow = this.shadow;
    const card = this.slot.getCombatant();
    this.shadow = undefined;
    if (!shadow) {
      return;
    }

    this.scene.tweens.killTweensOf(shadow);
    const pivot = card?.getOriginalPosition() ?? { x: shadow.x, y: shadow.y };

    void playMotion(this.scene, {
      targets: shadow,
      to: { x: pivot.x, y: pivot.y, scaleX: 1, scaleY: 1, alpha: 0 },
      duration: 'FAST',
      curve: 'ENTER',
      kind: 'ESSENTIAL'
    }).then(() => shadow.destroy());
  }
}

export type { LiftSize };
export default CardLift;

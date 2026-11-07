import applyAnimation from "@/core/visual_effects/ZoneSlotAnimation";
import InteractiveObjectManager from "@/core/interactions/InteractiveObjectManager";
import { ZoneSlotAnimations } from "@/core/visual_effects/ZoneSlotAnimation";
import type Card from "@/domain/Card";
import type Zone from "@/domain/Zone";
import ZoneSlot from "@/domain/ZoneSlot";
import { Corners3D, OrientedBoundingBox3D, Point3D, Rotation } from "@/domain/Geometry";
import StoreSystem from "@/core/StoreSystem";
import ZoneSlotViewRenderer from "@/game/zone/ZoneSlotViewRenderer";
import zoneSlotCardHelper from "@/game/zone/ZoneSlotCardHelper";
import CombatantView from "@/game/cards/CombatantView";
import { HIT_FLASH_DURATION_MS } from "@/core/Constants";

class ZoneSlotView extends Phaser.GameObjects.Container implements CombatantViewHolder {
  private backgroundGraphics: Phaser.GameObjects.Graphics;
  private mark: Phaser.GameObjects.Image;
  private cardView: CombatantView | null;

  private previewedCardView?: CombatantView | null;
  public zone: Zone;

  public readonly zoneSlot: ZoneSlot;
  public readonly centerPoint: Point3D;
  public readonly corners: Corners3D;
  public readonly slotRotation: Rotation;

  constructor(
    scene: Phaser.Scene, 
    orientedBoundingBox: OrientedBoundingBox3D,
    zoneSlot: ZoneSlot
  ) {
    super(scene, orientedBoundingBox.x, orientedBoundingBox.y);
    this.scale = 1;
    this.centerPoint = orientedBoundingBox;
    this.corners = orientedBoundingBox.corners;
    this.slotRotation = orientedBoundingBox.rotation;

    this.cardView = null;
    this.zoneSlot = zoneSlot;

    this.initializeView();
    this.setupHitArea();

    InteractiveObjectManager.registerGameObject(this.scene, this);
  }

  private setupHitArea() {
    const polygon = new Phaser.Geom.Polygon([
      this.corners.tl.x, this.corners.tl.y,
      this.corners.tr.x, this.corners.tr.y,
      this.corners.br.x, this.corners.br.y,
      this.corners.bl.x, this.corners.bl.y
    ]);
    
    this.setInteractive(polygon, Phaser.Geom.Polygon.Contains, true);

    const debugGraphics = this.scene.add.graphics();
    debugGraphics.lineStyle(2, 0xff0000, 1);
    debugGraphics.strokePoints(polygon.points, true);
    this.add(debugGraphics);
  }

  private initializeView() {
    this.backgroundGraphics = this.scene.add.graphics();
    this.mark = this.scene.add.image(0, 0, this.zoneSlot.getMaskTexture());

    ZoneSlotViewRenderer.render(this.backgroundGraphics, this.mark, this);

    this.add([ this.backgroundGraphics, this.mark ]);
  }

  public setZone(zone: Zone) {
    this.zone = zone;
  }

  public canReceive(card: Card): boolean {
    const player = StoreSystem.getPlayer();

    return this.zone.canPlaceCard(this.zoneSlot.position, card, player);
  }

  /** Whether the card in `source` can be moved or swapped here (BOARD-7). */
  public canReceiveFrom(source: ZoneSlotView): boolean {
    const player = StoreSystem.getPlayer();

    return this.zone.canMoveCard(source.zoneSlot, this.zoneSlot, player);
  }

  /** Whether the card here can attack the card in `target` (COMBAT-11, COMBAT-12). */
  public canAttack(target: ZoneSlotView): boolean {
    const player = StoreSystem.getPlayer();

    return this.zone.canAttackCard(this.zoneSlot, target.zone, target.zoneSlot, player);
  }

  /** Shows a card here while the server answers, without changing the game state (ARCH-2). */
  public holdCard(combatantView: CombatantView) {
    this.cardView = combatantView;
    this.add(this.cardView);

    zoneSlotCardHelper.applyCardTransformations(this, combatantView);
  }

  public releaseCard(): CombatantView | null {
    const heldCard = this.cardView;
    if (heldCard) {
      this.remove(heldCard);
      this.cardView = null;
    }

    return heldCard;
  }

  public setCard(combatantView: CombatantView) {
    this.zoneSlot.combatant = combatantView.combatant;
    this.cardView = combatantView;
    this.add(this.cardView);

    zoneSlotCardHelper.applyCardTransformations(this, combatantView);
  }

  public removeCard() {
    this.zoneSlot.combatant = null;
    if (this.cardView) {
      this.remove(this.cardView);
      this.cardView = null;
    }
  }

  public previewCard(view: CombatantView) {
    if (!this.previewedCardView) {
      this.previewedCardView = view;

      zoneSlotCardHelper.previewCard(this, view);
    }
  }

  public stopPreviewingCard() {
    if (this.previewedCardView) {
      this.scene.tweens.killTweensOf(this.previewedCardView);
      this.previewedCardView = null;
    }
  }

  public getCard(): CombatantView | null {
    return this.cardView;
  }

  public getCombatant(): CombatantView | null {
    return this.cardView;
  }

  /** Covers the slot with a color that fades out, for the hit of an attack (VIEW-5). */
  public flash(color: number): Promise<void> {
    const flashGraphics = this.scene.add.graphics();
    ZoneSlotViewRenderer.renderBackground(flashGraphics, this.corners, color, color);
    this.add(flashGraphics);

    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: flashGraphics,
        alpha: 0,
        duration: HIT_FLASH_DURATION_MS,
        onComplete: () => {
          flashGraphics.destroy();
          resolve();
        }
      });
    });
  }

  public setBackgroundColor(color: number, borderColor?: number): void {
    ZoneSlotViewRenderer.renderBackground(this.backgroundGraphics, this.corners, color, borderColor);
  }

  public applyAnimation(animation: ZoneSlotAnimations) {
    applyAnimation(this, animation);
  }

  public canBeClicked(): boolean {
    return false;
  }

  protected preDestroy(): void {
    super.preDestroy();
    InteractiveObjectManager.unregisterGameObject(this.scene, this);

    if (this.cardView) {
      this.cardView.destroy();
      this.cardView = null;
    }
  }

  public get combatant(): CombatantView | null {
    return this.cardView;
  }
}

export default ZoneSlotView;
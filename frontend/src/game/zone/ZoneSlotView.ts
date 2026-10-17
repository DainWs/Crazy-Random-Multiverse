import applyAnimation from "@/core/visual_effects/ZoneSlotAnimation";
import InteractiveObjectManager from "@/core/interactions/InteractiveObjectManager";
import { ZoneSlotAnimations } from "@/core/visual_effects/ZoneSlotAnimation";
import ZoneSlot from "@/domain/ZoneSlot";
import { Corners3D, OrientedBoundingBox3D, Point3D, Rotation } from "@/domain/Geometry";
import ZoneSlotViewRenderer from "@/game/zone/ZoneSlotViewRenderer";
import zoneSlotCardHelper from "@/game/zone/ZoneSlotCardHelper";
import CombatantView from "@/game/cards/CombatantView";

class ZoneSlotView extends Phaser.GameObjects.Container implements CombatantViewHolder {
  private backgroundGraphics: Phaser.GameObjects.Graphics;
  private mark: Phaser.GameObjects.Image;
  private cardView: CombatantView | null;

  private previewedCardView?: CombatantView | null;

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
    this.mark = this.scene.add.image(0, 0, `zoneslot-mark-${this.zoneSlot.allowedCombatant.toLowerCase()}`);

    ZoneSlotViewRenderer.render(this.backgroundGraphics, this.mark, this);

    this.add([ this.backgroundGraphics, this.mark ]);
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
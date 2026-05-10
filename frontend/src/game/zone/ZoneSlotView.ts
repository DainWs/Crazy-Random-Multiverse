import applyAnimation from "@/core/visual_effects/ZoneSlotAnimation";
import InteractiveObjectManager from "@/core/interactions/InteractiveObjectManager";
import { ZoneSlotAnimations } from "@/core/visual_effects/ZoneSlotAnimation";
import { CombatantCard } from "@/domain/Card";
import ZoneSlot from "@/domain/ZoneSlot";
import { CardView } from "@/game/cards/CardView";
import { Corners3D, OrientedBoundingBox3D, Point3D, Rotation } from "@/domain/Geometry";
import ZoneSlotViewRenderer from "@/game/zone/ZoneSlotViewRenderer";

class ZoneSlotView extends Phaser.GameObjects.Container {
  private backgroundGraphics: Phaser.GameObjects.Graphics;
  private mark: Phaser.GameObjects.Image;
  private cardView: CardView | null;

  private previewedCardView?: CardView | null;

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
    this.width = orientedBoundingBox.width;
    this.height = orientedBoundingBox.height;
    this.centerPoint = orientedBoundingBox;
    this.corners = orientedBoundingBox.corners;
    this.slotRotation = orientedBoundingBox.rotation;

    this.cardView = null;
    this.zoneSlot = zoneSlot;

    this.initializeView();

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

    InteractiveObjectManager.registerGameObject(this.scene, this);
  }

  private initializeView() {
    this.backgroundGraphics = this.scene.add.graphics();
    this.mark = this.scene.add.image(0, 0, `zoneslot-mark-${this.zoneSlot.allowedCombatant.toLowerCase()}`);

    ZoneSlotViewRenderer.render(this.backgroundGraphics, this.mark, this);

    this.add([ this.backgroundGraphics, this.mark ]);
  }

  public setCard(cardView: CardView | null) {
    if (cardView) {
      this.zoneSlot.combatant = cardView.card as CombatantCard;

      this.cardView = cardView;
      this.add(this.cardView);

      this.cardView.setPosition(0, 0);
      this.cardView.setOriginalPosition(0, 0);
      this.cardView.setScale(this.centerPoint.scale);
      this.cardView.setAngle(this.slotRotation); 
    } else {
      this.zoneSlot.combatant = null;
      if (this.cardView) {
        this.remove(this.cardView);
      }
      this.cardView = null;
    }
  }

  public previewCard(cardView: CardView) {
    if (!this.previewedCardView) {
      this.previewedCardView = cardView;

      const worldMatrix = this.getWorldTransformMatrix();
      const tweenArgs = [worldMatrix.tx, worldMatrix.ty, this.centerPoint.scale, this.slotRotation];
      cardView.applyTween('preview_in_zone_slot', ...tweenArgs);
    }
  }

  public stopPreviewingCard() {
    if (this.previewedCardView) {
      this.previewedCardView.stopTweens();
      this.previewedCardView = null;
    }
  }

  public getCard(): CardView | null {
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
}

export default ZoneSlotView;
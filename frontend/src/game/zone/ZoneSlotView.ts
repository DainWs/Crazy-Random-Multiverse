import applyAnimation from "@/core/visual_effects/ZoneSlotAnimation";
import InteractiveObjectManager from "@/core/interactions/InteractiveObjectManager";
import { ZoneSlotAnimations } from "@/core/visual_effects/ZoneSlotAnimation";
import { CombatantCard } from "@/domain/Card";
import ZoneSlot from "@/domain/ZoneSlot";
import { CardView } from "@/game/cards/CardView";
import { SlotLogicalBounds } from "@/game/zone/ZoneView";
import ProjectionSystem from "@/core/ProjectionSystem";

class ZoneSlotView extends Phaser.GameObjects.Container {
  private backgroundGraphics: Phaser.GameObjects.Graphics;
  private mark: Phaser.GameObjects.Image;
  private cardView: CardView | null;

  public readonly zoneSlot: ZoneSlot;
  private logicalBounds: SlotLogicalBounds;

  constructor(
    scene: Phaser.Scene, 
    bounds: SlotLogicalBounds,
    zoneSlot: ZoneSlot
  ) {
    super(scene, 0, 0);
    this.logicalBounds = bounds;
    this.scale = 1;
    this.width = bounds.width;
    this.height = bounds.height;

    this.cardView = null;
    this.zoneSlot = zoneSlot;

    this.initializeView();

    const quad = this.getProjectedQuad();
    const polygon = new Phaser.Geom.Polygon([
      quad.tl.x, quad.tl.y,
      quad.tr.x, quad.tr.y,
      quad.br.x, quad.br.y,
      quad.bl.x, quad.bl.y
    ]);
    this.setInteractive(polygon, Phaser.Geom.Polygon.Contains, true);

    scene.add.existing(this)
    InteractiveObjectManager.registerGameObject(this.scene, this);
  }

  private getProjectedQuad() {
    const rad = Phaser.Math.DegToRad(this.logicalBounds.rotation);
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const hw = this.logicalBounds.width / 2;
    const hh = this.logicalBounds.height / 2;

    const getCorner = (lx: number, ly: number) => {
        const bx = this.logicalBounds.boardX + lx * cos - ly * sin;
        const by = this.logicalBounds.boardY + lx * sin + ly * cos;
        return ProjectionSystem.toPoint3D({ x: bx, y: by });
    };

    return {
        tl: getCorner(-hw, -hh),
        tr: getCorner(hw, -hh),
        br: getCorner(hw, hh),
        bl: getCorner(-hw, hh)
    };
  }

  private initializeView() {
    this.backgroundGraphics = this.scene.add.graphics();

    this.drawBackground(0xffffff, 0x4488cc);

    const centerProj = ProjectionSystem.toPoint3D({ x: this.logicalBounds.boardX, y: this.logicalBounds.boardY });

    this.setDepth(centerProj.z);

    this.mark = this.scene.add.image(centerProj.x, centerProj.y, `zoneslot-mark-${this.zoneSlot.allowedCombatant.toLowerCase()}`);
    this.mark.setScale(4 * centerProj.scale);
    this.mark.setOrigin(0.5, 0.5);
    this.mark.setAlpha(0.8);
    this.mark.setAngle(this.logicalBounds.rotation);

    this.add([ this.backgroundGraphics, this.mark ]);
  }

  private drawBackground(color: number, borderColor?: number) {
    this.backgroundGraphics.clear();
    const quad = this.getProjectedQuad();
    
    const alpha = (color === 0xffffff) ? 0.45 : 0.35;
    
    this.backgroundGraphics.fillStyle(color, alpha);
    if (borderColor) {
        this.backgroundGraphics.lineStyle(2, borderColor, 0.8);
    } else {
        this.backgroundGraphics.lineStyle(2, 0x4488cc, 0.8);
    }
    
    this.backgroundGraphics.beginPath();
    this.backgroundGraphics.moveTo(quad.tl.x, quad.tl.y);
    this.backgroundGraphics.lineTo(quad.tr.x, quad.tr.y);
    this.backgroundGraphics.lineTo(quad.br.x, quad.br.y);
    this.backgroundGraphics.lineTo(quad.bl.x, quad.bl.y);
    this.backgroundGraphics.closePath();
    
    this.backgroundGraphics.fillPath();
    this.backgroundGraphics.strokePath();
  }

  public setCard(cardView: CardView | null) {
    if (cardView) {
      this.zoneSlot.combatant = cardView.card as CombatantCard;

      this.cardView = cardView;
      this.add(this.cardView);

      const centerProj = ProjectionSystem.toPoint3D({ x: this.logicalBounds.boardX, y: this.logicalBounds.boardY });

      this.cardView.setPosition(centerProj.x, centerProj.y);
      this.cardView.setOriginalPosition(centerProj.x, centerProj.y);
      this.cardView.setScale(centerProj.scale);
      this.cardView.setAngle(this.logicalBounds.rotation); 
    } else {
      this.zoneSlot.combatant = null;
      if (this.cardView) {
        this.remove(this.cardView);
      }
      this.cardView = null;
    }
  }

  public getCard(): CardView | null {
    return this.cardView;
  }

  public setBackgroundColor(color: number, borderColor?: number): void {
    this.drawBackground(color, borderColor);
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
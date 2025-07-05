import applyAnimation from "@/core/visual_effects/ZoneSlotAnimation";
import InteractiveObjectManager from "@/core/interactions/InteractiveObjectManager";
import { ZoneSlotAnimations } from "@/core/visual_effects/ZoneSlotAnimation";
import { CombatantCard } from "@/domain/Card";
import ZoneSlot from "@/domain/ZoneSlot";
import { CardView } from "@/game/cards/CardView";

class ZoneSlotView extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Rectangle;
  private mark: Phaser.GameObjects.Image;
  private cardView: CardView | null;

  public readonly zoneSlot: ZoneSlot;

  constructor(
    scene: Phaser.Scene, 
    x: number, 
    y: number,
    zoneSlot: ZoneSlot
  ) {
    super(scene, x, y);
    this.scale = 1;
    this.width = 200;
    this.height = 300;

    this.cardView = null;
    this.zoneSlot = zoneSlot;

    this.initializeView()

    const isADropZone = true;
    this.setInteractive(undefined, undefined, isADropZone);

    scene.add.existing(this)
    InteractiveObjectManager.registerGameObject(this.scene, this);
  }

  private initializeView() {
    this.background = this.scene.add.rectangle(0, 0, this.displayWidth, this.displayHeight, 0xffffff);
    this.background.setStrokeStyle(3, 0x000000);

    this.mark = this.scene.add.image(0, 0, `zoneslot-mark-${this.zoneSlot.allowedCombatant.toLowerCase()}`);
    this.mark.setScale(4);
    this.mark.setOrigin(0.5, 0.5);

    this.add([ this.background, this.mark ]);
  }

  public placeCard(cardView: CardView): boolean {
    if (this.cardView || !cardView.card.isCombatant()) return false;

    this.zoneSlot.combatant = cardView.card as CombatantCard;

    const bounds = this.getBounds();
    this.cardView = cardView;
    this.cardView.setPosition(bounds.centerX, bounds.centerY);
    this.cardView.setDisplaySize(this.width, this.height);
    return true;
  }

  public clearCard(): boolean {
    if (!this.cardView) return false;

    this.zoneSlot.combatant = null;
    this.cardView = null;
    return true;
  }

  public hasCard(card?: CardView): boolean {
    if (card) {
      return this.cardView === card;
    }

    return this.cardView !== null;
  }

  public getCard(): CardView | null {
    return this.cardView;
  }

  public setBackgroundColor(color: number, borderColor?: number): void {
    this.background.setFillStyle(color);

    if (borderColor) {
      console.log(borderColor)
      this.background.setStrokeStyle(3, borderColor);
    }
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
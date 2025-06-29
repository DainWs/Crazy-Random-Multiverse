import { CombatantCard } from "@/domain/Card";
import ZoneSlot from "@/domain/ZoneSlot";
import { CardView } from "@/game/cards/CardView";
import { GameScene } from "@/game/scenes/Game";

class ZoneSlotView extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Rectangle;
  private mark: Phaser.GameObjects.Image;
  private card: CardView | null;

  public readonly zoneSlot: ZoneSlot;

  constructor(
    scene: GameScene, 
    x: number, 
    y: number,
    zoneSlot: ZoneSlot
  ) {
    super(scene, x, y);
    this.scale = 1;

    this.card = null;
    this.zoneSlot = zoneSlot;

    this.initializeView()

    const isADropZone = true;
    this.setInteractive(undefined, undefined, isADropZone);

    scene.add.existing(this)
    scene.interactionSystem.registerSlot(this);
  }

  private initializeView() {
    this.background = this.scene.add.rectangle(0, 0, this.displayWidth, this.displayHeight, 0xffffff);
    this.background.setStrokeStyle(4, 0x000000);

    this.mark = this.scene.add.image(0, 0, `zoneslot-mark-${this.zoneSlot.allowedCombatant.toLowerCase()}`);
    this.mark.setScale(4);
    this.mark.setOrigin(0.5, 0.5);

    this.add([ this.background, this.mark ]);
  }

  public placeCard(cardView: CardView): boolean {
    if (this.card || !cardView.card.isCombatant()) return false;

    this.zoneSlot.combatant = cardView.card as CombatantCard;

    const bounds = this.getBounds();
    this.card = cardView;
    this.card.setPosition(bounds.centerX, bounds.centerY);
    this.card.setDisplaySize(this.width, this.height);
    return true;
  }

  public clearCard(): boolean {
    if (!this.card) return false;

    this.zoneSlot.combatant = null;
    this.card = null;
    return true;
  }

  public hasCard(card?: CardView): boolean {
    if (card) {
      return this.card === card;
    }

    return this.card !== null;
  }

  public getCard(): CardView | null {
    return this.card;
  }

  public highlight(): void {
    this.background.setFillStyle(0xaaffaa)
  }

  public clearHighlight(): void {
    this.background.setFillStyle(0xffffff)
  }
}

export default ZoneSlotView;
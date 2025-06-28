import { ZonePosition } from "@/domain/Position";
import { CardView } from "@/game/cards/CardView";
import { GameScene } from "@/game/scenes/Game";

type AllowedCombatant = 'LEADER' | 'WARRIOR';
type ZoneSlotDefinition = {
  position: ZonePosition;
  allowedCombatant: AllowedCombatant;
}

class ZoneSlot extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Rectangle;
  private mark: Phaser.GameObjects.Image;
  private card: CardView | null;

  public readonly definition: ZoneSlotDefinition;

  constructor(
    scene: GameScene, 
    x: number, 
    y: number,
    definition: ZoneSlotDefinition
  ) {
    super(scene, x, y);
    this.scale = 1;
    this.width = 200;
    this.height = 300;

    this.card = null;
    this.definition = definition;

    this.initializeView()

    const isADropZone = true;
    this.setInteractive(undefined, undefined, isADropZone);

    scene.add.existing(this)
    //scene.physics.add.existing(this, true)
    scene.interactionSystem.registerSlot(this);
  }

  private initializeView() {
    this.background = this.scene.add.rectangle(0, 0, this.displayWidth, this.displayHeight, 0xCCCCCC);
    this.background.setStrokeStyle(2, 0x444444);
    //this.background.setOrigin(0);

    this.mark = this.scene.add.image(0, 0, `zoneslot-mark-${this.definition.allowedCombatant.toLowerCase()}`);
    this.mark.setScale(4);
    this.mark.setOrigin(0.5, 0.5);

    this.add([ this.background, this.mark ]);
  }

  public placeCard(card: CardView): boolean {
    if (this.card) return false;

    const bounds = this.getBounds();

    this.card = card;
    this.card.setPosition(bounds.centerX, bounds.centerY);
    this.card.setDisplaySize(this.width, this.height);
    return true;
  }

  public clearCard(): boolean {
    if (!this.card) return false;

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
    this.background.setFillStyle(0xcccccc)
  }
}

export type { ZoneSlotDefinition };
export default ZoneSlot;
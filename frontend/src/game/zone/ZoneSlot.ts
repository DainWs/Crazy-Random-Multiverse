import { CardView } from "@/game/cards/CardView";
import { GameScene } from "@/game/scenes/Game";

type AllowedCombatant = 'Leader' | 'Warrior';

class ZoneSlot extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Rectangle;
  private card: CardView | null;

  private allowedCombatant: AllowedCombatant;

  constructor(
    scene: GameScene, 
    x: number, 
    y: number,
    allowedCombatant: AllowedCombatant = 'Warrior'
  ) {
    super(scene, x, y);
    this.scale = 1;
    this.width = 200;
    this.height = 300;

    this.card = null;
    this.allowedCombatant = allowedCombatant;

    this.initializeView()

    scene.add.existing(this)
    //scene.physics.add.existing(this, true)
    scene.interactionSystem.registerSlot(this);
  }

  private initializeView() {
    this.background = this.scene.add.rectangle(0, 0, this.displayWidth, this.displayHeight, 0xCCCCCC);
    this.background.setStrokeStyle(2, 0x444444);
    //this.background.setOrigin(0);

    this.add(this.background);
  }

  public placeCard(card: CardView): boolean {
    if (this.card) return false;

    this.card = card;
    this.card.setPosition(0, 0);
    this.card.setDisplaySize(this.width, this.height);
    this.card.setInteractive({ useHandCursor: true });
    this.scene.input.setDraggable(this.card);
  
    this.add(this.card);
    return true;
  }

  public clearCard(): boolean {
    if (!this.card) return false;

    this.remove(this.card);
    this.card = null;
    return true;
  }

  public hasCard(card?: CardView): boolean {
    if (card) {
      return this.card === card;
    }

    return this.card !== null;
  }

  public highlight(): void {
    this.background.setFillStyle(0xaaffaa)
  }

  public clearHighlight(): void {
    this.background.setFillStyle(0xcccccc)
  }
}

export default ZoneSlot;
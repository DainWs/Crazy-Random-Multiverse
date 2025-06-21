import { GameScene } from "@/game/scenes/Game";
import ZoneSlot from "@/game/zone/ZoneSlot"

interface ZoneConfig {
  slots?: number[];
  spacing?: number
}

const defaultSlots = [3, 3, 1];
const defaultSpacing = 10;

class ZoneView extends Phaser.GameObjects.Container {
  private readonly slots: ZoneSlot[][];

  constructor(
    scene: GameScene, 
    x: number, 
    y: number, 
    config: ZoneConfig = {}
  ) {
    super(scene, x, y);
    const slotsTemplate = config.slots ?? defaultSlots;
    const spacing = config.spacing ?? defaultSpacing;

    this.slots = [];
    for (let row = 0; row < slotsTemplate.length; row++) {
      this.slots[row] = [];

      for (let col = 0; col < slotsTemplate[row]; col++) {
        const zoneSlotView = new ZoneSlot(scene, 0, 0);
        
        const posX = col * (zoneSlotView.displayWidth + spacing);
        const posY = row * (zoneSlotView.displayHeight + spacing);
        zoneSlotView.setPosition(posX, posY);
        
        this.slots[row][col] = zoneSlotView;
        this.add(zoneSlotView);
      }
    }

    this.scene.add.existing(this)
  }

  public getSlots(): ZoneSlot[][] {
    return this.slots
  }
}

export default ZoneView;
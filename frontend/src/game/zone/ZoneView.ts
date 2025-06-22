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

    let maxHorizontalSlots = 0;
    let maxVerticalSlots = slotsTemplate.length;

    this.slots = [];
    for (let row = 0; row < slotsTemplate.length; row++) {
      this.slots[row] = [];
      if (slotsTemplate[row] > maxHorizontalSlots) maxHorizontalSlots = slotsTemplate[row];

      for (let col = 0; col < slotsTemplate[row]; col++) {
        const zoneSlotView = new ZoneSlot(scene, 0, 0);
        
        const posX = col * (zoneSlotView.displayWidth + spacing);
        const posY = row * (zoneSlotView.displayHeight + spacing);

        if (slotsTemplate[row] == 1) {
          const halfCol = Math.trunc(maxHorizontalSlots / 2);
          zoneSlotView.setPosition(halfCol * (zoneSlotView.displayWidth + spacing), posY);
        } else {
          zoneSlotView.setPosition(posX, posY);
        }
        
        this.slots[row][col] = zoneSlotView;
        this.add(zoneSlotView);
      }
    }

    this.scale = 1
    this.width = maxHorizontalSlots * (200 + spacing);
    this.height = maxVerticalSlots * (300 + spacing);

    this.scene.add.existing(this)
  }

  public getSlots(): ZoneSlot[][] {
    return this.slots
  }
}

export default ZoneView;
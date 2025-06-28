import { ZonePosition } from "@/domain/Position";
import { GameScene } from "@/game/scenes/Game";
import ZoneSlot, { ZoneSlotDefinition } from "@/game/zone/ZoneSlot"

type AllowedCombatant = 'LEADER' | 'WARRIOR';
type ZoneSlotConfig = {
  columnCount: number;
  allowedCombatant: AllowedCombatant;
}

interface ZoneConfig {
  maxColumns?: number;
  spacing?: number
  zoneSlotConfigs?: ZoneSlotConfig[];
}

const defaultMaxColumns = 3;
const defaultSpacing = 10;
const defaultZoneSlotConfig: ZoneSlotConfig[] = [
  { columnCount: 3, allowedCombatant: 'WARRIOR' },
  { columnCount: 3, allowedCombatant: 'WARRIOR' },
  { columnCount: 1, allowedCombatant: 'LEADER' }
];

class ZoneView extends Phaser.GameObjects.Container {
  private readonly slots: ZoneSlot[][];

  constructor(
    scene: GameScene, 
    x: number, 
    y: number, 
    config: ZoneConfig = {}
  ) {
    super(scene, x, y);
    const maxColumns = config.maxColumns ?? defaultMaxColumns;
    const spacing = config.spacing ?? defaultSpacing;
    const zoneSlotConfigs = config.zoneSlotConfigs ?? defaultZoneSlotConfig;

    this.slots = [];
    for (let row = 0; row < zoneSlotConfigs.length; row++) {
      this.slots[row] = [];

      for (let col = 0; col < zoneSlotConfigs[row].columnCount; col++) {
        const definition: ZoneSlotDefinition = {
          position: new ZonePosition(row, col),
          allowedCombatant: zoneSlotConfigs[row].allowedCombatant
        };

        const zoneSlotView = new ZoneSlot(scene, 0, 0, definition);
        const posX = col * (zoneSlotView.displayWidth + spacing);
        const posY = row * (zoneSlotView.displayHeight + spacing);

        if (zoneSlotConfigs[row].columnCount === 1) {
          const halfCol = Math.trunc(maxColumns / 2);
          zoneSlotView.setPosition(halfCol * (zoneSlotView.displayWidth + spacing), posY);
        } else {
          zoneSlotView.setPosition(posX, posY);
        }
        
        this.slots[row][col] = zoneSlotView;
        this.add(zoneSlotView);
      }
    }

    this.scale = 1
    this.width = maxColumns * (200 + spacing);
    this.height = zoneSlotConfigs.length * (300 + spacing);

    this.scene.add.existing(this)
  }

  public getSlots(): ZoneSlot[][] {
    return this.slots
  }
}

export default ZoneView;
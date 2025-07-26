import { GameScene } from "@/scenes/Game";
import Zone from "@/domain/Zone";
import { ZonePosition } from "@/domain/Position";
import ZoneSlotView from "@/game/zone/ZoneSlotView"

interface ZoneViewOptions {
  spaceBetweenSlots?: number;
}

type AllZoneViewOptions = Required<ZoneViewOptions>;
const defaultOptions: AllZoneViewOptions = {
  spaceBetweenSlots: 10
};

class ZoneView extends Phaser.GameObjects.Container {
  private readonly options: AllZoneViewOptions;
  private readonly slots: ZoneSlotView[][];
  
  public readonly zone: Zone;

  constructor(
    scene: GameScene, 
    x: number, 
    y: number, 
    zone: Zone,
    options: ZoneViewOptions = defaultOptions
  ) {
    super(scene, x, y);
    console.log('ZoneView created', this.x, this.y);
    this.options = { ...defaultOptions, ...options };
    this.slots = [];
    this.zone = zone;
    this.scale = 1

    this.initializeView();

    const bounds = this.getBounds();
    this.width = bounds.width;
    this.height = bounds.height;

    this.scene.add.existing(this)
  }

  private initializeView() {
    const zoneSlots = this.zone.slots.flatMap(row => row);
    for (const zoneSlot of zoneSlots) {
      const zoneSlotView = new ZoneSlotView(this.scene as GameScene, 0, 0, zoneSlot);

      const position = zoneSlot.position;
      const x = this.resolveXForPosition(position, zoneSlotView.displayWidth);
      const y = this.resolveYForPosition(position, zoneSlotView.displayHeight);
      zoneSlotView.setPosition(x, y);

      if (!this.slots[position.row]) this.slots[position.row] = [];
      this.slots[position.row][position.column] = zoneSlotView;
      this.add(zoneSlotView);
    }
  }

  private resolveXForPosition(position: ZonePosition, zoneSlotWidth: number): number {
    if (this.zone.slots[position.row].length > 1) {
      return position.column * (zoneSlotWidth + this.options.spaceBetweenSlots);
    }

    const middleColumn = Math.trunc(this.zone.getMaxColumns() / 2);
    return middleColumn * (zoneSlotWidth + this.options.spaceBetweenSlots);
  }

  private resolveYForPosition(position: ZonePosition, zoneSlotHeight: number): number {
    return position.row * (zoneSlotHeight + this.options.spaceBetweenSlots);
  }

  public getSlots(): ZoneSlotView[][] {
    return this.slots
  }
}

export default ZoneView;
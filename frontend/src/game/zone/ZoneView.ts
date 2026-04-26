import { GameScene } from "@/scenes/Game";
import Zone from "@/domain/Zone";
import { ZonePosition } from "@/domain/Position";
import ZoneSlotView from "@/game/zone/ZoneSlotView"

import { LayoutState } from '@/core/BattlefieldLayout';
import CardView from "@/game/cards/CardView";

interface ZoneViewOptions {
  spaceBetweenSlots?: number;
}

type AllZoneViewOptions = Required<ZoneViewOptions>;
const defaultOptions: AllZoneViewOptions = {
  spaceBetweenSlots: 10
};

export interface SlotLogicalBounds {
  boardX: number;
  boardY: number;
  width: number;
  height: number;
  rotation: number;
}

class ZoneView extends Phaser.GameObjects.Container {
  private readonly options: AllZoneViewOptions;
  private readonly slots: ZoneSlotView[][];
  
  public readonly zone: Zone;
  public readonly layout: LayoutState;

  constructor(
    scene: GameScene, 
    zone: Zone,
    layout: LayoutState,
    options: ZoneViewOptions = defaultOptions
  ) {
    super(scene, 0, 0);
    this.options = { ...defaultOptions, ...options };
    this.slots = [];
    this.zone = zone;
    this.layout = layout;
    this.scale = 1;

    this.initializeView();

    this.scene.add.existing(this);
  }

  private initializeView() {
    const zoneSlots = this.zone.slots.flatMap(row => row);
    
    const slotWidth =  CardView.WIDTH;
    const slotHeight = CardView.HEIGHT;
    const rad = Phaser.Math.DegToRad(this.layout.rotation);

    for (const zoneSlot of zoneSlots) {
      const position = zoneSlot.position;
      const localX = this.resolveXForPosition(position, slotWidth);
      const localY = this.resolveYForPosition(position, slotHeight);

      const boardX = this.layout.x + localX * Math.cos(rad) - localY * Math.sin(rad);
      const boardY = this.layout.y + localX * Math.sin(rad) + localY * Math.cos(rad);

      const bounds: SlotLogicalBounds = {
        boardX,
        boardY,
        width: slotWidth,
        height: slotHeight,
        rotation: this.layout.rotation
      };

      const zoneSlotView = new ZoneSlotView(this.scene as GameScene, bounds, zoneSlot);

      if (!this.slots[position.row]) this.slots[position.row] = [];
      this.slots[position.row][position.column] = zoneSlotView;
      this.add(zoneSlotView);
    }
  }

  private resolveXForPosition(position: ZonePosition, zoneSlotWidth: number): number {
    const numCols = this.zone.slots[position.row].length;
    const totalWidth = numCols * zoneSlotWidth + (numCols - 1) * this.options.spaceBetweenSlots;
    const startX = -(totalWidth / 2) + (zoneSlotWidth / 2);
    return startX + position.column * (zoneSlotWidth + this.options.spaceBetweenSlots);
  }

  private resolveYForPosition(position: ZonePosition, zoneSlotHeight: number): number {
    const numRows = this.zone.slots.length;
    const totalHeight = numRows * zoneSlotHeight + (numRows - 1) * this.options.spaceBetweenSlots;
    const startY = -(totalHeight / 2) + (zoneSlotHeight / 2);
    return startY + position.row * (zoneSlotHeight + this.options.spaceBetweenSlots);
  }

  public getSlots(): ZoneSlotView[][] {
    return this.slots
  }
}

export default ZoneView;
import { GameScene } from "@/scenes/Game";
import Zone from "@/domain/Zone";
import ZoneSlotView from "@/game/zone/ZoneSlotView";
import ZoneSlotLayout from "@/game/zone/ZoneSlotLayout";
import ProjectionSystem from "@/core/ProjectionSystem";
import { Point2D, Size2D, Rotation } from "@/domain/Geometry";

interface ZoneViewOptions {
  /** Center position in board-space */
  position: Point2D;
  /** Rotation of the zone in degrees (0=South, 180=North, 90=West, -90=East) */
  rotation: Rotation;
  /** Size of each zone slot in board-space units */
  slotSize: Size2D;
  /** Space between slots in board-space units */
  spaceBetweenSlots?: number;
}

type AllZoneViewOptions = Required<ZoneViewOptions>;
type DefaultZoneViewOptions = Omit<AllZoneViewOptions, 'position' | 'rotation' | 'slotSize'>;
const defaultOptions: DefaultZoneViewOptions = {
  spaceBetweenSlots: 20
};

class ZoneView extends Phaser.GameObjects.Container {
  private readonly options: AllZoneViewOptions;
  private readonly slots: ZoneSlotView[][];
  private readonly slotLayout: ZoneSlotLayout;

  public readonly zone: Zone;

  constructor(
    scene: GameScene,
    zone: Zone,
    options: ZoneViewOptions
  ) {
    super(scene, 0, 0);

    this.options = { ...defaultOptions, ...options };
    this.slots = [];
    this.zone = zone;
    this.scale = 1;
    this.slotLayout = new ZoneSlotLayout(this.options);

    // Project zone center: board-space → screen-space
    const zoneScreen = ProjectionSystem.toPoint3D(this.options.position);
    this.setPosition(zoneScreen.x, zoneScreen.y);

    this.initializeView();
  }

  private initializeView() {
    const zoneSlots = this.zone.slots.flatMap(row => row);
    const numRows = this.zone.slots.length;

    for (const zoneSlot of zoneSlots) {
      const position = zoneSlot.position;
      const numCols = this.zone.slots[position.row].length;
      const obb = this.slotLayout.resolveOBBForSlot(position, { x: this.x, y: this.y }, numRows, numCols);
      const zoneSlotView = new ZoneSlotView(this.scene as GameScene, obb, zoneSlot);

      if (!this.slots[position.row]) this.slots[position.row] = [];
      this.slots[position.row][position.column] = zoneSlotView;
      this.add(zoneSlotView);
    }
  }

  public getSlots(): ZoneSlotView[][] {
    return this.slots;
  }
}

export default ZoneView;
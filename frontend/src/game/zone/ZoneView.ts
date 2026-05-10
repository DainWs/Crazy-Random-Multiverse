import { GameScene } from "@/scenes/Game";
import Zone from "@/domain/Zone";
import { ZonePosition } from "@/domain/Position";
import ZoneSlotView from "@/game/zone/ZoneSlotView"
import { Point2D, Point3D, Size2D, Rotation, OrientedBoundingBox3D, Corners3D } from "@/domain/Geometry";
import ProjectionSystem from "@/core/ProjectionSystem";

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
    
    // Project zone center: board-space → screen-space
    const zoneScreen = ProjectionSystem.toPoint3D(this.options.position);
    this.setPosition(zoneScreen.x, zoneScreen.y);

    this.initializeView();
  }

  private initializeView() {
    const zoneSlots = this.zone.slots.flatMap(row => row);

    for (const zoneSlot of zoneSlots) {      
      const position = zoneSlot.position;
      const obb = this.resolveOBBForSlot(position);
      const zoneSlotView = new ZoneSlotView(this.scene as GameScene, obb, zoneSlot);

      if (!this.slots[position.row]) this.slots[position.row] = [];
      this.slots[position.row][position.column] = zoneSlotView;
      this.add(zoneSlotView);
    }

  }

  /**
   * Computes the OrientedBoundingBox3D for a slot in ZoneSlotView-local screen-space.
   */
  private resolveOBBForSlot(position: ZonePosition): OrientedBoundingBox3D {
    const slotBoard = this.calculateSlotBoardPosition(position);
    const slotScreen = ProjectionSystem.toPoint3D(slotBoard);

    // Position of slot within ZoneView local screen-space
    const localX = slotScreen.x - this.x;
    const localY = slotScreen.y - this.y;

    return {
      x: localX,
      y: localY,
      z: slotScreen.z,
      scale: slotScreen.scale,
      width: this.options.slotSize.width,
      height: this.options.slotSize.height,
      depth: 0,
      rotation: this.options.rotation,
      corners: this.projectCorners(slotBoard, slotScreen),
    };
  }

  private calculateSlotBoardPosition(position: ZonePosition): Point2D {
    const localOffset = this.resolveOffsetForPosition(position);
    const rotatedOffset = this.rotateBoardOffset(localOffset);
    
    return {
      x: this.options.position.x + rotatedOffset.x,
      y: this.options.position.y + rotatedOffset.y,
    };
  }

  private projectCorners(slotBoard: Point2D, slotScreen: Point3D): Corners3D {
    const halfWidth = this.options.slotSize.width / 2;
    const halfHeight = this.options.slotSize.height / 2;

    const projectCorner = (cornerOffset: Point2D): Point3D => {
      const rotated = this.rotateBoardOffset(cornerOffset);
      const boardPos: Point2D = {
        x: slotBoard.x + rotated.x,
        y: slotBoard.y + rotated.y,
      };
      
      const screen = ProjectionSystem.toPoint3D(boardPos);
      return {
        x: screen.x - slotScreen.x,
        y: screen.y - slotScreen.y,
        z: screen.z,
        scale: screen.scale,
      };
    };

    return {
      tl: projectCorner({ x: -halfWidth, y: -halfHeight }),
      tr: projectCorner({ x:  halfWidth, y: -halfHeight }),
      bl: projectCorner({ x: -halfWidth, y:  halfHeight }),
      br: projectCorner({ x:  halfWidth, y:  halfHeight }),
    };
  }

  private rotateBoardOffset(offset: Point2D): Point2D {
    const rad = Phaser.Math.DegToRad(this.options.rotation);
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    return {
      x: offset.x * cos - offset.y * sin,
      y: offset.x * sin + offset.y * cos,
    };
  }

  private resolveOffsetForPosition(position: ZonePosition): Point2D {
    const x = this.resolveOffsetXForPosition(position);
    const y = this.resolveOffsetYForPosition(position);
    return { x, y };
  }

  private resolveOffsetXForPosition(position: ZonePosition): number {
    const zoneSlotWidth = this.options.slotSize.width;
    const numCols = this.zone.slots[position.row].length;
    const totalWidth = numCols * zoneSlotWidth + (numCols - 1) * this.options.spaceBetweenSlots;
    const startX = -(totalWidth / 2) + (zoneSlotWidth / 2);
    return startX + position.column * (zoneSlotWidth + this.options.spaceBetweenSlots);
  }

  private resolveOffsetYForPosition(position: ZonePosition): number {
    const zoneSlotHeight = this.options.slotSize.height;
    const numRows = this.zone.slots.length;
    const totalHeight = numRows * zoneSlotHeight + (numRows - 1) * this.options.spaceBetweenSlots;
    const startY = -(totalHeight / 2) + (zoneSlotHeight / 2);
    return startY + position.row * (zoneSlotHeight + this.options.spaceBetweenSlots);
  }

  public getSlots(): ZoneSlotView[][] {
    return this.slots;
  }
}

export default ZoneView;
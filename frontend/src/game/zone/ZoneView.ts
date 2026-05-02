import { GameScene } from "@/scenes/Game";
import Zone from "@/domain/Zone";
import { ZonePosition } from "@/domain/Position";
import ZoneSlotView from "@/game/zone/ZoneSlotView"
import { Point2D, Point3D, Size2D, Rotation, OrientedBoundingBox3D } from "@/domain/Geometry";
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

    this.scene.add.existing(this);
  }

  private initializeView() {
    const zoneSlots = this.zone.slots.flatMap(row => row);

    for (const zoneSlot of zoneSlots) {      
      const position = zoneSlot.position;
      const obb = this.resolveOBBForSlot(position);
      const zoneSlotView = new ZoneSlotView(this.scene as GameScene, obb, zoneSlot);

      // Place ZoneSlotView in ZoneView local-space at the screen-space offset
      zoneSlotView.setPosition(obb.x, obb.y);

      if (!this.slots[position.row]) this.slots[position.row] = [];
      this.slots[position.row][position.column] = zoneSlotView;
      this.add(zoneSlotView);
    }
    // utilizado para saber donde esta el pivot del contenedor
    const graphics2 = this.scene.add.graphics();
    graphics2.clear();
    graphics2.fillStyle(0xff00ff, 0.5);
    graphics2.lineStyle(1, 0x4488cc, 0.5);
    graphics2.beginPath();
    graphics2.fillCircle(0, 0, 100);
    graphics2.closePath();
    graphics2.fillPath();
    graphics2.strokePath();
    this.add(graphics2);
  }

  /**
   * Computes the OrientedBoundingBox3D for a slot in ZoneSlotView-local screen-space.
   *
   * Steps:
   *  1. Resolve local slot offset (in board-space, relative to zone center).
   *  2. Rotate that offset by the zone rotation (board-space rotation).
   *  3. Add to zone board-space position → slot board-space world position.
   *  4. Project slot center → screen position; offset relative to ZoneView.
   *  5. Project each corner from board-space → screen; make relative to slot center.
   */
  private resolveOBBForSlot(position: ZonePosition): OrientedBoundingBox3D {
    const rad = Phaser.Math.DegToRad(this.options.rotation);
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const rotateOffset = (offset: Point2D): Point2D => ({
      x: offset.x * cos - offset.y * sin,
      y: offset.x * sin + offset.y * cos,
    });

    // 1-3: slot center in board-space
    const localOffset = this.resolveOffsetForPosition(position);
    const rotatedOffset = rotateOffset(localOffset);
    const slotBoard: Point2D = {
      x: this.options.position.x + rotatedOffset.x,
      y: this.options.position.y + rotatedOffset.y,
    };

    // 4: project slot center
    const slotScreen = ProjectionSystem.toPoint3D(slotBoard);

    // Position of slot within ZoneView local screen-space
    const localX = slotScreen.x - this.x;
    const localY = slotScreen.y - this.y;

    // 5: project each corner from board-space, relative to slot screen center
    const hw = this.options.slotSize.width / 2;
    const hh = this.options.slotSize.height / 2;

    const projectCorner = (cornerOffset: Point2D): Point3D => {
      const rotated = rotateOffset(cornerOffset);
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
      x: localX,
      y: localY,
      z: slotScreen.z,
      scale: slotScreen.scale,
      width: this.options.slotSize.width,
      height: this.options.slotSize.height,
      rotation: this.options.rotation,
      corners: {
        tl: projectCorner({ x: -hw, y: -hh }),
        tr: projectCorner({ x:  hw, y: -hh }),
        bl: projectCorner({ x: -hw, y:  hh }),
        br: projectCorner({ x:  hw, y:  hh }),
      },
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
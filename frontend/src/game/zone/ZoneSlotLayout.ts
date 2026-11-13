import ProjectionSystem from "@/core/ProjectionSystem";
import { Corners3D, OrientedBoundingBox3D, Point2D, Point3D, Rotation, Size2D } from "@/domain/Geometry";
import { ZonePosition } from "@/domain/Position";

/**
 * Pure layout class computing grid slot offsets, 
 * 2D board rotations ((deg * Math.PI) / 180 without Phaser.Math.DegToRad),
 * and 3D Oriented Bounding Boxes (OrientedBoundingBox3D)
 */

interface ZoneSlotLayoutOptions {
  position: Point2D;
  rotation: Rotation;
  slotSize: Size2D;
  spaceBetweenSlots: number;
}

class ZoneSlotLayout {
  public readonly options: ZoneSlotLayoutOptions;

  public constructor(options: ZoneSlotLayoutOptions) {
    this.options = options;
  }

  public resolveOBBForSlot(
    position: ZonePosition,
    zoneScreen: Point2D,
    numRows: number,
    numCols: number
  ): OrientedBoundingBox3D {
    const slotBoard = this.calculateSlotBoardPosition(position, numRows, numCols);
    const slotScreen = ProjectionSystem.toPoint3D(slotBoard);

    const localX = slotScreen.x - zoneScreen.x;
    const localY = slotScreen.y - zoneScreen.y;

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

  public calculateSlotBoardPosition(
    position: ZonePosition,
    numRows: number,
    numCols: number
  ): Point2D {
    const localOffset = this.resolveOffsetForPosition(position, numRows, numCols);
    const rotatedOffset = this.rotateBoardOffset(localOffset);

    return {
      x: this.options.position.x + rotatedOffset.x,
      y: this.options.position.y + rotatedOffset.y,
    };
  }

  public projectCorners(slotBoard: Point2D, slotScreen: Point3D): Corners3D {
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
      tr: projectCorner({ x: halfWidth, y: -halfHeight }),
      bl: projectCorner({ x: -halfWidth, y: halfHeight }),
      br: projectCorner({ x: halfWidth, y: halfHeight }),
    };
  }

  public rotateBoardOffset(offset: Point2D): Point2D {
    const rad = (this.options.rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    return {
      x: offset.x * cos - offset.y * sin,
      y: offset.x * sin + offset.y * cos,
    };
  }

  public resolveOffsetForPosition(
    position: ZonePosition,
    numRows: number,
    numCols: number
  ): Point2D {
    const x = this.resolveOffsetXForPosition(position.column, numCols);
    const y = this.resolveOffsetYForPosition(position.row, numRows);
    return { x, y };
  }

  public resolveOffsetXForPosition(column: number, numCols: number): number {
    const zoneSlotWidth = this.options.slotSize.width;
    const totalWidth = numCols * zoneSlotWidth + (numCols - 1) * this.options.spaceBetweenSlots;
    const startX = -(totalWidth / 2) + zoneSlotWidth / 2;
    return startX + column * (zoneSlotWidth + this.options.spaceBetweenSlots);
  }

  public resolveOffsetYForPosition(row: number, numRows: number): number {
    const zoneSlotHeight = this.options.slotSize.height;
    const totalHeight = numRows * zoneSlotHeight + (numRows - 1) * this.options.spaceBetweenSlots;
    const startY = -(totalHeight / 2) + zoneSlotHeight / 2;
    return startY + row * (zoneSlotHeight + this.options.spaceBetweenSlots);
  }
}

export type { ZoneSlotLayoutOptions };
export { ZoneSlotLayout };
export default ZoneSlotLayout;

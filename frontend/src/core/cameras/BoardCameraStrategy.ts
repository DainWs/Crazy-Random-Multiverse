import type { Point2D, Point3D, Size2D } from '@/domain/Geometry';
import type { Bounds2D } from '@/core/cameras/CameraCalculations';

/** What a camera needs to frame the board: the screen in the pixels of the canvas, and the board as it is drawn in the world. */
interface BoardFraming {
    screen: Size2D;
    boardBounds: Bounds2D;
    boardCenter: Point2D;
    maxPlayersPerSide: number;
}

/** The zoom of the camera and the point of the world at the center of the screen. */
interface CameraFrame {
    zoom: number;
    center: Point2D;
}

/** What differs between the cameras of the board, top-down and tilted (VIEW-57). */
interface BoardCameraStrategy {
    /** Where a point of the board is drawn, and its scale there. */
    project(point: Point2D): Point3D;
    /** The framing at the start and after the window changes size (VIEW-24). */
    frame(framing: BoardFraming): CameraFrame;
    /** Whether a card of the board is drawn inside the four corners of its slot, deformed like it (VIEW-1). */
    readonly deformsCards: boolean;
    /** Whether the table shows the thickness of its sides and its legs. */
    readonly showsTableDepth: boolean;
}

export type { BoardFraming, CameraFrame };
export default BoardCameraStrategy;

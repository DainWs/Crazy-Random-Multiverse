import type { Point2D, Point3D } from '@/domain/Geometry';
import type BoardCameraStrategy from '@/core/cameras/BoardCameraStrategy';
import type { BoardFraming, CameraFrame } from '@/core/cameras/BoardCameraStrategy';
import { calculateScreenFit, resolveCameraConfiguration } from '@/core/cameras/CameraCalculations';

/** Distance from the eye to the plane where a point keeps its size, in board units. */
const FOCAL_LENGTH = 1800;
/** Distance from the eye to the center of the table, in board units. */
const DEPTH_OFFSET = 7000;

/** The table seen in perspective: the far side smaller than the near one (VIEW-57). */
class TiltedCameraStrategy implements BoardCameraStrategy {
    public readonly deformsCards = true;
    public readonly showsTableDepth = true;

    public project(point: Point2D): Point3D {
        const depth = DEPTH_OFFSET - point.y;
        const scale = FOCAL_LENGTH / depth;

        return { x: point.x * scale, y: point.y * scale, z: depth, scale };
    }

    /** The zoom and the offset are tuned by hand for each count of players per side on the reference screen. */
    public frame({ screen, boardCenter, maxPlayersPerSide }: BoardFraming): CameraFrame {
        const configuration = resolveCameraConfiguration(maxPlayersPerSide);

        return {
            zoom: configuration.zoom * calculateScreenFit(screen),
            center: { x: boardCenter.x, y: boardCenter.y + configuration.yOffset }
        };
    }
}

export { FOCAL_LENGTH, DEPTH_OFFSET };
export default TiltedCameraStrategy;

import { Point2D, Corners2D, Corners3D, Point3D } from "@/domain/Geometry";
import { dispatchBoardCameraStrategy } from "@/core/cameras/BoardCameraStrategyDispatcher";


function createCorners2D(width: number, height: number): Corners2D {
    const hw = width / 2;
    const hh = height / 2;
    return {
        tl: { x: -hw, y: -hh }, // Top-left
        tr: { x: hw, y: -hh }, // Top-right
        bl: { x: -hw, y: hh }, // Bottom-left
        br: { x: hw, y: hh } // Bottom-right
    };
}

function toCorners3D(corners: Corners2D): Corners3D {
    return {
        tl: toPoint3D(corners.tl),
        tr: toPoint3D(corners.tr),
        bl: toPoint3D(corners.bl),
        br: toPoint3D(corners.br)
    };
}

/** Where a point of the board is drawn with the camera of the board (VIEW-57). */
function toPoint3D(point: Point2D): Point3D {
    return dispatchBoardCameraStrategy().project(point);
}

const ProjectionSystem = {
    toCorners3D,
    toPoint3D,
    createCorners2D
}

export type { Point3D, Corners3D };
export default ProjectionSystem;

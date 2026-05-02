import { Point2D, Corners2D, Corners3D, Point3D } from "@/domain/Geometry";

const FOCAL_LENGTH = 1800;
const DEPTH_OFFSET = 7000;


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

function toPoint3D(point: Point2D): Point3D {
    const depth = DEPTH_OFFSET - point.y;
    const scale = FOCAL_LENGTH / depth;

    return {
        x: point.x * scale,
        y: point.y * scale,
        z: depth,
        scale: scale
    };
}

const ProjectionSystem = {
    toCorners3D,
    toPoint3D,
    createCorners2D
}

export type { Point3D, Corners3D };
export default ProjectionSystem;

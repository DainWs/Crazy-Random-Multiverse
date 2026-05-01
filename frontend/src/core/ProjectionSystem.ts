import { Point2D, Corners2D } from "@/domain/Battlefield";

type Point3D = { x: number, y: number, z: number, scale: number };
type Corners3D = { tl: Point3D, tr: Point3D, bl: Point3D, br: Point3D }

const FOCAL_LENGTH = 1800;
const DEPTH_OFFSET = 7000;

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
    toPoint3D
}

export type { Point3D, Corners3D };
export default ProjectionSystem;

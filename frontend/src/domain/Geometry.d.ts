export type Rotation = number;
type RotationProp = { rotation: Rotation };

export type Point2D = { x: number, y: number };
export type Corners2D = { tl: Point2D, tr: Point2D, bl: Point2D, br: Point2D }

export type Point3D = { x: number, y: number, z: number, scale: number };
export type Corners3D = { tl: Point3D, tr: Point3D, bl: Point3D, br: Point3D }

export type Corner = 'TL' | 'TR' | 'BL' | 'BR';
export type Corners = Corners2D | Corners3D;
export type Point = Point2D | Point3D;

export type Size2D = { width: number, height: number };
export type Size3D = { width: number, height: number, depth: number };
export type BoundingBox2D = Point2D & Size2D & { corners: Corners2D };
export type BoundingBox3D = Point3D & Size3D & { corners: Corners3D };
export type BoundingBox = BoundingBox2D | BoundingBox3D;
export type OrientedBoundingBox2D = BoundingBox2D & RotationProp;
export type OrientedBoundingBox3D = BoundingBox3D & RotationProp;
export type OrientedBoundingBox = OrientedBoundingBox2D | OrientedBoundingBox3D;
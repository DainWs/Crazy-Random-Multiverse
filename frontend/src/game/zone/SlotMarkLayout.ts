import type { Corners3D, Point2D } from "@/domain/Geometry";
import {
  OWN_ZONE_LINES_PER_SLOT,
  READY_CORNER_ARM_FRACTION,
  SOURCE_DASHES_PER_HORIZONTAL_EDGE,
  SOURCE_DASHES_PER_VERTICAL_EDGE,
  SOURCE_DASH_FRACTION
} from "@/core/Constants";

/** A line to stroke, as the points it goes through, in the local space of the slot. */
type MarkPath = Point2D[];

/** The point of the slot at `u` along its top edge and `v` along its left edge, both from 0 to 1, following its perspective. */
function pointInSlot(corners: Corners3D, u: number, v: number): Point2D {
  const { tl, tr, bl, br } = corners;

  return {
    x: tl.x + u * (tr.x - tl.x) + v * (bl.x - tl.x) + u * v * (tl.x - tr.x - bl.x + br.x),
    y: tl.y + u * (tr.y - tl.y) + v * (bl.y - tl.y) + u * v * (tl.y - tr.y - bl.y + br.y)
  };
}

/** The lines of the own zone: parallel to the diagonal from the top right corner to the bottom left one, evenly spaced (VIEW-39). */
function ownZoneLines(corners: Corners3D): MarkPath[] {
  const lines: MarkPath[] = [];

  for (let index = 1; index <= OWN_ZONE_LINES_PER_SLOT; index++) {
    const offset = (2 * index) / (OWN_ZONE_LINES_PER_SLOT + 1);
    const start = offset <= 1 ? { u: offset, v: 0 } : { u: 1, v: offset - 1 };
    const end = offset <= 1 ? { u: 0, v: offset } : { u: offset - 1, v: 1 };
    lines.push([pointInSlot(corners, start.u, start.v), pointInSlot(corners, end.u, end.v)]);
  }

  return lines;
}

/** One L at each corner of the slot, each arm a fraction of the edge it follows (VIEW-39). */
function readyCorners(corners: Corners3D): MarkPath[] {
  const arm = READY_CORNER_ARM_FRACTION;
  const far = 1 - arm;

  return [
    [pointInSlot(corners, arm, 0), pointInSlot(corners, 0, 0), pointInSlot(corners, 0, arm)],
    [pointInSlot(corners, far, 0), pointInSlot(corners, 1, 0), pointInSlot(corners, 1, arm)],
    [pointInSlot(corners, 0, far), pointInSlot(corners, 0, 1), pointInSlot(corners, arm, 1)],
    [pointInSlot(corners, 1, far), pointInSlot(corners, 1, 1), pointInSlot(corners, far, 1)]
  ];
}

/** The dashes of the frame of the source slot: each edge is split in equal stretches and each dash is centered in its stretch (VIEW-39). */
function sourceDashes(corners: Corners3D): MarkPath[] {
  const margin = (1 - SOURCE_DASH_FRACTION) / 2;
  const dashes: MarkPath[] = [];

  const addEdge = (count: number, place: (along: number) => Point2D) => {
    for (let index = 0; index < count; index++) {
      dashes.push([place((index + margin) / count), place((index + 1 - margin) / count)]);
    }
  };

  addEdge(SOURCE_DASHES_PER_HORIZONTAL_EDGE, (along) => pointInSlot(corners, along, 0));
  addEdge(SOURCE_DASHES_PER_HORIZONTAL_EDGE, (along) => pointInSlot(corners, along, 1));
  addEdge(SOURCE_DASHES_PER_VERTICAL_EDGE, (along) => pointInSlot(corners, 0, along));
  addEdge(SOURCE_DASHES_PER_VERTICAL_EDGE, (along) => pointInSlot(corners, 1, along));

  return dashes;
}

/** The crown as a fraction of the radius of its disc, from the bottom left corner clockwise: three peaks over a flat base (VIEW-39). */
const CROWN_SHAPE: Point2D[] = [
  { x: -0.55, y: 0.4 },
  { x: -0.55, y: -0.35 },
  { x: -0.28, y: 0 },
  { x: 0, y: -0.5 },
  { x: 0.28, y: 0 },
  { x: 0.55, y: -0.35 },
  { x: 0.55, y: 0.4 }
];

/** The crown for a disc of this radius, centered on the center of the disc (VIEW-39). */
function crownPath(radius: number): MarkPath {
  return CROWN_SHAPE.map((point) => ({ x: point.x * radius, y: point.y * radius }));
}

export type { MarkPath };
export { crownPath, ownZoneLines, readyCorners, sourceDashes };

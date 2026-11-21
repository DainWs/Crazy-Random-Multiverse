import type { Corners3D, Point2D } from "@/domain/Geometry";

/** How the slot is drawn on the screen: the rotation and the scale of its containers, which a flat mark has to undo. */
type SlotWorld = { rotation: number; scale: number };

/** The outline of the shadow of a lifted card: the corners of its slot, relative to the point the card grows from (VIEW-4). */
function shadowOutline(corners: Corners3D, pivot: Point2D): Point2D[] {
  return [corners.tl, corners.tr, corners.br, corners.bl].map(({ x, y }) => ({ x: x - pivot.x, y: y - pivot.y }));
}

/** The height of the card on the screen: the mean of the left and right edges of its slot. */
function cardScreenHeight(corners: Corners3D): number {
  const left = Math.hypot(corners.bl.x - corners.tl.x, corners.bl.y - corners.tl.y);
  const right = Math.hypot(corners.br.x - corners.tr.x, corners.br.y - corners.tr.y);

  return (left + right) / 2;
}

/** `fraction` of the height of the card, down on the screen, in the local space of the slot (VIEW-4). */
function shadowOffset(corners: Corners3D, fraction: number, world: SlotWorld): Point2D {
  const distance = (fraction * cardScreenHeight(corners)) / world.scale;

  return { x: Math.sin(world.rotation) * distance, y: Math.cos(world.rotation) * distance };
}

export type { SlotWorld };
export { cardScreenHeight, shadowOffset, shadowOutline };

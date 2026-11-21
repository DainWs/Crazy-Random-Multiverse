import type { Corners3D, Point2D } from "@/domain/Geometry";
import type { SlotWorld } from "@/game/zone/CardLiftLayout";

/** A rectangle with the sides of the screen, in the world. */
type Box = { center: Point2D; width: number; height: number };

/** The box that holds the corners of a slot, whose origin is at `origin` in the world (VIEW-5, VIEW-6). */
function boxOfSlot(corners: Corners3D, origin: Point2D, scale = 1): Box {
  const points = [corners.tl, corners.tr, corners.br, corners.bl];
  const xs = points.map((point) => origin.x + point.x * scale);
  const ys = points.map((point) => origin.y + point.y * scale);
  const left = Math.min(...xs);
  const right = Math.max(...xs);
  const top = Math.min(...ys);
  const bottom = Math.max(...ys);

  return { center: { x: (left + right) / 2, y: (top + bottom) / 2 }, width: right - left, height: bottom - top };
}

/**
 * The trip of the attacker in a straight line towards the center of the target, until the two cards touch (VIEW-5).
 * They touch when their boxes begin to overlap on both axes; if they already overlap, the attacker does not move.
 */
function lungeVector(attacker: Box, target: Box): Point2D {
  const delta = { x: target.center.x - attacker.center.x, y: target.center.y - attacker.center.y };
  const distance = Math.hypot(delta.x, delta.y);
  if (distance === 0) {
    return { x: 0, y: 0 };
  }

  const direction = { x: delta.x / distance, y: delta.y / distance };
  const reachX = (attacker.width + target.width) / 2;
  const reachY = (attacker.height + target.height) / 2;
  const travelX = direction.x === 0 ? 0 : (Math.abs(delta.x) - reachX) / Math.abs(direction.x);
  const travelY = direction.y === 0 ? 0 : (Math.abs(delta.y) - reachY) / Math.abs(direction.y);
  const travel = Math.min(distance, Math.max(0, travelX, travelY));

  return { x: direction.x * travel, y: direction.y * travel };
}

/** A vector on the screen as the local space of a slot sees it, whose containers may be rotated and scaled. */
function toSlotSpace(vector: Point2D, world: SlotWorld): Point2D {
  const cos = Math.cos(world.rotation);
  const sin = Math.sin(world.rotation);

  return { x: (vector.x * cos + vector.y * sin) / world.scale, y: (-vector.x * sin + vector.y * cos) / world.scale };
}

/** How far to the side the target is at `progress`, from 0 to 1, with the amplitude going down to 0 (VIEW-5). */
function shakeOffset(progress: number, swings: number, amplitude: number): number {
  return Math.sin(2 * Math.PI * swings * progress) * amplitude * (1 - progress);
}

/** The pixels of the floating text, from the long side of the target as drawn on the screen (VIEW-6). */
function damageTextSize(longSideOnScreen: number, sizeFraction: number, minimum: number): number {
  return Math.max(minimum, sizeFraction * longSideOnScreen);
}

export type { Box };
export { boxOfSlot, damageTextSize, lungeVector, shakeOffset, toSlotSpace };

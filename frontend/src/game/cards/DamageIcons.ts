import type { Point2D } from "@/domain/Geometry";

type DamageIcon = 'HEART' | 'SHIELD' | 'MAGIC_SHIELD' | 'SWORD';

/** The outline of each icon of the floating text, in a square from -0.5 to 0.5 with y growing down (VIEW-6). */
const ICON_OUTLINES = new Map<DamageIcon, Point2D[]>([
  ['HEART', [
    { x: 0, y: 0.5 }, { x: -0.5, y: -0.05 }, { x: -0.5, y: -0.3 }, { x: -0.3, y: -0.5 }, { x: -0.1, y: -0.45 },
    { x: 0, y: -0.3 }, { x: 0.1, y: -0.45 }, { x: 0.3, y: -0.5 }, { x: 0.5, y: -0.3 }, { x: 0.5, y: -0.05 }
  ]],
  ['SHIELD', [{ x: -0.4, y: -0.5 }, { x: 0.4, y: -0.5 }, { x: 0.4, y: 0.05 }, { x: 0, y: 0.5 }, { x: -0.4, y: 0.05 }]],
  ['SWORD', [
    { x: 0, y: -0.5 }, { x: 0.1, y: -0.3 }, { x: 0.1, y: 0.1 }, { x: 0.35, y: 0.1 }, { x: 0.35, y: 0.22 }, { x: 0.1, y: 0.22 },
    { x: 0.1, y: 0.4 }, { x: 0.2, y: 0.5 }, { x: -0.2, y: 0.5 }, { x: -0.1, y: 0.4 }, { x: -0.1, y: 0.22 }, { x: -0.35, y: 0.22 },
    { x: -0.35, y: 0.1 }, { x: -0.1, y: 0.1 }, { x: -0.1, y: -0.3 }
  ]],
  ['MAGIC_SHIELD', [
    { x: 0, y: -0.5 }, { x: 0.4, y: -0.15 }, { x: 0.3, y: 0.3 }, { x: 0, y: 0.5 }, { x: -0.3, y: 0.3 }, { x: -0.4, y: -0.15 }
  ]]
]);

/** The points of the icon, for an icon `size` tall, centered on the origin. */
function damageIconOutline(icon: DamageIcon, size: number): Point2D[] {
  return ICON_OUTLINES.get(icon)!.map(({ x, y }) => ({ x: x * size, y: y * size }));
}

export type { DamageIcon };
export { damageIconOutline };

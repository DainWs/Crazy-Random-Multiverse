import type { Corners3D, Point2D } from "@/domain/Geometry";
import * as Constants from "@/core/Constants";

type ArrowTarget = { center: Point2D; radius: number };
type ArrowHead = [number, number, number, number, number, number];

/** Pure layout of the attack arrow: where its tip lands and the triangle that forms its head (VIEW-4). */
class AttackArrowLayout {
    private readonly origin: Point2D;

    public constructor(origin: Point2D) {
        this.origin = origin;
    }

    /** Mean distance from the center of a slot to its corners. */
    public static targetRadius(corners: Corners3D): number {
        const distances = [corners.tl, corners.tr, corners.br, corners.bl].map((corner) => Math.hypot(corner.x, corner.y));
        return distances.reduce((sum, distance) => sum + distance, 0) / distances.length;
    }

    /** The tip follows the pointer, but stops before the card of a valid target so the arrow does not cover it (UI-5). */
    public tip(pointer: Point2D, target?: ArrowTarget): Point2D {
        if (!target) {
            return pointer;
        }

        const reach = target.radius + Constants.ATTACK_ARROW_TARGET_GAP;
        const dx = this.origin.x - target.center.x;
        const dy = this.origin.y - target.center.y;
        const distance = Math.hypot(dx, dy);
        if (distance <= reach) {
            return pointer;
        }

        return { x: target.center.x + (dx / distance) * reach, y: target.center.y + (dy / distance) * reach };
    }

    public head(tip: Point2D): ArrowHead {
        const angle = Math.atan2(tip.y - this.origin.y, tip.x - this.origin.x);
        const left = angle + Math.PI - Constants.ATTACK_ARROW_HEAD_ANGLE;
        const right = angle + Math.PI + Constants.ATTACK_ARROW_HEAD_ANGLE;
        const length = Constants.ATTACK_ARROW_HEAD_LENGTH;

        return [
            tip.x, tip.y,
            tip.x + length * Math.cos(left), tip.y + length * Math.sin(left),
            tip.x + length * Math.cos(right), tip.y + length * Math.sin(right)
        ];
    }
}

export default AttackArrowLayout;

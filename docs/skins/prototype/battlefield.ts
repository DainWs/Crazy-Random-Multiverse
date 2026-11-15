// Reference only, not production code: draws the battlefield skin chosen with window.__battlefieldSkin.
import type Battlefield from '@/domain/Battlefield';
import ProjectionSystem from '@/core/ProjectionSystem';
import type { FieldCtx, Graphics, Point } from './kit';
import { chosen } from './registry';

const RING_SEGMENTS = 72;

function context(g: Graphics, battlefield: Battlefield): FieldCtx {
    const h = battlefield.getCorners().br.x;
    const at = (x: number, y: number): Point => {
        const p = ProjectionSystem.toPoint3D({ x, y });
        return { x: p.x, y: p.y };
    };
    const poly = (points: Point[], color: number, alpha = 1) => {
        g.fillStyle(color, alpha);
        g.fillPoints(points as Phaser.Math.Vector2[], true);
    };
    const circle = (cx: number, cy: number, r: number) =>
        Array.from({ length: RING_SEGMENTS }, (_, i) => {
            const a = (i / RING_SEGMENTS) * Math.PI * 2;
            return at(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        });
    const edges = {
        near: [at(-h, h), at(h, h)],
        left: [at(-h, -h), at(-h, h)],
        right: [at(h, -h), at(h, h)]
    };
    return {
        g,
        h,
        at,
        quad: (x0, y0, x1, y1, color, alpha = 1) => poly([at(x0, y0), at(x1, y0), at(x1, y1), at(x0, y1)], color, alpha),
        poly,
        lines: (segments, width, color, alpha = 1) => {
            g.lineStyle(width, color, alpha);
            g.beginPath();
            for (const [x0, y0, x1, y1] of segments) {
                const a = at(x0, y0);
                const b = at(x1, y1);
                g.moveTo(a.x, a.y);
                g.lineTo(b.x, b.y);
            }
            g.strokePath();
        },
        ring: (cx, cy, r, width, color, alpha = 1) => {
            g.lineStyle(width, color, alpha);
            g.strokePoints(circle(cx, cy, r) as Phaser.Math.Vector2[], true);
        },
        disc: (cx, cy, r, color, alpha = 1) => poly(circle(cx, cy, r), color, alpha),
        side: (edge, t, color, outline) => {
            const [a, b] = edges[edge];
            const band = [a, b, { x: b.x, y: b.y + t }, { x: a.x, y: a.y + t }];
            poly(band, color);
            if (outline) {
                g.lineStyle(outline[0], outline[1], 1);
                g.strokePoints(band as Phaser.Math.Vector2[], true);
            }
        },
        rnd: (i) => {
            const v = Math.sin(i * 12.9898) * 43758.5453;
            return v - Math.floor(v);
        }
    };
}

/** Draws the chosen skin instead of the table, and says whether it did. */
export function render(g: Graphics, battlefield: Battlefield): boolean {
    const skin = chosen('battlefield');
    if (!skin) return false;
    g.clear();
    skin.battlefield(context(g, battlefield));
    return true;
}

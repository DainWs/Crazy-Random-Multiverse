// Reference only, not production code: draws the battlefield skin chosen with window.__battlefieldSkin.
import type Battlefield from '@/domain/Battlefield';
import ProjectionSystem from '@/core/ProjectionSystem';
import type { FieldCtx, Graphics, Point, Spot } from './kit';
import { chosenBattlefield } from './registry';

const RING_SEGMENTS = 72;
const BLOB_POINTS = 28;
const GLOW_STEPS = 12;
const GRADIENT_STEPS = 16;
/** How far the ground seen around the board reaches, in board units; it covers the screen at the start zoom. */
const WORLD = { left: -5600, right: 5600, far: -6000, near: 3400 };

function random(i: number): number {
    const v = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
    return v - Math.floor(v);
}

function context(g: Graphics, battlefield: Battlefield): FieldCtx {
    const h = battlefield.getCorners().br.x;
    const at = (x: number, y: number, z = 0): Point => {
        const p = ProjectionSystem.toPoint3D({ x, y });
        return { x: p.x, y: p.y - z * p.scale };
    };
    const poly = (points: Point[], color: number, alpha = 1) => {
        if (alpha <= 0) return;
        g.fillStyle(color, alpha);
        g.fillPoints(points as Phaser.Math.Vector2[], true);
    };
    const outline = (points: Point[], width: number, color: number, alpha = 1, closed = true) => {
        g.lineStyle(width, color, alpha);
        g.strokePoints(points as Phaser.Math.Vector2[], closed);
    };
    const circle = (cx: number, cy: number, r: number, z = 0) =>
        Array.from({ length: RING_SEGMENTS }, (_, i) => {
            const a = (i / RING_SEGMENTS) * Math.PI * 2;
            return at(cx + Math.cos(a) * r, cy + Math.sin(a) * r, z);
        });
    const quad = (x0: number, y0: number, x1: number, y1: number, color: number, alpha = 1) =>
        poly([at(x0, y0), at(x1, y0), at(x1, y1), at(x0, y1)], color, alpha);
    const edges = {
        near: [at(-h, h), at(h, h)],
        left: [at(-h, -h), at(-h, h)],
        right: [at(h, -h), at(h, h)]
    };
    const lerp = (a: number, b: number, t: number) => {
        const ch = (c: number, sh: number) => (c >> sh) & 0xff;
        const mix = (sh: number) => Math.round(ch(a, sh) + (ch(b, sh) - ch(a, sh)) * t) << sh;
        return mix(16) | mix(8) | mix(0);
    };
    const disc = (cx: number, cy: number, r: number, color: number, alpha = 1, z = 0) => poly(circle(cx, cy, r, z), color, alpha);

    return {
        g,
        h,
        world: WORLD,
        at,
        quad,
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
        path: (points, width, color, alpha = 1, closed = false) => outline(points.map(([x, y]) => at(x, y)), width, color, alpha, closed),
        ring: (cx, cy, r, width, color, alpha = 1, z = 0) => outline(circle(cx, cy, r, z), width, color, alpha),
        disc,
        glow: (cx, cy, r, color, alpha, steps = GLOW_STEPS) => {
            for (let i = 0; i < steps; i++) disc(cx, cy, r * (1 - i / steps), color, alpha / steps);
        },
        blob: (cx, cy, r, seed, color, alpha = 1, wobble = 0.25) => {
            const phase = random(seed) * Math.PI * 2;
            const points = Array.from({ length: BLOB_POINTS }, (_, i) => {
                const a = (i / BLOB_POINTS) * Math.PI * 2;
                const k = 1 + wobble * (Math.sin(a * 3 + phase) * 0.5 + Math.sin(a * 5 + phase * 2) * 0.3 + (random(seed * 31 + i) - 0.5) * 0.4);
                return at(cx + Math.cos(a) * r * k, cy + Math.sin(a) * r * k);
            });
            poly(points, color, alpha);
        },
        gradient: (x0, y0, x1, y1, from, to, axis, steps = GRADIENT_STEPS, alpha = 1) => {
            for (let i = 0; i < steps; i++) {
                const color = lerp(from, to, steps === 1 ? 0 : i / (steps - 1));
                if (axis === 'y') quad(x0, y0 + ((y1 - y0) * i) / steps, x1, y0 + ((y1 - y0) * (i + 1)) / steps, color, alpha);
                else quad(x0 + ((x1 - x0) * i) / steps, y0, x0 + ((x1 - x0) * (i + 1)) / steps, y1, color, alpha);
            }
        },
        ground: (color, alpha = 1) => quad(WORLD.left, WORLD.far, WORLD.right, WORLD.near, color, alpha),
        side: (edge, t, color, line) => {
            const [a, b] = edges[edge];
            const band = [a, b, { x: b.x, y: b.y + t }, { x: a.x, y: a.y + t }];
            poly(band, color);
            if (line) outline(band, line[0], line[1]);
        },
        box: (x0, y0, x1, y1, z, top, front, side, line) => {
            const faces: [Point[], number][] = [];
            if (x0 > 0) faces.push([[at(x0, y0, 0), at(x0, y1, 0), at(x0, y1, z), at(x0, y0, z)], side]);
            if (x1 < 0) faces.push([[at(x1, y0, 0), at(x1, y1, 0), at(x1, y1, z), at(x1, y0, z)], side]);
            faces.push([[at(x0, y1, 0), at(x1, y1, 0), at(x1, y1, z), at(x0, y1, z)], front]);
            faces.push([[at(x0, y0, z), at(x1, y0, z), at(x1, y1, z), at(x0, y1, z)], top]);
            for (const [points, color] of faces) {
                poly(points, color);
                if (line) outline(points, line[0], line[1]);
            }
        },
        pillar: (cx, cy, r, z, body, top, line) => {
            const shaft = [at(cx - r, cy, 0), at(cx + r, cy, 0), at(cx + r, cy, z), at(cx - r, cy, z)];
            disc(cx, cy, r, body);
            poly(shaft, body);
            disc(cx, cy, r, top, 1, z);
            if (line) {
                g.lineStyle(line[0], line[1], 1);
                g.lineBetween(shaft[0].x, shaft[0].y, shaft[3].x, shaft[3].y);
                g.lineBetween(shaft[1].x, shaft[1].y, shaft[2].x, shaft[2].y);
                outline(circle(cx, cy, r, z), line[0], line[1]);
            }
        },
        spots: (seed, n, x0, y0, x1, y1, margin) => {
            const result: Spot[] = [];
            for (let i = 0; i < n; i++) {
                const r = (k: number) => random(seed * 1000 + i * 17 + k);
                const x = x0 + (x1 - x0) * r(1);
                const y = y0 + (y1 - y0) * r(2);
                if (margin !== undefined && Math.abs(x) < h + margin && Math.abs(y) < h + margin) continue;
                result.push({ x, y, i, r });
            }
            return result.sort((a, b) => a.y - b.y);
        },
        rnd: random
    };
}

/** Draws the chosen skin instead of the table, and says whether it did. */
export function render(g: Graphics, battlefield: Battlefield): boolean {
    const skin = chosenBattlefield();
    if (!skin) return false;
    g.clear();
    skin(context(g, battlefield));
    return true;
}

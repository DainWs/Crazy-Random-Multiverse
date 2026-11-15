// Hexagons battlefield. Reference only, not production code.
import { type BattlefieldSkin, square, type Point, type Segment } from '../../prototype/kit';
import { neonLines, neonEdge } from '../../prototype/shapes';

const CYAN = 0x00f0ff;
const MAGENTA = 0xff2bd6;

const battlefield: BattlefieldSkin = (c) => {
    const { h, world: w } = c;
    c.ground(0x05040f);
    const hexes = (x0: number, y0: number, x1: number, y1: number, r: number) => {
        const cells: [number, number][] = [];
        const dx = r * Math.sqrt(3);
        const dy = r * 1.5;
        for (let row = 0, y = y0; y <= y1; y += dy, row++) {
            for (let x = x0 + (row % 2) * (dx / 2); x <= x1; x += dx) cells.push([x, y]);
        }
        return cells;
    };
    const outline = (x: number, y: number, r: number): Segment[] => {
        const segments: Segment[] = [];
        for (let k = 0; k < 6; k++) {
            const a0 = (k / 6) * Math.PI * 2 + Math.PI / 6;
            const a1 = ((k + 1) / 6) * Math.PI * 2 + Math.PI / 6;
            segments.push([x + Math.cos(a0) * r, y + Math.sin(a0) * r, x + Math.cos(a1) * r, y + Math.sin(a1) * r]);
        }
        return segments;
    };
    const outer: Segment[] = [];
    for (const [x, y] of hexes(w.left, w.far, w.right, w.near, 420)) {
        if (Math.abs(x) < h + 200 && Math.abs(y) < h + 200) continue;
        outer.push(...outline(x, y, 400));
    }
    c.lines(outer, 2, 0x3a2a80, 0.6);
    neonEdge(c, CYAN);
    c.quad(-h, -h, h, h, 0x08061a);
    const r = h * 0.11;
    const inside = hexes(-h, -h, h, h, r);
    const all: Segment[] = [];
    inside.forEach(([x, y], i) => {
        const clip = (s: Segment): Segment => s.map((v) => Math.max(-h, Math.min(h, v))) as Segment;
        const fill = c.rnd(i + 900);
        if (fill > 0.82 && Math.abs(x) < h - r && Math.abs(y) < h - r) {
            const points: Point[] = [];
            for (let k = 0; k < 6; k++) {
                const a = (k / 6) * Math.PI * 2 + Math.PI / 6;
                points.push(c.at(x + Math.cos(a) * r * 0.92, y + Math.sin(a) * r * 0.92));
            }
            c.poly(points, fill > 0.92 ? MAGENTA : CYAN, 0.28);
        }
        all.push(...outline(x, y, r).map(clip));
    });
    neonLines(c, all, CYAN, 1.5, 0.8);
    c.glow(0, 0, h * 0.8, MAGENTA, 0.2);
    neonLines(c, square(h), MAGENTA, 3);
};

export default battlefield;

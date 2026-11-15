// Circuit board battlefield. Reference only, not production code.
import { type BattlefieldSkin, square, type Segment } from '../../prototype/kit';
import { neonLines, neonPath, gridLines, neonEdge } from '../../prototype/shapes';

const CYAN = 0x00f0ff;
const ORANGE = 0xff8a1a;

const battlefield: BattlefieldSkin = (c) => {
    const { h, world: w } = c;
    c.ground(0x03070c);
    const trace = (seed: number, x: number, y: number, steps: number, length: number, limit: number): [number, number][] => {
        const points: [number, number][] = [[x, y]];
        let horizontal = c.rnd(seed) > 0.5;
        for (let i = 0; i < steps; i++) {
            const d = (c.rnd(seed + i * 3) > 0.5 ? 1 : -1) * length * (0.5 + c.rnd(seed + i * 5));
            if (horizontal) x = Math.max(-limit, Math.min(limit, x + d));
            else y = Math.max(-limit, Math.min(limit, y + d));
            horizontal = !horizontal;
            points.push([x, y]);
        }
        return points;
    };
    for (const s of c.spots(311, 60, w.left, w.far, w.right, w.near, 200)) {
        const points = trace(s.i + 3000, s.x, s.y, 4, 500, 6000);
        c.path(points, 3, 0x0a4a55, 0.8);
        c.disc(points[points.length - 1][0], points[points.length - 1][1], 30, 0x0a4a55);
    }
    neonEdge(c, CYAN);
    c.quad(-h, -h, h, h, 0x050a10);
    c.lines(gridLines(c, -h, -h, h, h, h / 8), 1, 0x0c1a24, 1);
    for (let i = 0; i < 26; i++) {
        const x = (c.rnd(i + 10) - 0.5) * 1.8 * h;
        const y = (c.rnd(i + 20) - 0.5) * 1.8 * h;
        const points = trace(i * 37, x, y, 6, h * 0.18, h * 0.95);
        const color = i % 4 === 0 ? ORANGE : CYAN;
        neonPath(c, points, color, 2);
        for (const [px, py] of [points[0], points[points.length - 1]]) {
            c.glow(px, py, h * 0.05, color, 0.5);
            c.disc(px, py, h * 0.015, 0xffffff);
        }
    }
    for (const [x, y] of [[-h * 0.55, -h * 0.55], [h * 0.5, h * 0.5]]) {
        c.quad(x - h * 0.12, y - h * 0.12, x + h * 0.12, y + h * 0.12, 0x101820);
        neonPath(c, [[x - h * 0.12, y - h * 0.12], [x + h * 0.12, y - h * 0.12], [x + h * 0.12, y + h * 0.12], [x - h * 0.12, y + h * 0.12]], CYAN, 2, true);
        const pins: Segment[] = [];
        for (let k = -3; k <= 3; k++) pins.push([x + k * h * 0.03, y - h * 0.12, x + k * h * 0.03, y - h * 0.17], [x + k * h * 0.03, y + h * 0.12, x + k * h * 0.03, y + h * 0.17]);
        c.lines(pins, 3, 0x7aa0b0, 1);
    }
    neonLines(c, square(h), CYAN, 3);
};

export default battlefield;

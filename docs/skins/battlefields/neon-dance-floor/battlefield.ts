// Dance floor: a battlefield of the neon style. Reference only, not production code.
import { type BattlefieldSkin, square } from '../../prototype/kit';
import { neonLines, gridLines, neonEdge } from '../../prototype/shapes';

const CYAN = 0x00f0ff;
const MAGENTA = 0xff2bd6;
const YELLOW = 0xffe14d;
const ORANGE = 0xff8a1a;

const battlefield: BattlefieldSkin = (c) => {
    const { h, world: w } = c;
    c.ground(0x060410);
    const palette = [MAGENTA, CYAN, YELLOW, 0x7a5cff, 0x2bff88, ORANGE];
    for (const s of c.spots(341, 12, w.left, w.far, w.right, w.near, 0)) {
        const color = palette[s.i % palette.length];
        c.poly([c.at(s.x, w.far), c.at(s.x - 500, s.y), c.at(s.x + 500, s.y)], color, 0.08);
        c.glow(s.x, s.y, 700, color, 0.25);
    }
    neonEdge(c, 0xffffff);
    const n = 8;
    const step = (2 * h) / n;
    c.quad(-h, -h, h, h, 0x101018);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const color = palette[Math.floor(c.rnd(i * 13 + j * 7) * palette.length)];
            const x = -h + i * step;
            const y = -h + j * step;
            const lit = c.rnd(i * 5 + j * 11) > 0.35;
            c.quad(x + step * 0.05, y + step * 0.05, x + step * 0.95, y + step * 0.95, color, lit ? 0.75 : 0.18);
            if (lit) c.quad(x + step * 0.3, y + step * 0.3, x + step * 0.7, y + step * 0.7, 0xffffff, 0.35);
        }
    }
    c.lines(gridLines(c, -h, -h, h, h, step), 4, 0x000000, 1);
    neonLines(c, square(h), 0xffffff, 3);
};

export default battlefield;

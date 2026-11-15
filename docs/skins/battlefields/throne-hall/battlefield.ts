// Throne hall battlefield. Reference only, not production code.
import { type BattlefieldSkin, square } from '../../prototype/kit';
import { crack } from '../../prototype/shapes';

const GOLD = 0xd4af37;

const battlefield: BattlefieldSkin = (c) => {
    const { h, world: w } = c;
    const tile = 600;
    for (let x = w.left; x < w.right; x += tile) {
        for (let y = w.far; y < w.near; y += tile) c.quad(x, y, x + tile, y + tile, (Math.round((x - w.left) / tile) + Math.round((y - w.far) / tile)) % 2 ? 0x241f2c : 0x1a1620);
    }
    c.side('left', 40, 0x8a8478, [2, 0x3a362f]);
    c.side('right', 40, 0x8a8478, [2, 0x3a362f]);
    c.side('near', 40, 0x9a9488, [2, 0x3a362f]);
    const n = 8;
    const step = (2 * h) / n;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const light = (i + j) % 2 === 0;
            const x = -h + i * step;
            const y = -h + j * step;
            c.quad(x, y, x + step, y + step, light ? 0xe8e4dc : 0x2b2830);
            const vein = crack(c, i * 31 + j, x + step * c.rnd(i + j * 5), y + step * c.rnd(i * 3 + j), step * 0.8, 5).map(([vx, vy]) => [Math.max(x, Math.min(x + step, vx)), Math.max(y, Math.min(y + step, vy))] as [number, number]);
            c.path(vein, 1.5, light ? 0x8a8478 : 0x5a5560, 0.5);
        }
    }
    c.quad(-h * 0.2, -h, h * 0.2, h, 0x8b1a1a);
    c.gradient(-h * 0.2, -h, h * 0.2, h, 0x6a1010, 0xa02222, 'y');
    c.lines([[-h * 0.17, -h, -h * 0.17, h], [h * 0.17, -h, h * 0.17, h]], 4, GOLD, 0.9);
    c.lines(square(h), 6, GOLD, 0.9);
    c.lines(square(h * 0.96), 2, GOLD, 0.6);
    const columns: [number, number][] = [];
    for (let y = -h; y <= h + 1; y += (2 * h) / 4) columns.push([-h - 420, y], [h + 420, y]);
    columns.sort((a, b) => a[1] - b[1]);
    for (const [x, y] of columns) {
        c.glow(x, y, 380, 0xffb347, 0.25);
        c.box(x - 160, y - 160, x + 160, y + 160, 80, 0xcfc9bb, 0xa8a294, 0xb8b2a4);
        c.pillar(x, y, 110, 1400, 0xd9d4c7, 0xf0ece2, [2, 0x8a8478]);
    }
};

export default battlefield;

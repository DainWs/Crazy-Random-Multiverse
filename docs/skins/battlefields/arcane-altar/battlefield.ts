// Arcane altar in the void: a battlefield of the fantasy style. Reference only, not production code.
import { type BattlefieldSkin, square, type Segment } from '../../prototype/kit';

const battlefield: BattlefieldSkin = (c) => {
    const { h, world: w } = c;
    const violet = 0xb05cff;
    c.ground(0x0b0614);
    for (const s of c.spots(31, 300, w.left, w.far, w.right, w.near, 0)) c.disc(s.x, s.y, 6 + s.r(3) * 10, s.r(4) > 0.7 ? violet : 0xffffff, 0.3 + s.r(5) * 0.5);
    for (const s of c.spots(32, 26, w.left, w.far, w.right, w.near, 500)) {
        const r = 150 + s.r(3) * 280;
        c.blob(s.x, s.y + r * 0.6, r * 0.9, s.i, 0x000000, 0.35);
        c.blob(s.x, s.y, r, s.i + 50, 0x2a1d38, 1, 0.35);
        c.blob(s.x - r * 0.1, s.y - r * 0.15, r * 0.7, s.i + 90, 0x3b2a50, 1, 0.35);
    }
    c.glow(0, 0, h * 2, violet, 0.3);
    c.side('left', 140, 0x150d20, [2, violet]);
    c.side('right', 140, 0x150d20, [2, violet]);
    c.side('near', 140, 0x1b1128, [2, violet]);
    c.quad(-h, -h, h, h, 0x120c1c);
    const grid: Segment[] = [];
    for (let k = -3; k <= 3; k++) grid.push([(k * h) / 4, -h, (k * h) / 4, h], [-h, (k * h) / 4, h, (k * h) / 4]);
    c.lines(grid, 2, 0x2a1d40, 1);
    c.glow(0, 0, h * 1.1, violet, 0.35);
    for (const [r, width, alpha] of [[0.86, 5, 0.9], [0.8, 2, 0.7], [0.55, 4, 0.8], [0.5, 2, 0.6], [0.2, 3, 0.8]] as const) {
        c.ring(0, 0, h * r, width * 3, violet, 0.12);
        c.ring(0, 0, h * r, width, 0xd9a6ff, alpha);
    }
    const star: [number, number][] = [];
    for (let i = 0; i <= 7; i++) {
        const a = ((i * 3) / 7) * Math.PI * 2 - Math.PI / 2;
        star.push([Math.cos(a) * h * 0.8, Math.sin(a) * h * 0.8]);
    }
    c.path(star, 10, violet, 0.15);
    c.path(star, 3, 0xe6c4ff, 0.9);
    for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2 - Math.PI / 2;
        c.disc(Math.cos(a) * h * 0.8, Math.sin(a) * h * 0.8, h * 0.06, 0x120c1c);
        c.ring(Math.cos(a) * h * 0.8, Math.sin(a) * h * 0.8, h * 0.06, 3, 0xe6c4ff, 0.9);
    }
    const ticks: Segment[] = [];
    for (let i = 0; i < 48; i++) {
        const a = (i / 48) * Math.PI * 2;
        ticks.push([Math.cos(a) * h * 0.55, Math.sin(a) * h * 0.55, Math.cos(a) * h * (i % 3 === 0 ? 0.8 : 0.62), Math.sin(a) * h * (i % 3 === 0 ? 0.8 : 0.62)]);
    }
    c.lines(ticks, 2, 0xd9a6ff, 0.35);
    for (const [x, y] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
        c.ring(x * h * 0.88, y * h * 0.88, h * 0.08, 3, 0xd9a6ff, 0.8);
        c.path([[x * h * 0.88, y * h * 0.8], [x * h * 0.81, y * h * 0.92], [x * h * 0.95, y * h * 0.92]], 2, 0xd9a6ff, 0.8, true);
    }
    c.lines(square(h), 10, violet, 0.2);
    c.lines(square(h), 3, 0xd9a6ff, 1);
};

export default battlefield;

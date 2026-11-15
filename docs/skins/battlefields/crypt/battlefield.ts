// Crypt battlefield. Reference only, not production code.
import { type BattlefieldSkin, square, type FieldCtx, type Segment } from '../../prototype/kit';
import { crack } from '../../prototype/shapes';

function slabs(c: FieldCtx, n: number, tones: number[], gapShare = 0.04, mortar?: number) {
    const { h } = c;
    if (mortar !== undefined) c.quad(-h, -h, h, h, mortar);
    const step = (2 * h) / n;
    const gap = step * gapShare;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const x = -h + i * step;
            const y = -h + j * step;
            c.quad(x + gap, y + gap, x + step - gap, y + step - gap, tones[Math.floor(c.rnd(i * 97 + j * 13) * tones.length)]);
        }
    }
}

function flame(c: FieldCtx, x: number, y: number, z: number, size: number) {
    c.glow(x, y, size * 6, 0xff8a00, 0.35);
    c.poly([c.at(x - size, y, z), c.at(x, y, z + size * 3.2), c.at(x + size, y, z)], 0xff6a00, 0.95);
    c.poly([c.at(x - size * 0.55, y, z), c.at(x, y, z + size * 2), c.at(x + size * 0.55, y, z)], 0xffd34d, 0.95);
}

const battlefield: BattlefieldSkin = (c) => {
    const { h, world: w } = c;
    c.ground(0x0d0d10);
    for (const s of c.spots(51, 40, w.left, w.far, w.right, w.near, 0)) c.glow(s.x, s.y, 500 + s.r(3) * 600, 0x3cff9a, 0.08);
    for (const s of c.spots(52, 10, w.left, w.far, w.right, w.near, 400)) {
        c.box(s.x - 260, s.y - 120, s.x + 260, s.y + 120, 200, 0x55555f, 0x3a3a42, 0x44444d, [2, 0x1a1a1f]);
        c.box(s.x - 280, s.y - 140, s.x + 280, s.y + 140, 30, 0x6a6a74, 0x4a4a52, 0x55555f, [2, 0x1a1a1f]);
    }
    c.side('left', 60, 0x2a2a30, [2, 0x000000]);
    c.side('right', 60, 0x2a2a30, [2, 0x000000]);
    c.side('near', 60, 0x303036, [2, 0x000000]);
    slabs(c, 7, [0x4a4a52, 0x44444c, 0x50505a, 0x3e3e46], 0.03, 0x15151a);
    for (let i = 0; i < 4; i++) {
        const x = (Math.floor(c.rnd(i + 70) * 7) - 3.5) * ((2 * h) / 7);
        const y = (Math.floor(c.rnd(i + 80) * 7) - 3.5) * ((2 * h) / 7);
        c.quad(x + 40, y + 40, x + (2 * h) / 7 - 40, y + (2 * h) / 7 - 40, 0x0a0a0d, 0.85);
    }
    for (let i = 0; i < 14; i++) c.path(crack(c, i * 5 + 3, (c.rnd(i) - 0.5) * 1.8 * h, (c.rnd(i + 9) - 0.5) * 1.8 * h, h * 0.35, 6), 3, 0x0a0a0d, 0.9);
    for (const [x, y] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        const web: Segment[] = [];
        for (let k = 0; k < 6; k++) {
            const a = (k / 5) * (Math.PI / 2);
            web.push([x * h, y * h, x * h - x * Math.cos(a) * h * 0.25, y * h - y * Math.sin(a) * h * 0.25]);
        }
        for (const r of [0.08, 0.15, 0.22]) {
            for (let k = 0; k < 5; k++) {
                const a0 = (k / 5) * (Math.PI / 2);
                const a1 = ((k + 1) / 5) * (Math.PI / 2);
                web.push([x * h - x * Math.cos(a0) * h * r, y * h - y * Math.sin(a0) * h * r, x * h - x * Math.cos(a1) * h * r, y * h - y * Math.sin(a1) * h * r]);
            }
        }
        c.lines(web, 1.5, 0xd0d0d8, 0.45);
    }
    const candles = c.spots(53, 60, -h * 1.6, -h * 1.6, h * 1.6, h * 1.6).filter((s) => Math.abs(s.x) > h * 0.85 || Math.abs(s.y) > h * 0.85);
    for (const s of candles) {
        c.glow(s.x, s.y, 220, 0xffa040, 0.3);
        c.pillar(s.x, s.y, 16, 60 + s.r(3) * 80, 0xe8e2d0, 0xf5f0e0);
        flame(c, s.x, s.y, 60 + s.r(3) * 80, 9);
    }
    c.glow(0, 0, h * 0.9, 0x3cff9a, 0.1);
    c.lines(square(h), 3, 0x15151a, 1);
};

export default battlefield;

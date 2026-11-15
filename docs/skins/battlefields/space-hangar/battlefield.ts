// Hangar in space: a battlefield of the sci-fi style. Reference only, not production code.
import { type BattlefieldSkin, square, type FieldCtx } from '../../prototype/kit';
import { metalPlates, metalDeck } from '../../prototype/shapes';

const AMBER = 0xffb000;
const CYAN = 0x3ae0ff;
const RED = 0xff3b30;

function space(c: FieldCtx, seed: number) {
    const { world: w } = c;
    c.ground(0x03040a);
    for (const s of c.spots(seed, 500, w.left, w.far, w.right, w.near, 0)) c.disc(s.x, s.y, 5 + s.r(3) * 9, s.r(4) > 0.8 ? 0xaad4ff : 0xffffff, 0.3 + s.r(5) * 0.7);
    for (const s of c.spots(seed + 1, 5, w.left, w.far, w.right, w.near, 600)) c.glow(s.x, s.y, 900 + s.r(3) * 900, [0x5a2a8a, 0x1a4a8a, 0x8a2a5a][s.i % 3], 0.25);
}

function hazard(c: FieldCtx, x0: number, y0: number, x1: number, y1: number, count: number, alpha = 0.9) {
    const w = (x1 - x0) / count;
    const lean = (y1 - y0) * 0.8;
    for (let i = 0; i < count; i++) {
        const x = x0 + i * w;
        c.poly([c.at(Math.max(x0, x + lean), y0), c.at(Math.min(x1, x + w + lean), y0), c.at(Math.min(x1, x + w), y1), c.at(x, y1)], i % 2 ? 0x111111 : AMBER, alpha);
    }
}

function corners(c: FieldCtx, color: number, inset = 0.9, arm = 0.12, width = 5) {
    const { h } = c;
    const o = h * inset;
    const a = h * arm;
    c.lines([
        [-o, -o, -o + a, -o], [-o, -o, -o, -o + a], [o, -o, o - a, -o], [o, -o, o, -o + a],
        [-o, o, -o + a, o], [-o, o, -o, o - a], [o, o, o - a, o], [o, o, o, o - a]
    ], width, color, 1);
}

const battlefield: BattlefieldSkin = (c) => {
    const { h, world: w } = c;
    space(c, 401);
    c.disc(w.left + 1400, h * 0.6, 1500, 0x2a4a8a);
    c.gradient(w.left - 200, h * 0.6 - 1500, w.left + 2900, h * 0.6 + 1500, 0x5a8ad0, 0x10203a, 'x', 16, 0.35);
    c.ring(w.left + 1400, h * 0.6, 1500, 18, 0x8ac0ff, 0.15);
    for (const y of [-h * 0.6, h * 0.1, h * 0.8]) {
        c.box(-h - 1600, y - 60, -h, y + 60, 60, 0x4a5560, 0x343c45, 0x3c454f, [1.5, 0x111111]);
        c.box(h, y - 60, h + 1600, y + 60, 60, 0x4a5560, 0x343c45, 0x3c454f, [1.5, 0x111111]);
        for (const x of [-h - 1600, h + 1600]) {
            c.glow(x, y, 160, RED, 0.6);
            c.disc(x, y, 30, 0xff8080, 1, 60);
        }
    }
    metalDeck(c, 70, AMBER);
    metalPlates(c, 6, [0x262e37, 0x2a333d, 0x232a32], 0x12171c, 0x5c6b7a);
    hazard(c, -h, -h + h * 0.02, h, -h + h * 0.08, 24);
    hazard(c, -h, h - h * 0.08, h, h - h * 0.02, 24);
    c.glow(0, 0, h * 0.5, AMBER, 0.2);
    c.ring(0, 0, h * 0.32, 8, AMBER, 0.6);
    c.ring(0, 0, h * 0.26, 2, AMBER, 0.45);
    corners(c, AMBER);
    for (let k = -4; k <= 4; k++) {
        for (const x of [-h * 0.97, h * 0.97]) {
            c.glow(x, k * h * 0.2, h * 0.04, CYAN, 0.7);
        }
    }
    c.lines(square(h), 3, 0x5c6b7a, 1);
};

export default battlefield;

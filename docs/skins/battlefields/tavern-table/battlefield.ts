// Tavern table battlefield. Reference only, not production code.
import { type BattlefieldSkin, square, type FieldCtx } from '../../prototype/kit';
import { woodPlanks, NAIL } from '../../prototype/shapes';

function candle(c: FieldCtx, x: number, y: number, z: number) {
    c.glow(x, y, 500, 0xffa040, 0.3);
    c.pillar(x, y, 30, z, 0xe8e2d0, 0xf5f0e0);
    c.glow(x, y, 90, 0xffd34d, 0.8);
    c.poly([c.at(x - 18, y, z), c.at(x, y, z + 70), c.at(x + 18, y, z)], 0xffb020);
}

const battlefield: BattlefieldSkin = (c) => {
    const { h, world: w } = c;
    const tile = 600;
    c.ground(0x2a2420);
    for (let x = w.left; x < w.right; x += tile) {
        for (let y = w.far; y < w.near; y += tile) c.quad(x + 15, y + 15, x + tile - 15, y + tile - 15, [0x5a4e44, 0x524740, 0x62564a][Math.floor(c.rnd(x * 7 + y) * 3)]);
    }
    c.glow(-h - 1200, 0, 1800, 0xff8a2a, 0.35);
    const t = h * 1.28;
    c.side('left', 160, 0x3b2410, [3, 0x1a0e06]);
    c.side('right', 160, 0x3b2410, [3, 0x1a0e06]);
    c.quad(-t, -t, t, t, 0x000000, 0.35);
    c.quad(-t, -t, t, t, 0x5a3418);
    woodPlanks(c, -t, -t, t, t, 8, [0x6e4220, 0x7a4a26, 0x65391c], 0x2a170a, 621, false, 'y');
    c.lines(square(h), 6, 0x2a170a, 0.8);
    c.lines(square(h * 1.02), 2, NAIL, 0.6);
    for (const s of c.spots(622, 9, -h * 0.9, -h * 0.9, h * 0.9, h * 0.9)) {
        c.ring(s.x, s.y, h * 0.08, 6, 0x3a1e0a, 0.4);
        c.ring(s.x, s.y, h * 0.072, 2, 0x3a1e0a, 0.3);
    }
    for (const [x, y] of [[-t * 0.9, -t * 0.4], [t * 0.9, t * 0.5], [t * 0.9, -t * 0.7]]) {
        c.pillar(x, y, 80, 200, 0x8a6a3a, 0xf0e0b0, [3, 0x3a2410]);
        c.disc(x, y, 64, 0xf8f4e8, 1, 200);
    }
    for (const [x, y] of [[-t * 0.9, t * 0.6], [t * 0.92, -t * 0.05]]) candle(c, x, y, 150);
};

export default battlefield;

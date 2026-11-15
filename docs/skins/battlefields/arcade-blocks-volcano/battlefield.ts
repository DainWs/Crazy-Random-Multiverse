// Volcano: a battlefield of the arcade-blocks style. Reference only, not production code.
import { type BattlefieldSkin } from '../../prototype/kit';
import { cube, blockLayers, checker } from '../../prototype/shapes';

const SEEN = { left: -3800, far: -3400, right: 3800, near: 2400 };

const battlefield: BattlefieldSkin = (c) => {
    const { h, world: w } = c;
    c.ground(0xff6a00);
    for (const s of c.spots(531, 80, w.left, w.far, w.right, w.near, 0)) c.quad(s.x - 220, s.y - 220, s.x + 220, s.y + 220, s.r(3) > 0.5 ? 0xffb000 : 0xff3a00);
    for (const s of c.spots(532, 30, SEEN.left, SEEN.far, SEEN.right, SEEN.near, 250)) {
        const size = 200 + s.r(3) * 200;
        cube(c, s.x, s.y, size, -size * 0.6, 0x3a2a2a, 0x241818, 0x2e2020);
    }
    c.glow(0, 0, h * 2.2, 0xff6a00, 0.35);
    blockLayers(c, 220, 0x3a2a2a, 0x2e2020, [0xff6a00, 0x241818]);
    checker(c, 10, (i, j) => (c.rnd(i * 10 + j) > 0.88 ? 0xff7a1a : (i + j) % 2 ? 0x4a3838 : 0x3a2a2a));
};

export default battlefield;

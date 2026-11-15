// Desert: a battlefield of the arcade-blocks style. Reference only, not production code.
import { type BattlefieldSkin } from '../../prototype/kit';
import { cube, blockLayers, checker } from '../../prototype/shapes';

const SEEN = { left: -3800, far: -3400, right: 3800, near: 2400 };

const battlefield: BattlefieldSkin = (c) => {
    const { world: w } = c;
    c.ground(0xf2c879);
    for (const s of c.spots(511, 50, w.left, w.far, w.right, w.near, 0)) c.blob(s.x, s.y, 300 + s.r(3) * 500, s.i, s.r(4) > 0.5 ? 0xe0b060 : 0xf7d898, 0.7);
    for (const s of c.spots(512, 26, SEEN.left, SEEN.far, SEEN.right, SEEN.near, 300)) {
        const size = 120 + s.r(3) * 60;
        for (let k = 0; k < 3 + Math.floor(s.r(4) * 3); k++) cube(c, s.x, s.y, size, k * size, 0x5cbf4a, 0x3a8a2e, 0x46a038);
        if (s.r(5) > 0.4) cube(c, s.x + size, s.y, size * 0.8, size * 1.5, 0x5cbf4a, 0x3a8a2e, 0x46a038);
    }
    for (const s of c.spots(513, 20, SEEN.left, SEEN.far, SEEN.right, SEEN.near, 300)) cube(c, s.x, s.y, 160, 0, 0xd9a25a, 0xa8743a, 0xbd8a48);
    blockLayers(c, 160, 0xd9a25a, 0xbd8a48, [0xc08840, 0xa8743a]);
    checker(c, 10, (i, j) => ((i + j) % 2 ? 0xf7dc9a : 0xebc77a));
};

export default battlefield;

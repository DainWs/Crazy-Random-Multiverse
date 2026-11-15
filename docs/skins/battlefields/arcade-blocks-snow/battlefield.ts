// Snow: a battlefield of the arcade-blocks style. Reference only, not production code.
import { type BattlefieldSkin, type FieldCtx } from '../../prototype/kit';
import { block, cube, blockLayers, checker } from '../../prototype/shapes';

const SEEN = { left: -3800, far: -3400, right: 3800, near: 2400 };

function pine(c: FieldCtx, x: number, y: number, size: number, snow: boolean) {
    cube(c, x, y, size * 0.3, 0, 0x7a4e2c, 0x5a3a20, 0x6a4426);
    for (let k = 0; k < 3; k++) {
        const s = size * (1 - k * 0.28);
        const z = size * 0.3 + k * size * 0.42;
        block(c, x - s / 2, y - s / 2, x + s / 2, y + s / 2, z, z + size * 0.42, snow ? 0xffffff : 0x2e8b3a, 0x1d5e26, 0x236b2d);
    }
}

const battlefield: BattlefieldSkin = (c) => {
    const { h, world: w } = c;
    c.ground(0xf4f8fc);
    for (const s of c.spots(521, 60, w.left, w.far, w.right, w.near, 0)) c.quad(s.x - 200, s.y - 200, s.x + 200, s.y + 200, 0xe2ecf5);
    for (const s of c.spots(522, 40, SEEN.left, SEEN.far, SEEN.right, SEEN.near, 300)) pine(c, s.x, s.y, 260 + s.r(3) * 140, s.r(4) > 0.5);
    blockLayers(c, 180, 0x8fd0ff, 0x6ab8f0, [0x5aa0d8, 0xffffff]);
    checker(c, 10, (i, j) => ((i + j) % 2 ? 0xffffff : 0xcfe9fb));
    for (const s of c.spots(523, 12, -h, -h, h, h)) c.quad(s.x - 90, s.y - 90, s.x + 90, s.y + 90, 0x9fd8ff, 0.8);
};

export default battlefield;

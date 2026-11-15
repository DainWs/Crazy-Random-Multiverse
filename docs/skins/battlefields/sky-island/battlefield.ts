// Floating island in the sky: a battlefield of the arcade-blocks style. Reference only, not production code.
import { type BattlefieldSkin, type FieldCtx } from '../../prototype/kit';
import { block, blockLayers, checker } from '../../prototype/shapes';

const SEEN = { left: -3800, far: -3400, right: 3800, near: 2400 };

function cloud(c: FieldCtx, x: number, y: number, z: number, size: number) {
    for (const [dx, dy, k] of [[0, 0, 1], [size * 0.7, size * 0.1, 0.8], [-size * 0.7, size * 0.1, 0.8], [size * 0.2, -size * 0.4, 0.7]]) {
        block(c, x + dx - size * k * 0.6, y + dy - size * k * 0.4, x + dx + size * k * 0.6, y + dy + size * k * 0.4, z, z + size * k * 0.5, 0xffffff, 0xd8e8f5, 0xe8f2fa, 2);
    }
}

const battlefield: BattlefieldSkin = (c) => {
    const { h, world: w } = c;
    c.gradient(w.left, w.far, w.right, w.near, 0x5ab4ff, 0xa8dcff, 'y');
    for (const s of c.spots(501, 26, SEEN.left, SEEN.far, SEEN.right, SEEN.near, 250)) cloud(c, s.x, s.y, -200 + s.r(3) * 600, 220 + s.r(4) * 260);
    blockLayers(c, 260, 0xa0522d, 0x8b4513, [0x7a3e1d, 0x6a6a6a, 0x7a3e1d]);
    checker(c, 10, (i, j) => ((i + j) % 2 ? 0x7bed9f : 0x2ed573));
    for (const s of c.spots(502, 30, -h, -h, h, h)) c.quad(s.x - 30, s.y - 30, s.x + 30, s.y + 30, s.r(3) > 0.5 ? 0xffe14d : 0xff6b9a);
};

export default battlefield;

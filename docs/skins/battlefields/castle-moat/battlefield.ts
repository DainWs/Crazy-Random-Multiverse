// Castle with a moat battlefield. Reference only, not production code.
import { type BattlefieldSkin, type Segment } from '../../prototype/kit';
import { block, cube, blockLayers, checker, OUTLINE } from '../../prototype/shapes';

const battlefield: BattlefieldSkin = (c) => {
    const { h, world: w } = c;
    c.ground(0x3a8ad8);
    const waves: Segment[] = [];
    for (const s of c.spots(541, 140, w.left, w.far, w.right, w.near, 300)) waves.push([s.x - 80, s.y, s.x + 80, s.y]);
    c.lines(waves, 6, 0x8ac8ff, 1);
    for (const s of c.spots(542, 30, w.left, w.far, w.right, w.near, 900)) c.quad(s.x - 400, s.y - 400, s.x + 400, s.y + 400, 0x4caf50);
    blockLayers(c, 150, 0x8a8a92, 0x74747c, [0x5a5a62]);
    checker(c, 12, (i, j) => [0xa8a8b0, 0x9a9aa2, 0xb4b4bc][(i * 7 + j * 3) % 3]);
    const size = h * 0.16;
    const towers: [number, number][] = [[-h - size * 0.2, -h - size * 0.2], [h + size * 0.2, -h - size * 0.2], [-h - size * 0.2, h + size * 0.2], [h + size * 0.2, h + size * 0.2]];
    for (const [x, y] of towers) {
        block(c, x - size / 2, y - size / 2, x + size / 2, y + size / 2, 0, size * 2.6, 0xb4b4bc, 0x8a8a92, 0x9a9aa2);
        for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) cube(c, x + dx * size * 0.35, y + dy * size * 0.35, size * 0.25, size * 2.6, 0xc4c4cc, 0x9a9aa2, 0xaaaab2);
        block(c, x - size * 0.15, y + size * 0.5 - 2, x + size * 0.15, y + size * 0.5, size * 1.5, size * 1.9, OUTLINE, 0x222222, OUTLINE);
    }
};

export default battlefield;

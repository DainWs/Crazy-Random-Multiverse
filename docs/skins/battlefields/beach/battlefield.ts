// Beach battlefield. Reference only, not production code.
import { type BattlefieldSkin, type Segment } from '../../prototype/kit';
import { cube, blockLayers, checker } from '../../prototype/shapes';

const battlefield: BattlefieldSkin = (c) => {
    const { h, world: w } = c;
    c.gradient(w.left, w.far, w.right, w.near, 0x3ac0e8, 0x1a8ad8, 'y');
    for (let k = 0; k < 8; k++) c.quad(-h - 400 - k * 120, -h - 400 - k * 120, h + 400 + k * 120, h + 400 + k * 120, 0x7fdcf0, 0.08);
    c.quad(-h - 400, -h - 400, h + 400, h + 400, 0xf7e1a0);
    const foam: Segment[] = [];
    for (const s of c.spots(551, 160, w.left, w.far, w.right, w.near, 450)) foam.push([s.x - 70, s.y, s.x + 70, s.y]);
    c.lines(foam, 6, 0xffffff, 0.8);
    for (const s of c.spots(552, 16, -h - 400, -h - 400, h + 400, h + 400, 60)) {
        for (let k = 0; k < 5; k++) cube(c, s.x, s.y, 80, k * 80, 0xa0703a, 0x7a5028, 0x8a5e30);
        for (const [dx, dy] of [[0, 0], [160, 0], [-160, 0], [0, 160], [0, -160]]) cube(c, s.x + dx, s.y + dy, 160, 400, 0x2ecc71, 0x1e8449, 0x27ae60);
    }
    blockLayers(c, 120, 0xf2d48a, 0xe0c070, [0xd8b060]);
    checker(c, 10, (i, j) => ((i + j) % 2 ? 0xfbe9b5 : 0xf2d898));
    for (const [x, y, color] of [[-h * 0.7, -h * 0.6, 0xff6b6b], [h * 0.6, h * 0.65, 0xffe14d]] as const) {
        c.disc(x, y, h * 0.12, 0x000000, 0.15);
        c.quad(x - h * 0.08, y - h * 0.04, x + h * 0.08, y + h * 0.04, color);
    }
};

export default battlefield;

// Dojo: a battlefield of the wood style. Reference only, not production code.
import { type BattlefieldSkin, square, type Segment } from '../../prototype/kit';
import { woodPlanks, woodEdges } from '../../prototype/shapes';

const battlefield: BattlefieldSkin = (c) => {
    const { h, world: w } = c;
    woodPlanks(c, w.left, w.far, w.right, w.near, 28, [0x5a3a20, 0x62402a, 0x52341c], 0x24160a, 761, false);
    for (const x of [-h - 900, h + 900]) {
        for (let k = 0; k < 6; k++) {
            const y0 = -h * 1.6 + k * h * 0.55;
            const y1 = y0 + h * 0.55;
            const face = [c.at(x, y0), c.at(x, y1), c.at(x, y1, 1300), c.at(x, y0, 1300)];
            c.poly(face, 0xf2ead8);
            c.g.lineStyle(10, 0x3a2414, 1);
            c.g.strokePoints(face as Phaser.Math.Vector2[], true);
            for (let r = 1; r < 4; r++) {
                const a = c.at(x, y0, (1300 * r) / 4);
                const b = c.at(x, y1, (1300 * r) / 4);
                c.g.lineStyle(4, 0x3a2414, 1);
                c.g.lineBetween(a.x, a.y, b.x, b.y);
            }
            const m0 = c.at(x, (y0 + y1) / 2);
            const m1 = c.at(x, (y0 + y1) / 2, 1300);
            c.g.lineBetween(m0.x, m0.y, m1.x, m1.y);
        }
    }
    woodEdges(c, 50, 0xc8a878, 0xb89868, 0x3a2414);
    c.quad(-h, -h, h, h, 0x2a1e10);
    const mat = (x0: number, y0: number, x1: number, y1: number) => {
        c.quad(x0 + 6, y0 + 6, x1 - 6, y1 - 6, 0xcfc48a);
        c.quad(x0 + 6, y0 + 6, x1 - 6, y1 - 6, 0x9ab06a, 0.25);
        const weave: Segment[] = [];
        const long = x1 - x0 > y1 - y0;
        for (let k = 1; k < 24; k++) weave.push(long ? [x0 + 6, y0 + ((y1 - y0) * k) / 24, x1 - 6, y0 + ((y1 - y0) * k) / 24] : [x0 + ((x1 - x0) * k) / 24, y0 + 6, x0 + ((x1 - x0) * k) / 24, y1 - 6]);
        c.lines(weave, 1, 0x8a7a4a, 0.35);
        c.path([[x0 + 6, y0 + 6], [x1 - 6, y0 + 6], [x1 - 6, y1 - 6], [x0 + 6, y1 - 6]], 10, 0x1e2a1a, 1, true);
    };
    const u = h / 2;
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 2; col++) {
            const y0 = -h + row * u;
            if ((row + col) % 2) {
                mat(-h + col * 2 * u, y0, -h + col * 2 * u + u, y0 + u);
                mat(-h + col * 2 * u + u, y0, -h + (col + 1) * 2 * u, y0 + u);
            } else mat(-h + col * 2 * u, y0, -h + (col + 1) * 2 * u, y0 + u);
        }
    }
    c.lines(square(h), 6, 0x3a2414, 1);
};

export default battlefield;

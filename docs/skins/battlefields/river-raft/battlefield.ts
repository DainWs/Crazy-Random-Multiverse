// Raft on a river battlefield. Reference only, not production code.
import { type BattlefieldSkin, type Segment } from '../../prototype/kit';
import { woodEdges } from '../../prototype/shapes';

const battlefield: BattlefieldSkin = (c) => {
    const { h, world: w } = c;
    c.gradient(w.left, w.far, w.right, w.near, 0x1e6a8a, 0x2a8aa0, 'y');
    const flow: Segment[] = [];
    for (const s of c.spots(691, 160, w.left, w.far, w.right, w.near, 250)) flow.push([s.x, s.y - 200, s.x, s.y + 200]);
    c.lines(flow, 4, 0xa8e0f0, 0.35);
    for (const x of [w.left, w.right - 1500]) c.quad(x, w.far, x + 1500, w.near, 0x3a7a3a);
    for (const s of c.spots(692, 40, w.left, w.far, w.right, w.near, 1700)) {
        c.disc(s.x, s.y, 260, 0x1e4a1e, 1, 300);
        c.pillar(s.x, s.y, 40, 300, 0x4a2f1b, 0x3a2414);
        c.disc(s.x, s.y, 300, 0x2e6a2e, 1, 420);
    }
    woodEdges(c, 110, 0x5a3418, 0x4a2a12, 0x1e1008);
    c.quad(-h, -h, h, h, 0x2a170a);
    const logs = 11;
    const step = (2 * h) / logs;
    for (let i = 0; i < logs; i++) {
        const x = -h + i * step;
        c.quad(x + step * 0.04, -h, x + step * 0.96, h, [0x8a5a32, 0x7a4e2c, 0x9a6a3c][i % 3]);
        c.quad(x + step * 0.2, -h, x + step * 0.36, h, 0xffffff, 0.12);
        c.quad(x + step * 0.72, -h, x + step * 0.96, h, 0x000000, 0.2);
        for (const y of [-h, h]) {
            c.disc(x + step / 2, y, step * 0.46, 0xc8a070);
            c.ring(x + step / 2, y, step * 0.3, 3, 0x8a5a32, 0.8);
            c.ring(x + step / 2, y, step * 0.15, 2, 0x8a5a32, 0.8);
        }
    }
    for (const y of [-h * 0.6, 0, h * 0.6]) {
        c.quad(-h, y - h * 0.03, h, y + h * 0.03, 0xc2a070);
        const twist: Segment[] = [];
        for (let k = -20; k < 20; k++) twist.push([(k * h) / 20, y - h * 0.03, ((k + 1) * h) / 20, y + h * 0.03]);
        c.lines(twist, 2, 0x8a6a3a, 0.8);
    }
};

export default battlefield;

// Star chart: a battlefield of the parchment style. Reference only, not production code.
import { type BattlefieldSkin, square, type FieldCtx, type Segment } from '../../prototype/kit';

function shadow(c: FieldCtx) {
    const { h } = c;
    c.quad(-h + 60, -h + 60, h + 140, h + 140, 0x000000, 0.35);
}

const battlefield: BattlefieldSkin = (c) => {
    const { h, world: w } = c;
    c.ground(0x24122e);
    for (const s of c.spots(241, 400, w.left, w.far, w.right, w.near, 0)) c.disc(s.x, s.y, 25 + s.r(3) * 40, 0x2e1840, 0.6);
    shadow(c);
    c.quad(-h, -h, h, h, 0x182448);
    c.glow(0, 0, h * 1.2, 0x2a3a6a, 0.6);
    for (const s of c.spots(242, 500, -h, -h, h, h)) c.disc(s.x, s.y, 4 + s.r(3) * 9, 0xf5e6b0, 0.4 + s.r(4) * 0.6);
    const gold = 0xe0b84a;
    c.ring(0, 0, h * 0.95, 4, gold, 0.9);
    c.ring(0, 0, h * 0.8, 2, gold, 0.8);
    const ticks: Segment[] = [];
    for (let i = 0; i < 72; i++) {
        const a = (i / 72) * Math.PI * 2;
        ticks.push([Math.cos(a) * h * (i % 6 === 0 ? 0.8 : 0.9), Math.sin(a) * h * (i % 6 === 0 ? 0.8 : 0.9), Math.cos(a) * h * 0.95, Math.sin(a) * h * 0.95]);
    }
    c.lines(ticks, 2, gold, 0.7);
    for (let i = 0; i < 12; i++) {
        const a = ((i + 0.5) / 12) * Math.PI * 2;
        c.ring(Math.cos(a) * h * 0.875, Math.sin(a) * h * 0.875, h * 0.035, 2, gold, 0.9);
    }
    for (const s of c.spots(243, 9, -h * 0.65, -h * 0.65, h * 0.65, h * 0.65)) {
        const stars = c.spots(s.i + 500, 5, s.x - h * 0.18, s.y - h * 0.18, s.x + h * 0.18, s.y + h * 0.18);
        c.path(stars.map((t) => [t.x, t.y] as [number, number]), 2, 0xbfd4ff, 0.6);
        for (const t of stars) {
            c.glow(t.x, t.y, h * 0.03, 0xffffff, 0.6);
            c.disc(t.x, t.y, 12, 0xffffff);
        }
    }
    c.ring(0, 0, h * 0.25, 3, gold, 0.6);
    c.lines([[-h * 0.35, 0, h * 0.35, 0], [0, -h * 0.35, 0, h * 0.35]], 2, gold, 0.5);
    c.lines(square(h), 6, gold, 0.9);
};

export default battlefield;

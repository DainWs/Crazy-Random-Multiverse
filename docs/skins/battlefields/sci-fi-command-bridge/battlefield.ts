// Command bridge: a battlefield of the sci-fi style. Reference only, not production code.
import { type BattlefieldSkin, square, type Segment } from '../../prototype/kit';
import { metalPlates, metalDeck } from '../../prototype/shapes';

const AMBER = 0xffb000;
const CYAN = 0x3ae0ff;
const RED = 0xff3b30;

const battlefield: BattlefieldSkin = (c) => {
    const { h, world: w } = c;
    c.ground(0x0b1018);
    const floor: Segment[] = [];
    for (let x = w.left; x < w.right; x += 500) floor.push([x, w.far, x, w.near]);
    for (let y = w.far; y < w.near; y += 500) floor.push([w.left, y, w.right, y]);
    c.lines(floor, 3, 0x141c28, 1);
    const consoles = c.spots(411, 26, -h - 1300, -h * 1.2, h + 1300, h * 1.4, 250);
    for (const s of consoles) {
        c.box(s.x - 220, s.y - 120, s.x + 220, s.y + 120, 260, 0x1c2633, 0x141c26, 0x18202b, [1.5, 0x0a0e14]);
        const a = c.at(s.x - 180, s.y - 90, 262);
        const b = c.at(s.x + 180, s.y + 90, 262);
        c.g.fillStyle([CYAN, AMBER, 0x7aff9a][s.i % 3], 0.75);
        c.g.fillRect(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.abs(b.x - a.x), Math.abs(b.y - a.y));
        c.glow(s.x, s.y, 300, [CYAN, AMBER, 0x7aff9a][s.i % 3], 0.2);
    }
    metalDeck(c, 50, CYAN);
    metalPlates(c, 8, [0x18222e, 0x1c2734, 0x152029], 0x0b1018);
    c.glow(0, 0, h * 0.8, CYAN, 0.25);
    for (const [r, width, alpha] of [[0.6, 4, 0.8], [0.5, 2, 0.5], [0.35, 2, 0.5], [0.2, 3, 0.8]]) c.ring(0, 0, h * r, width, CYAN, alpha);
    c.lines([[-h * 0.6, 0, h * 0.6, 0], [0, -h * 0.6, 0, h * 0.6]], 1.5, CYAN, 0.5);
    for (const s of c.spots(412, 9, -h * 0.55, -h * 0.55, h * 0.55, h * 0.55)) {
        if (Math.hypot(s.x, s.y) > h * 0.55) continue;
        c.glow(s.x, s.y, h * 0.05, s.r(3) > 0.5 ? RED : 0x7aff9a, 0.9);
    }
    c.lines(square(h), 3, CYAN, 0.8);
};

export default battlefield;

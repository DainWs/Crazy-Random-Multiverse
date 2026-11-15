// Fantasy battlefield: a floor of stone slabs with a gold inlay and a rune circle in the middle.
import { square, type BattlefieldSkin } from '../prototype/kit';

const SLABS = 8;
const TONES = [0x353a46, 0x30343f, 0x3a3f4c, 0x2d313b];
const GOLD = 0xd4af37;
const RUNES = 16;

const battlefield: BattlefieldSkin = (c) => {
    const { h } = c;
    c.side('left', 70, 0x1c1e25, [2, 0x0d0e12]);
    c.side('right', 70, 0x1c1e25, [2, 0x0d0e12]);
    c.side('near', 70, 0x23262f, [2, 0x0d0e12]);

    c.quad(-h, -h, h, h, 0x15171c);
    const step = (2 * h) / SLABS;
    const gap = step * 0.04;
    for (let i = 0; i < SLABS; i++) {
        for (let j = 0; j < SLABS; j++) {
            const x = -h + i * step;
            const y = -h + j * step;
            c.quad(x + gap, y + gap, x + step - gap, y + step - gap, TONES[Math.floor(c.rnd(i * SLABS + j) * TONES.length)]);
        }
    }

    c.lines(square(h * 0.94), 6, GOLD, 0.75);
    c.lines(square(h * 0.9), 2, GOLD, 0.5);
    const d = h * 0.03;
    for (const [x, y] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
        const cx = x * h * 0.92;
        const cy = y * h * 0.92;
        c.poly([c.at(cx - d, cy), c.at(cx, cy - d), c.at(cx + d, cy), c.at(cx, cy + d)], GOLD, 0.9);
    }

    c.ring(0, 0, h * 0.32, 5, GOLD, 0.45);
    c.ring(0, 0, h * 0.27, 2, GOLD, 0.35);
    const ticks: [number, number, number, number][] = [];
    for (let i = 0; i < RUNES; i++) {
        const a = (i / RUNES) * Math.PI * 2;
        const inner = i % 2 === 0 ? 0.27 : 0.29;
        ticks.push([Math.cos(a) * h * inner, Math.sin(a) * h * inner, Math.cos(a) * h * 0.32, Math.sin(a) * h * 0.32]);
    }
    c.lines(ticks, 3, GOLD, 0.4);

    c.lines(square(h), 3, GOLD, 0.9);
};

export default battlefield;

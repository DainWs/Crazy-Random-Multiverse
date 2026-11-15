// Wood battlefield: a deck of staggered planks with grain and nails, inside a frame of beams.
import { square, type BattlefieldSkin } from '../prototype/kit';

const SEAM = 0x3b2410;
const BEAM = 0x4a2a12;
const NAIL = 0xc9a66b;
const ROWS = 14;
const TONES = [0x7a4a26, 0x6e4220, 0x845230, 0x734624];

const battlefield: BattlefieldSkin = (c) => {
    const { h } = c;
    c.side('left', 60, 0x3f230f, [3, 0x2a170a]);
    c.side('right', 60, 0x3f230f, [3, 0x2a170a]);
    c.side('near', 60, BEAM, [3, 0x2a170a]);

    c.quad(-h, -h, h, h, SEAM);
    const row = (2 * h) / ROWS;
    const gap = h * 0.006;
    const nail = h * 0.006;
    const grain: [number, number, number, number][] = [];
    let index = 0;
    for (let j = 0; j < ROWS; j++) {
        const y0 = -h + j * row;
        let x = -h;
        while (x < h) {
            const length = h * (0.35 + c.rnd(index * 7 + j) * 0.5) * (x === -h ? c.rnd(j + 50) + 0.3 : 1);
            const x1 = Math.min(h, x + length);
            c.quad(x + gap, y0 + gap, x1 - gap, y0 + row - gap, TONES[Math.floor(c.rnd(index) * TONES.length)]);
            grain.push([x + gap * 4, y0 + row / 3, x1 - gap * 4, y0 + row / 3], [x + gap * 4, y0 + (2 * row) / 3, x1 - gap * 4, y0 + (2 * row) / 3]);
            for (const nx of [x + row * 0.3, x1 - row * 0.3]) {
                for (const ny of [y0 + row * 0.3, y0 + row * 0.7]) c.quad(nx - nail, ny - nail, nx + nail, ny + nail, NAIL);
            }
            x = x1;
            index++;
        }
    }
    c.lines(grain, 1.5, 0x5a3418, 0.35);

    const frame = h * 0.05;
    c.quad(-h, -h, h, -h + frame, BEAM);
    c.quad(-h, h - frame, h, h, BEAM);
    c.quad(-h, -h + frame, -h + frame, h - frame, BEAM);
    c.quad(h - frame, -h + frame, h, h - frame, BEAM);
    c.lines(square(h - frame), 3, 0x2a170a, 1);
    c.lines(square(h), 3, 0x2a170a, 1);
};

export default battlefield;

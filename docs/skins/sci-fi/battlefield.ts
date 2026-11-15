// Sci-fi battlefield: the deck of a hangar, with metal plates, a landing circle, hazard stripes and corner brackets.
import { square, type BattlefieldSkin } from '../prototype/kit';

const AMBER = 0xffb000;
const PLATES = 6;
const TONES = [0x262e37, 0x2a333d, 0x232a32];
const STRIPES = 24;

const battlefield: BattlefieldSkin = (c) => {
    const { h, g } = c;
    c.side('left', 50, 0x1a2027, [2, 0x0b0f13]);
    c.side('right', 50, 0x1a2027, [2, 0x0b0f13]);
    c.side('near', 50, 0x1f262e, [2, 0x0b0f13]);
    const nearLeft = c.at(-h, h);
    const nearRight = c.at(h, h);
    g.lineStyle(4, AMBER, 0.8);
    g.lineBetween(nearLeft.x, nearLeft.y + 25, nearRight.x, nearRight.y + 25);

    c.quad(-h, -h, h, h, 0x12171c);
    const step = (2 * h) / PLATES;
    const gap = step * 0.012;
    const rivet = h * 0.008;
    for (let i = 0; i < PLATES; i++) {
        for (let j = 0; j < PLATES; j++) {
            const x = -h + i * step;
            const y = -h + j * step;
            c.quad(x + gap, y + gap, x + step - gap, y + step - gap, TONES[Math.floor(c.rnd(i * PLATES + j) * TONES.length)]);
            for (const [rx, ry] of [[x + step * 0.06, y + step * 0.06], [x + step * 0.94, y + step * 0.06], [x + step * 0.06, y + step * 0.94], [x + step * 0.94, y + step * 0.94]]) {
                c.quad(rx - rivet, ry - rivet, rx + rivet, ry + rivet, 0x5c6b7a);
            }
        }
    }

    for (const [y0, y1] of [[-h + h * 0.02, -h + h * 0.08], [h - h * 0.08, h - h * 0.02]]) {
        const w = (2 * h) / STRIPES;
        const lean = (y1 - y0) * 0.8;
        for (let i = 0; i < STRIPES; i++) {
            const x = -h + i * w;
            const color = i % 2 === 0 ? AMBER : 0x111111;
            c.poly([c.at(Math.max(-h, x + lean), y0), c.at(Math.min(h, x + w + lean), y0), c.at(Math.min(h, x + w), y1), c.at(x, y1)], color, 0.85);
        }
    }

    c.ring(0, 0, h * 0.3, 8, AMBER, 0.55);
    c.ring(0, 0, h * 0.24, 2, AMBER, 0.4);
    c.lines([[-h * 0.16, 0, h * 0.16, 0], [0, -h * 0.16, 0, h * 0.16]], 3, AMBER, 0.35);

    const arm = h * 0.12;
    const o = h * 0.9;
    c.lines([
        [-o, -o, -o + arm, -o], [-o, -o, -o, -o + arm],
        [o, -o, o - arm, -o], [o, -o, o, -o + arm],
        [-o, o, -o + arm, o], [-o, o, -o, o - arm],
        [o, o, o - arm, o], [o, o, o, o - arm]
    ], 5, AMBER, 1);

    c.lines(square(h), 3, 0x5c6b7a, 1);
};

export default battlefield;

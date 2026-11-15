// Neon battlefield: a synthwave grid floor in magenta, a glow on the horizon and a cyan outline.
import { square, type BattlefieldSkin } from '../prototype/kit';

const CYAN = 0x00f0ff;
const MAGENTA = 0xff2bd6;
const CELLS = 10;
const HORIZON = [0.25, 0.15, 0.08, 0.04];

const battlefield: BattlefieldSkin = (c) => {
    const { h } = c;
    c.side('left', 30, 0x0b0820, [2, CYAN]);
    c.side('right', 30, 0x0b0820, [2, CYAN]);
    c.side('near', 30, 0x0b0820, [2, CYAN]);

    c.quad(-h, -h, h, h, 0x07051a);
    const band = h * 0.04;
    HORIZON.forEach((alpha, i) => c.quad(-h, -h + i * band, h, -h + (i + 1) * band, MAGENTA, alpha));

    const grid: [number, number, number, number][] = [];
    for (let k = 1; k < CELLS; k++) {
        const v = -h + (k * 2 * h) / CELLS;
        grid.push([v, -h, v, h], [-h, v, h, v]);
    }
    c.lines(grid, 8, MAGENTA, 0.1);
    c.lines(grid, 2, MAGENTA, 0.85);

    c.ring(0, 0, h * 0.25, 6, CYAN, 0.12);
    c.ring(0, 0, h * 0.25, 2, CYAN, 0.5);

    c.lines(square(h), 12, CYAN, 0.08);
    c.lines(square(h), 6, CYAN, 0.18);
    c.lines(square(h), 2.5, CYAN, 1);
};

export default battlefield;

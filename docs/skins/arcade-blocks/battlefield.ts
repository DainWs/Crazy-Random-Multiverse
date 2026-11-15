// Arcade blocks battlefield: a floating platform of grass blocks in a checkerboard, over layers of dirt.
import { square, type BattlefieldSkin } from '../prototype/kit';

const OUTLINE = 0x111111;
const BLOCKS = 10;
const GRASS = [0x2ed573, 0x7bed9f];
const DIRT = 0xa0522d;
const DIRT_SIDE = 0x8b4513;
const DIRT_LAYER = 0x7a3e1d;

const battlefield: BattlefieldSkin = (c) => {
    const { h, g } = c;
    c.side('left', 90, DIRT_SIDE, [5, OUTLINE]);
    c.side('right', 90, DIRT_SIDE, [5, OUTLINE]);
    c.side('near', 90, DIRT, [5, OUTLINE]);
    const nearLeft = c.at(-h, h);
    const nearRight = c.at(h, h);
    g.lineStyle(6, DIRT_LAYER, 1);
    for (const y of [30, 60]) g.lineBetween(nearLeft.x, nearLeft.y + y, nearRight.x, nearRight.y + y);

    const step = (2 * h) / BLOCKS;
    for (let i = 0; i < BLOCKS; i++) {
        for (let j = 0; j < BLOCKS; j++) {
            c.quad(-h + i * step, -h + j * step, -h + (i + 1) * step, -h + (j + 1) * step, GRASS[(i + j) % 2]);
        }
    }

    const grid: [number, number, number, number][] = [];
    for (let k = 1; k < BLOCKS; k++) {
        const v = -h + k * step;
        grid.push([v, -h, v, h], [-h, v, h, v]);
    }
    c.lines(grid, 3, OUTLINE, 1);
    c.lines(square(h), 6, OUTLINE, 1);
};

export default battlefield;

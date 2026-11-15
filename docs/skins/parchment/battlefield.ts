// Parchment battlefield: a campaign map spread on the ground, with a compass rose, mountains and a route.
import { square, type BattlefieldSkin } from '../prototype/kit';

const INK = 0x6b4a2b;
const PAPER = 0xe4d3a6;
const AGED = 0xb89a62;
const ROUTE = 0x8b1a12;
const VIGNETTE_BANDS = 5;
const MOUNTAINS = 14;
const ROUTE_DASHES = 40;

const battlefield: BattlefieldSkin = (c) => {
    const { h } = c;
    c.side('left', 12, 0xcbb684, [2, INK]);
    c.side('right', 12, 0xcbb684, [2, INK]);
    c.side('near', 28, 0xd8c393, [2, INK]);

    c.quad(-h, -h, h, h, PAPER);
    const band = h * 0.03;
    for (let i = 0; i < VIGNETTE_BANDS; i++) {
        const o = h - i * band;
        const n = o - band;
        c.quad(-o, -o, o, -n, AGED, 0.12);
        c.quad(-o, n, o, o, AGED, 0.12);
        c.quad(-o, -n, -n, n, AGED, 0.12);
        c.quad(n, -n, o, n, AGED, 0.12);
    }

    const grid: [number, number, number, number][] = [];
    for (let k = -3; k <= 3; k++) {
        grid.push([(k * h) / 4, -h, (k * h) / 4, h], [-h, (k * h) / 4, h, (k * h) / 4]);
    }
    c.lines(grid, 2, INK, 0.22);

    for (let i = 0; i < MOUNTAINS; i++) {
        const x = (c.rnd(i) * 1.7 - 0.85) * h;
        const y = (c.rnd(i + 100) * 1.7 - 0.85) * h;
        if (Math.hypot(x, y) < h * 0.35) continue;
        const m = h * 0.035;
        c.poly([c.at(x - m, y + m * 0.6), c.at(x, y - m), c.at(x + m, y + m * 0.6)], INK, 0.35);
    }

    const route: [number, number, number, number][] = [];
    const point = (t: number): [number, number] => [(-0.8 + 1.5 * t) * h, (0.6 - 1.3 * t) * h + Math.sin(t * Math.PI * 2) * h * 0.15];
    for (let i = 0; i < ROUTE_DASHES; i += 2) {
        const [x0, y0] = point(i / ROUTE_DASHES);
        const [x1, y1] = point((i + 1) / ROUTE_DASHES);
        route.push([x0, y0, x1, y1]);
    }
    c.lines(route, 4, ROUTE, 0.5);

    c.ring(0, 0, h * 0.2, 3, INK, 0.5);
    const long = h * 0.26;
    const short = h * 0.14;
    const half = h * 0.04;
    for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
        const len = i % 2 === 0 ? long : short;
        const tip = c.at(Math.cos(a) * len, Math.sin(a) * len);
        const left = c.at(Math.cos(a - Math.PI / 2) * half, Math.sin(a - Math.PI / 2) * half);
        const right = c.at(Math.cos(a + Math.PI / 2) * half, Math.sin(a + Math.PI / 2) * half);
        const center = c.at(0, 0);
        c.poly([center, left, tip], INK, 0.55);
        c.poly([center, tip, right], 0xa07c4a, 0.55);
    }

    c.lines(square(h), 3, INK, 1);
};

export default battlefield;

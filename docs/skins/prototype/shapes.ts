// Reference only, not production code: the shapes shared by several battlefields of docs/skins/battlefields.
import { square, type FieldCtx, type Point, type Segment } from './kit';

export const NAIL = 0xc9a66b;
export const OUTLINE = 0x111111;

export function crack(c: FieldCtx, seed: number, x: number, y: number, length: number, parts: number): [number, number][] {
    const points: [number, number][] = [[x, y]];
    let a = c.rnd(seed) * Math.PI * 2;
    for (let i = 0; i < parts; i++) {
        a += (c.rnd(seed + i * 3 + 1) - 0.5) * 1.2;
        x += (Math.cos(a) * length) / parts;
        y += (Math.sin(a) * length) / parts;
        points.push([x, y]);
    }
    return points;
}

export function neonLines(c: FieldCtx, segments: Segment[], color: number, core = 2.5, strength = 1) {
    c.lines(segments, core * 6, color, 0.07 * strength);
    c.lines(segments, core * 3, color, 0.16 * strength);
    c.lines(segments, core, color, 0.95);
}

export function neonPath(c: FieldCtx, points: [number, number][], color: number, core = 2.5, closed = false) {
    c.path(points, core * 6, color, 0.07, closed);
    c.path(points, core * 3, color, 0.16, closed);
    c.path(points, core, color, 0.95, closed);
}

export function gridLines(_c: FieldCtx, x0: number, y0: number, x1: number, y1: number, step: number): Segment[] {
    const segments: Segment[] = [];
    for (let x = x0; x <= x1 + 1; x += step) segments.push([x, y0, x, y1]);
    for (let y = y0; y <= y1 + 1; y += step) segments.push([x0, y, x1, y]);
    return segments;
}

export function neonEdge(c: FieldCtx, color: number) {
    c.side('left', 30, 0x0b0820, [2, color]);
    c.side('right', 30, 0x0b0820, [2, color]);
    c.side('near', 30, 0x0b0820, [2, color]);
}

export function metalPlates(c: FieldCtx, n: number, tones: number[], seam: number, rivet?: number) {
    const { h } = c;
    c.quad(-h, -h, h, h, seam);
    const step = (2 * h) / n;
    const gap = step * 0.015;
    const size = h * 0.008;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const x = -h + i * step;
            const y = -h + j * step;
            c.quad(x + gap, y + gap, x + step - gap, y + step - gap, tones[Math.floor(c.rnd(i * 41 + j * 7) * tones.length)]);
            if (rivet === undefined) continue;
            for (const [rx, ry] of [[x + step * 0.07, y + step * 0.07], [x + step * 0.93, y + step * 0.07], [x + step * 0.07, y + step * 0.93], [x + step * 0.93, y + step * 0.93]]) {
                c.quad(rx - size, ry - size, rx + size, ry + size, rivet);
            }
        }
    }
}

export function metalDeck(c: FieldCtx, band: number, line?: number) {
    const { h, g } = c;
    c.side('left', band, 0x1a2027, [2, 0x0b0f13]);
    c.side('right', band, 0x1a2027, [2, 0x0b0f13]);
    c.side('near', band, 0x1f262e, [2, 0x0b0f13]);
    if (line === undefined) return;
    const a = c.at(-h, h);
    const b = c.at(h, h);
    g.lineStyle(4, line, 0.9);
    g.lineBetween(a.x, a.y + band / 2, b.x, b.y + band / 2);
}

/** Rows of staggered planks across the rectangle, with seams, grain and nails. */
export function woodPlanks(c: FieldCtx, x0: number, y0: number, x1: number, y1: number, rows: number, tones: number[], seam: number, seed: number, nails = true, along: 'x' | 'y' = 'x') {
    c.quad(x0, y0, x1, y1, seam);
    const span = along === 'x' ? y1 - y0 : x1 - x0;
    const row = span / rows;
    const gap = row * 0.05;
    const grain: Segment[] = [];
    let index = 0;
    for (let j = 0; j < rows; j++) {
        const start = along === 'x' ? x0 : y0;
        const end = along === 'x' ? x1 : y1;
        let t = start;
        const first = (end - start) * (0.1 + c.rnd(seed + j) * 0.25);
        while (t < end) {
            const length = t === start ? first : (end - start) * (0.2 + c.rnd(seed + index * 7) * 0.3);
            const t1 = Math.min(end, t + length);
            const r0 = (along === 'x' ? y0 : x0) + j * row;
            const tone = tones[Math.floor(c.rnd(seed + index * 3) * tones.length)];
            const rect = along === 'x' ? [t + gap, r0 + gap, t1 - gap, r0 + row - gap] : [r0 + gap, t + gap, r0 + row - gap, t1 - gap];
            c.quad(rect[0], rect[1], rect[2], rect[3], tone);
            for (const f of [0.33, 0.66]) {
                grain.push(along === 'x' ? [t + gap * 3, r0 + row * f, t1 - gap * 3, r0 + row * f] : [r0 + row * f, t + gap * 3, r0 + row * f, t1 - gap * 3]);
            }
            if (nails) {
                const size = row * 0.06;
                for (const e of [t + row * 0.3, t1 - row * 0.3]) {
                    for (const f of [0.3, 0.7]) {
                        const [nx, ny] = along === 'x' ? [e, r0 + row * f] : [r0 + row * f, e];
                        c.quad(nx - size, ny - size, nx + size, ny + size, NAIL);
                    }
                }
            }
            t = t1;
            index++;
        }
    }
    c.lines(grain, 1.5, 0x000000, 0.18);
}

export function woodEdges(c: FieldCtx, depth: number, front: number, side: number, line: number) {
    c.side('left', depth, side, [3, line]);
    c.side('right', depth, side, [3, line]);
    c.side('near', depth, front, [3, line]);
}

/** A block from height `z0` to `z1`, with a black outline. */
export function block(c: FieldCtx, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, top: number, front: number, side: number, line = 3) {
    const faces: [Point[], number][] = [];
    if (x0 > 0) faces.push([[c.at(x0, y0, z0), c.at(x0, y1, z0), c.at(x0, y1, z1), c.at(x0, y0, z1)], side]);
    if (x1 < 0) faces.push([[c.at(x1, y0, z0), c.at(x1, y1, z0), c.at(x1, y1, z1), c.at(x1, y0, z1)], side]);
    faces.push([[c.at(x0, y1, z0), c.at(x1, y1, z0), c.at(x1, y1, z1), c.at(x0, y1, z1)], front]);
    faces.push([[c.at(x0, y0, z1), c.at(x1, y0, z1), c.at(x1, y1, z1), c.at(x0, y1, z1)], top]);
    for (const [points, color] of faces) {
        c.poly(points, color);
        c.g.lineStyle(line, OUTLINE, 1);
        c.g.strokePoints(points as Phaser.Math.Vector2[], true);
    }
}

export function cube(c: FieldCtx, x: number, y: number, size: number, z0: number, top: number, front: number, side: number) {
    block(c, x - size / 2, y - size / 2, x + size / 2, y + size / 2, z0, z0 + size, top, front, side);
}

export function blockLayers(c: FieldCtx, depth: number, front: number, side: number, stripes: number[]) {
    const { h, g } = c;
    c.side('left', depth, side, [5, OUTLINE]);
    c.side('right', depth, side, [5, OUTLINE]);
    c.side('near', depth, front, [5, OUTLINE]);
    const a = c.at(-h, h);
    const b = c.at(h, h);
    stripes.forEach((color, k) => {
        g.lineStyle(8, color, 1);
        const y = (depth * (k + 1)) / (stripes.length + 1);
        g.lineBetween(a.x, a.y + y, b.x, b.y + y);
    });
}

export function checker(c: FieldCtx, n: number, color: (i: number, j: number) => number) {
    const { h } = c;
    const step = (2 * h) / n;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) c.quad(-h + i * step, -h + j * step, -h + (i + 1) * step, -h + (j + 1) * step, color(i, j));
    }
    const grid: Segment[] = [];
    for (let k = 1; k < n; k++) grid.push([-h + k * step, -h, -h + k * step, h], [-h, -h + k * step, h, -h + k * step]);
    c.lines(grid, 3, OUTLINE, 1);
    c.lines(square(h), 6, OUTLINE, 1);
}

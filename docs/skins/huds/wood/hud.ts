// Wood HUD: wooden signs with grain and nails, a warm glow under the pointer, the turn hanging from ropes.
import { fillRR, inset, lerp, lerpHex, move, strokeRR, type ButtonPiece, type Graphics, type HudSkin, type PanelPiece, type Rect } from '../../prototype/kit';

const NAIL = 0xc9a66b;
const DARK = 0x3b2410;
const PADDING = { left: 26, right: 24, top: 10, bottom: 10 };
const STROKE: [string, number] = ['#3b2410', 4];

function nails(g: Graphics, r: Rect, inside: number, radius: number) {
    g.fillStyle(NAIL, 1);
    for (const [x, y] of [[r.x + inside, r.y + inside], [r.x + r.w - inside, r.y + inside], [r.x + inside, r.y + r.h - inside], [r.x + r.w - inside, r.y + r.h - inside]]) g.fillCircle(x, y, radius);
}

function sign(band?: number): ButtonPiece {
    return {
        text: (p) => lerpHex('#f6e3bd', '#fff8e6', p),
        padding: PADDING,
        draw: ({ g, r, p, s }) => {
            strokeRR(g, inset(r, -3 * s), 8 * s, 5 * s, 0xffc966, 0.55 * p);
            fillRR(g, move(r, 0, 4 * s), 6 * s, 0x000000, 0.4);
            fillRR(g, r, 6 * s, lerp(0x7a4a26, 0x9a6236, p));
            g.fillStyle(0x5a3418, 0.55);
            for (const f of [0.3, 0.55, 0.8]) g.fillRect(r.x + 6 * s, r.y + r.h * f, r.w - 12 * s, 1.5 * s);
            if (band !== undefined) fillRR(g, { x: r.x, y: r.y, w: 10 * s, h: r.h }, 0, band);
            strokeRR(g, r, 6 * s, 3 * s, DARK);
            nails(g, r, 6 * s, 2.2 * s);
        }
    };
}

function board(planks: number, ropes: boolean): PanelPiece {
    return {
        text: '#f6e3bd',
        padding: PADDING,
        draw: (g, r, s) => {
            if (ropes) {
                g.lineStyle(2 * s, NAIL, 1);
                g.lineBetween(r.x + 20 * s, r.y, r.x + 30 * s, r.y - 30 * s);
                g.lineBetween(r.x + r.w - 20 * s, r.y, r.x + r.w - 30 * s, r.y - 30 * s);
            }
            fillRR(g, move(r, 0, 6 * s), 8 * s, 0x000000, 0.45);
            fillRR(g, r, 8 * s, 0x6e4220);
            g.fillStyle(DARK, 0.8);
            for (let i = 1; i < planks; i++) g.fillRect(r.x, r.y + (r.h * i) / planks, r.w, 2 * s);
            g.fillStyle(0x5a3418, 0.45);
            for (let y = r.y + 10 * s; y < r.y + r.h; y += 13 * s) g.fillRect(r.x + 8 * s, y, r.w - 16 * s, 1.2 * s);
            strokeRR(g, r, 8 * s, 4 * s, DARK);
            nails(g, r, 9 * s, 3 * s);
        }
    };
}

const label = { font: 'Cambria', size: 24, bold: true, stroke: STROKE };

const hud: HudSkin = {
    text: {
        title: { font: 'Cambria', size: 40, bold: true, stroke: ['#3b2410', 5] },
        body: label,
        label,
        numbers: label
    },
    accents: { ownTurn: '#ffe08a', positive: '#9ad46a', negative: '#d9534f', disabled: '#8a7a66' },
    panels: { hud: board(1, true), notice: board(4, false) },
    buttons: { primary: sign(), destructive: sign(0x9b1c1c), neutral: sign() }
};

export default hud;

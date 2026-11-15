// Wood HUD: wooden signs with grain and nails, a warm glow under the pointer, the turn hanging from ropes.
import { fillRR, inset, lerp, lerpHex, move, strokeRR, type HudSkin } from '../../prototype/kit';

const hud: HudSkin = {
    font: 'Cambria', size: 24, bold: true, padding: { left: 26, right: 24, top: 10, bottom: 10 },
    stroke: ['#3b2410', 4],
    textColor: (_k, p) => lerpHex('#f6e3bd', '#fff8e6', p),
    turnColor: (own) => (own ? '#ffe08a' : '#f6e3bd'),
    drawButton: ({ g, r, p, kind, s }) => {
        strokeRR(g, inset(r, -3 * s), 8 * s, 5 * s, 0xffc966, 0.55 * p);
        fillRR(g, move(r, 0, 4 * s), 6 * s, 0x000000, 0.4);
        fillRR(g, r, 6 * s, lerp(0x7a4a26, 0x9a6236, p));
        g.fillStyle(0x5a3418, 0.55);
        for (const f of [0.3, 0.55, 0.8]) g.fillRect(r.x + 6 * s, r.y + r.h * f, r.w - 12 * s, 1.5 * s);
        if (kind === 'danger') fillRR(g, { x: r.x, y: r.y, w: 10 * s, h: r.h }, 0, 0x9b1c1c);
        strokeRR(g, r, 6 * s, 3 * s, 0x3b2410);
        g.fillStyle(0xc9a66b, 1);
        for (const [x, y] of [[r.x + 6 * s, r.y + 6 * s], [r.x + r.w - 6 * s, r.y + 6 * s], [r.x + 6 * s, r.y + r.h - 6 * s], [r.x + r.w - 6 * s, r.y + r.h - 6 * s]]) g.fillCircle(x, y, 2.2 * s);
    },
    drawPanel: (g, r, s, mode) => {
        if (mode === 'turn') {
            g.lineStyle(2 * s, 0xc9a66b, 1);
            g.lineBetween(r.x + 20 * s, r.y, r.x + 30 * s, r.y - 30 * s);
            g.lineBetween(r.x + r.w - 20 * s, r.y, r.x + r.w - 30 * s, r.y - 30 * s);
        }
        fillRR(g, move(r, 0, 6 * s), 8 * s, 0x000000, 0.45);
        fillRR(g, r, 8 * s, 0x6e4220);
        const planks = mode === 'dialog' ? 4 : 1;
        g.fillStyle(0x3b2410, 0.8);
        for (let i = 1; i < planks; i++) g.fillRect(r.x, r.y + (r.h * i) / planks, r.w, 2 * s);
        g.fillStyle(0x5a3418, 0.45);
        for (let y = r.y + 10 * s; y < r.y + r.h; y += 13 * s) g.fillRect(r.x + 8 * s, y, r.w - 16 * s, 1.2 * s);
        strokeRR(g, r, 8 * s, 4 * s, 0x3b2410);
        g.fillStyle(0xc9a66b, 1);
        for (const [x, y] of [[r.x + 9 * s, r.y + 9 * s], [r.x + r.w - 9 * s, r.y + 9 * s], [r.x + 9 * s, r.y + r.h - 9 * s], [r.x + r.w - 9 * s, r.y + r.h - 9 * s]]) g.fillCircle(x, y, 3 * s);
    }
};

export default hud;

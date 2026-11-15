// Neon HUD: dark glass with a glowing outline that intensifies, spaced monospaced capitals.
import { byKind, fillRR, lerp, lerpHex, num, strokeRR, type HudSkin } from '../../prototype/kit';

const color = byKind('#7ff9ff', '#ff7ad9', '#c9c9ff', '#7ff9ff');

const hud: HudSkin = {
    font: 'Consolas', size: 22, upper: true, spacing: 3, padding: { left: 20, right: 20, top: 10, bottom: 10 },
    shadow: (k) => [0, 0, color(k), 10],
    textColor: (k, p) => lerpHex(color(k), '#ffffff', p),
    turnColor: (own) => (own ? '#7ff9ff' : '#b8b8d8'),
    drawButton: ({ g, r, p, kind, s }) => {
        const c = num(color(kind));
        fillRR(g, r, 3 * s, lerp(0x05060f, lerp(0x05060f, c, 0.25), p), 0.8);
        const k = 0.45 + 0.55 * p;
        for (const [w, a] of [[12, 0.06], [7, 0.12], [4, 0.25]]) strokeRR(g, r, 3 * s, w * s, c, a * k);
        strokeRR(g, r, 3 * s, 1.5 * s, lerp(c, 0xffffff, p * 0.6));
    },
    drawPanel: (g, r, s, mode, own) => {
        const c = mode === 'turn' && !own ? 0x8888bb : 0x7ff9ff;
        fillRR(g, r, 4 * s, 0x05060f, 0.88);
        g.fillStyle(0xffffff, 0.035);
        for (let y = r.y + 3 * s; y < r.y + r.h; y += 4 * s) g.fillRect(r.x, y, r.w, 1 * s);
        for (const [w, a] of [[12, 0.05], [6, 0.12]]) strokeRR(g, r, 4 * s, w * s, c, a);
        strokeRR(g, r, 4 * s, 1.5 * s, c);
    }
};

export default hud;

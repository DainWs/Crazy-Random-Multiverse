// Sci-fi HUD: slanted plates with an accent bar that sweeps across, and corner brackets.
import { byKind, cutCorners, fillPoly, lerpHex, pt, slant, strokePoly, type HudSkin } from '../prototype/kit';

const accentOf = byKind(0xffb000, 0xff3b30, 0x8aa0b4, 0xffb000);

const hud: HudSkin = {
    font: 'Bahnschrift', size: 22, upper: true, spacing: 2, padding: { left: 34, right: 24, top: 10, bottom: 10 },
    textColor: (_k, p) => lerpHex('#d6e4f5', '#ffffff', p),
    turnColor: (own) => (own ? '#ffb000' : '#d6e4f5'),
    drawButton: ({ g, r, p, kind, s }) => {
        const k = 10 * s;
        const accent = accentOf(kind);
        fillPoly(g, slant(r, k), 0x1c232b, 0.94);
        fillPoly(g, slant({ x: r.x, y: r.y, w: 6 * s + k + (r.w - 6 * s - k) * p, h: r.h }, k), accent, 0.28 * p);
        fillPoly(g, slant({ x: r.x, y: r.y, w: 6 * s + k, h: r.h }, k), accent);
        strokePoly(g, slant(r, k), 1 * s, accent, 0.35 + 0.5 * p);
        const b = 8 * s;
        strokePoly(g, [pt(r.x + r.w - b - 2 * s, r.y - 4 * s), pt(r.x + r.w + 2 * s, r.y - 4 * s), pt(r.x + r.w + 2 * s, r.y + b - 4 * s)], 2 * s, accent, p, false);
    },
    drawPanel: (g, r, s, mode, own) => {
        const accent = mode === 'turn' && !own ? 0x8aa0b4 : 0xffb000;
        fillPoly(g, cutCorners(r, 14 * s), 0x141a20, 0.94);
        strokePoly(g, cutCorners(r, 14 * s), 1 * s, accent, 0.5);
        g.fillStyle(accent, 1);
        g.fillRect(r.x + 18 * s, r.y - 2 * s, Math.min(120 * s, r.w * 0.4), 4 * s);
        const b = 12 * s;
        strokePoly(g, [pt(r.x + r.w - b, r.y + r.h + 4 * s), pt(r.x + r.w + 4 * s, r.y + r.h + 4 * s), pt(r.x + r.w + 4 * s, r.y + r.h - b)], 2 * s, accent, 1, false);
    }
};

export default hud;

// Parchment HUD: aged paper notes with a ribbon, that rise from the table under the pointer.
import { byKind, fillPoly, fillRR, inset, lerp, move, pt, strokeRR, type HudSkin } from '../../prototype/kit';

const ribbon = byKind(0x3b2a1a, 0x8b1a12, 0x6b4a2b, 0x3b2a1a);

const hud: HudSkin = {
    font: 'Palatino Linotype', size: 25, bold: true, padding: { left: 30, right: 22, top: 10, bottom: 12 }, lift: 3,
    textColor: (k) => (k === 'danger' ? '#7a1a12' : '#3b2a1a'),
    turnColor: (own) => (own ? '#1e5b2a' : '#3b2a1a'),
    drawButton: ({ g, r, base, p, kind, s }) => {
        fillRR(g, move(base, (2 + 3 * p) * s, (3 + 4 * p) * s), 3 * s, 0x1a1008, 0.35 + 0.1 * p);
        fillRR(g, r, 3 * s, lerp(0xe6d6ab, 0xf4e9c9, p));
        strokeRR(g, inset(r, 3 * s), 2 * s, 1 * s, 0x8a6a3b, 0.35);
        strokeRR(g, r, 3 * s, 2 * s, 0x6b4a2b);
        fillPoly(g, [pt(r.x + 8 * s, r.y), pt(r.x + 16 * s, r.y), pt(r.x + 16 * s, r.y + r.h + 6 * s), pt(r.x + 12 * s, r.y + r.h + 2 * s), pt(r.x + 8 * s, r.y + r.h + 6 * s)], ribbon(kind));
    },
    drawPanel: (g, r, s, mode) => {
        fillRR(g, move(r, 4 * s, 6 * s), 4 * s, 0x1a1008, 0.4);
        fillRR(g, r, 4 * s, 0xe9dcb5);
        strokeRR(g, inset(r, 5 * s), 2 * s, 1 * s, 0x8a6a3b, 0.4);
        strokeRR(g, r, 4 * s, 2 * s, 0x6b4a2b);
        if (mode === 'dialog') {
            g.fillStyle(0x6b4a2b, 1);
            for (const [x, y] of [[r.x, r.y], [r.x + r.w, r.y], [r.x, r.y + r.h], [r.x + r.w, r.y + r.h]]) g.fillCircle(x, y, 6 * s);
        }
    }
};

export default hud;

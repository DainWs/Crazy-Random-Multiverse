// Fantasy HUD: chamfered dark plates, a double gold border that lights up, serif type.
import { byKind, chamfer, fillPoly, inset, lerp, lerpHex, move, strokePoly, type HudSkin } from '../prototype/kit';

const fill = byKind(0x1d2a4a, 0x4a1414, 0x2b2b30, 0x16161e);

const hud: HudSkin = {
    font: 'Georgia', size: 24, padding: { left: 22, right: 22, top: 10, bottom: 10 },
    stroke: ['#000000', 3],
    textColor: (_k, p) => lerpHex('#e8c872', '#fff6d8', p),
    turnColor: (own) => (own ? '#f5d77a' : '#d9d2c0'),
    drawButton: ({ g, r, p, kind, s }) => {
        const c = 9 * s;
        fillPoly(g, chamfer(move(r, 0, 3 * s), c), 0x000000, 0.45);
        fillPoly(g, chamfer(r, c), lerp(fill(kind), 0x3a4a70, kind === 'danger' ? 0 : p * 0.5), 0.96);
        if (kind === 'danger') fillPoly(g, chamfer(r, c), 0x7a1f1f, 0.6 * p);
        strokePoly(g, chamfer(r, c), 2 * s, lerp(0x9c7a26, 0xf5d77a, p));
        strokePoly(g, chamfer(inset(r, 4 * s), c * 0.6), 1 * s, 0xd4af37, 0.3 + 0.6 * p);
    },
    drawPanel: (g, r, s) => {
        const c = 16 * s;
        fillPoly(g, chamfer(move(r, 0, 5 * s), c), 0x000000, 0.5);
        fillPoly(g, chamfer(r, c), 0x14141c, 0.95);
        strokePoly(g, chamfer(r, c), 2.5 * s, 0xd4af37);
        strokePoly(g, chamfer(inset(r, 6 * s), c * 0.6), 1 * s, 0xd4af37, 0.5);
    }
};

export default hud;

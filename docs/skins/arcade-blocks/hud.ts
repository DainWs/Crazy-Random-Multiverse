// Arcade blocks HUD: blocks with depth and a black outline, whose top face rises.
import { byKind, fillRR, inset, lerp, move, type HudSkin } from '../prototype/kit';

const face = byKind(0x2ecc71, 0xff4757, 0x70a1ff, 0xffa502);
const depth = byKind(0x1e8449, 0xa4161f, 0x3b5bdb, 0xb36b00);

const hud: HudSkin = {
    font: 'Arial Black', size: 21, upper: true, padding: { left: 22, right: 22, top: 9, bottom: 11 }, lift: 3,
    stroke: ['#111111', 5],
    textColor: () => '#ffffff',
    turnColor: (own) => (own ? '#ffffff' : '#dfe4ea'),
    drawButton: ({ g, r, base, p, kind, s }) => {
        const d = 6 * s;
        const rad = 8 * s;
        const bottom = { x: base.x, y: r.y + d, w: base.w, h: base.y + base.h - r.y };
        fillRR(g, inset(bottom, -3 * s), rad, 0x111111);
        fillRR(g, bottom, rad, depth(kind));
        fillRR(g, inset(r, -3 * s), rad, 0x111111);
        fillRR(g, r, rad, lerp(face(kind), 0xffffff, 0.12 * p));
        fillRR(g, { x: r.x + 6 * s, y: r.y + 4 * s, w: r.w - 12 * s, h: r.h * 0.28 }, 4 * s, 0xffffff, 0.3);
    },
    drawPanel: (g, r, s, mode, own) => {
        const color = mode === 'turn' ? (own ? 0xffa502 : 0x57606f) : 0x2f3542;
        fillRR(g, inset(move(r, 0, 8 * s), -4 * s), 10 * s, 0x111111);
        fillRR(g, inset(r, -4 * s), 10 * s, 0x111111);
        fillRR(g, r, 10 * s, color);
        fillRR(g, { x: r.x + 8 * s, y: r.y + 5 * s, w: r.w - 16 * s, h: Math.min(r.h * 0.25, 20 * s) }, 5 * s, 0xffffff, 0.18);
    }
};

export default hud;

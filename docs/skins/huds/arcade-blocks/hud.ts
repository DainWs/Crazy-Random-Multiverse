// Arcade blocks HUD: blocks with depth and a black outline, whose top face rises.
import { fillRR, inset, lerp, move, type ButtonPiece, type HudSkin, type PanelPiece } from '../../prototype/kit';

const OUTLINE = 0x111111;
const STROKE: [string, number] = ['#111111', 5];

function block(face: number, depth: number): ButtonPiece {
    return {
        text: () => '#ffffff',
        padding: { left: 22, right: 22, top: 9, bottom: 11 },
        lift: 3,
        draw: ({ g, r, base, p, s }) => {
            const d = 6 * s;
            const rad = 8 * s;
            const bottom = { x: base.x, y: r.y + d, w: base.w, h: base.y + base.h - r.y };
            fillRR(g, inset(bottom, -3 * s), rad, OUTLINE);
            fillRR(g, bottom, rad, depth);
            fillRR(g, inset(r, -3 * s), rad, OUTLINE);
            fillRR(g, r, rad, lerp(face, 0xffffff, 0.12 * p));
            fillRR(g, { x: r.x + 6 * s, y: r.y + 4 * s, w: r.w - 12 * s, h: r.h * 0.28 }, 4 * s, 0xffffff, 0.3);
        }
    };
}

function panel(normal: number, highlight: number): PanelPiece {
    return {
        text: '#dfe4ea',
        padding: { left: 22, right: 22, top: 9, bottom: 11 },
        draw: (g, r, s, tone) => {
            fillRR(g, inset(move(r, 0, 8 * s), -4 * s), 10 * s, OUTLINE);
            fillRR(g, inset(r, -4 * s), 10 * s, OUTLINE);
            fillRR(g, r, 10 * s, tone === 'highlight' ? highlight : normal);
            fillRR(g, { x: r.x + 8 * s, y: r.y + 5 * s, w: r.w - 16 * s, h: Math.min(r.h * 0.25, 20 * s) }, 5 * s, 0xffffff, 0.18);
        }
    };
}

const label = { font: 'Arial Black', size: 21, upper: true, stroke: STROKE };

const hud: HudSkin = {
    text: {
        title: { font: 'Arial Black', size: 40, upper: true, stroke: ['#111111', 6] },
        body: label,
        label,
        numbers: { font: 'Arial Black', size: 22, stroke: STROKE }
    },
    accents: { ownTurn: '#ffffff', positive: '#2ecc71', negative: '#ff4757', disabled: '#747d8c' },
    panels: { hud: panel(0x57606f, 0xffa502), notice: panel(0x2f3542, 0xffa502) },
    buttons: {
        primary: block(0x2ecc71, 0x1e8449),
        destructive: block(0xff4757, 0xa4161f),
        neutral: block(0x70a1ff, 0x3b5bdb)
    }
};

export default hud;

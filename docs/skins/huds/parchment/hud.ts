// Parchment HUD: aged paper notes with a ribbon, that rise from the table under the pointer.
import { fillPoly, fillRR, inset, lerp, move, pt, strokeRR, type ButtonPiece, type Graphics, type HudSkin, type PanelPiece, type Rect } from '../../prototype/kit';

const INK = '#3b2a1a';
const PADDING = { left: 30, right: 22, top: 10, bottom: 12 };

function note(text: string, ribbon: number): ButtonPiece {
    return {
        text: () => text,
        padding: PADDING,
        lift: 3,
        draw: ({ g, r, base, p, s }) => {
            fillRR(g, move(base, (2 + 3 * p) * s, (3 + 4 * p) * s), 3 * s, 0x1a1008, 0.35 + 0.1 * p);
            fillRR(g, r, 3 * s, lerp(0xe6d6ab, 0xf4e9c9, p));
            strokeRR(g, inset(r, 3 * s), 2 * s, 1 * s, 0x8a6a3b, 0.35);
            strokeRR(g, r, 3 * s, 2 * s, 0x6b4a2b);
            fillPoly(g, [pt(r.x + 8 * s, r.y), pt(r.x + 16 * s, r.y), pt(r.x + 16 * s, r.y + r.h + 6 * s), pt(r.x + 12 * s, r.y + r.h + 2 * s), pt(r.x + 8 * s, r.y + r.h + 6 * s)], ribbon);
        }
    };
}

function paper(g: Graphics, r: Rect, s: number) {
    fillRR(g, move(r, 4 * s, 6 * s), 4 * s, 0x1a1008, 0.4);
    fillRR(g, r, 4 * s, 0xe9dcb5);
    strokeRR(g, inset(r, 5 * s), 2 * s, 1 * s, 0x8a6a3b, 0.4);
    strokeRR(g, r, 4 * s, 2 * s, 0x6b4a2b);
}

const hudPanel: PanelPiece = { text: INK, padding: PADDING, draw: (g, r, s) => paper(g, r, s) };

const noticePanel: PanelPiece = {
    text: INK,
    padding: PADDING,
    draw: (g, r, s) => {
        paper(g, r, s);
        g.fillStyle(0x6b4a2b, 1);
        for (const [x, y] of [[r.x, r.y], [r.x + r.w, r.y], [r.x, r.y + r.h], [r.x + r.w, r.y + r.h]]) g.fillCircle(x, y, 6 * s);
    }
};

const hud: HudSkin = {
    text: {
        title: { font: 'Palatino Linotype', size: 40, bold: true },
        body: { font: 'Palatino Linotype', size: 25, bold: true },
        label: { font: 'Palatino Linotype', size: 25, bold: true },
        numbers: { font: 'Palatino Linotype', size: 25, bold: true }
    },
    accents: { ownTurn: '#1e5b2a', positive: '#2e6b2a', negative: '#8b1a12', disabled: '#8a7a60' },
    panels: { hud: hudPanel, notice: noticePanel },
    buttons: {
        primary: note(INK, 0x3b2a1a),
        destructive: note('#7a1a12', 0x8b1a12),
        neutral: note(INK, 0x6b4a2b)
    }
};

export default hud;

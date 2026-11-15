// Neon HUD: dark glass with a glowing outline that intensifies, spaced monospaced capitals.
import { fillRR, lerp, lerpHex, num, strokeRR, type ButtonPiece, type HudSkin, type PanelPiece } from '../../prototype/kit';

const CYAN = '#7ff9ff';
const PADDING = { left: 20, right: 20, top: 10, bottom: 10 };

function glass(color: string): ButtonPiece {
    const c = num(color);
    return {
        text: (p) => lerpHex(color, '#ffffff', p),
        glow: color,
        padding: PADDING,
        draw: ({ g, r, p, s }) => {
            fillRR(g, r, 3 * s, lerp(0x05060f, lerp(0x05060f, c, 0.25), p), 0.8);
            const k = 0.45 + 0.55 * p;
            for (const [w, a] of [[12, 0.06], [7, 0.12], [4, 0.25]]) strokeRR(g, r, 3 * s, w * s, c, a * k);
            strokeRR(g, r, 3 * s, 1.5 * s, lerp(c, 0xffffff, p * 0.6));
        }
    };
}

function panel(text: string, normal: number): PanelPiece {
    return {
        text,
        glow: CYAN,
        padding: PADDING,
        draw: (g, r, s, tone) => {
            const c = tone === 'highlight' ? num(CYAN) : normal;
            fillRR(g, r, 4 * s, 0x05060f, 0.88);
            g.fillStyle(0xffffff, 0.035);
            for (let y = r.y + 3 * s; y < r.y + r.h; y += 4 * s) g.fillRect(r.x, y, r.w, 1 * s);
            for (const [w, a] of [[12, 0.05], [6, 0.12]]) strokeRR(g, r, 4 * s, w * s, c, a);
            strokeRR(g, r, 4 * s, 1.5 * s, c);
        }
    };
}

const label = { font: 'Consolas', size: 22, upper: true, spacing: 3 };

const hud: HudSkin = {
    text: {
        title: { font: 'Consolas', size: 40, upper: true, spacing: 4 },
        body: label,
        label,
        numbers: { font: 'Consolas', size: 22 }
    },
    accents: { ownTurn: CYAN, positive: '#7aff9a', negative: '#ff5a7a', disabled: '#5a5a7a' },
    panels: { hud: panel('#b8b8d8', 0x8888bb), notice: panel('#b8b8d8', num(CYAN)) },
    buttons: { primary: glass(CYAN), destructive: glass('#ff7ad9'), neutral: glass('#c9c9ff') }
};

export default hud;

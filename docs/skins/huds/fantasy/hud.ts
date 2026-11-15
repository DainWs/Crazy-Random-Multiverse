// Fantasy HUD: chamfered dark plates, a double gold border that lights up, serif type.
import { chamfer, fillPoly, inset, lerp, lerpHex, move, strokePoly, type ButtonPiece, type HudSkin, type PanelPiece } from '../../prototype/kit';

const GOLD = 0xd4af37;
const PADDING = { left: 22, right: 22, top: 10, bottom: 10 };
const STROKE: [string, number] = ['#000000', 3];

function plate(fill: number, hover: (p: number) => [number, number, number]): ButtonPiece {
    return {
        text: (p) => lerpHex('#e8c872', '#fff6d8', p),
        padding: PADDING,
        draw: ({ g, r, p, s }) => {
            const c = 9 * s;
            const [tint, alpha, amount] = hover(p);
            fillPoly(g, chamfer(move(r, 0, 3 * s), c), 0x000000, 0.45);
            fillPoly(g, chamfer(r, c), lerp(fill, tint, amount), 0.96);
            fillPoly(g, chamfer(r, c), tint, alpha);
            strokePoly(g, chamfer(r, c), 2 * s, lerp(0x9c7a26, 0xf5d77a, p));
            strokePoly(g, chamfer(inset(r, 4 * s), c * 0.6), 1 * s, GOLD, 0.3 + 0.6 * p);
        }
    };
}

const panel: PanelPiece = {
    text: '#d9d2c0',
    padding: PADDING,
    draw: (g, r, s) => {
        const c = 16 * s;
        fillPoly(g, chamfer(move(r, 0, 5 * s), c), 0x000000, 0.5);
        fillPoly(g, chamfer(r, c), 0x14141c, 0.95);
        strokePoly(g, chamfer(r, c), 2.5 * s, GOLD);
        strokePoly(g, chamfer(inset(r, 6 * s), c * 0.6), 1 * s, GOLD, 0.5);
    }
};

const hud: HudSkin = {
    text: {
        title: { font: 'Georgia', size: 40, bold: true, stroke: ['#000000', 4] },
        body: { font: 'Georgia', size: 24, stroke: STROKE },
        label: { font: 'Georgia', size: 24, stroke: STROKE },
        numbers: { font: 'Georgia', size: 24, bold: true, stroke: STROKE }
    },
    accents: { ownTurn: '#f5d77a', positive: '#8fce5a', negative: '#e05a4a', disabled: '#7a7468' },
    panels: { hud: panel, notice: panel },
    buttons: {
        primary: plate(0x1d2a4a, (p) => [0x3a4a70, 0, p * 0.5]),
        destructive: plate(0x4a1414, (p) => [0x7a1f1f, 0.6 * p, 0]),
        neutral: plate(0x2b2b30, (p) => [0x3a4a70, 0, p * 0.5])
    }
};

export default hud;

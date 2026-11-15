// Reference only, not production code: the HUD skins of docs/skins, as recorded on 2026-11-15.
// Copy it to frontend/src/game/hud/ and apply GameHudView.patch; window.__hudVariant picks the skin by its folder name.
import Phaser from 'phaser';
import { getText } from '@/core/Texts';
import StoreSystem from '@/core/StoreSystem';

type Kind = 'primary' | 'danger' | 'neutral' | 'label';
type Icon = 'skip' | 'flag' | 'clock' | null;
interface Rect { x: number; y: number; w: number; h: number }
interface Ctx { g: Phaser.GameObjects.Graphics; r: Rect; base: Rect; p: number; kind: Kind; s: number; icon: Icon }
type PanelMode = 'dialog' | 'turn';
interface Padding { left: number; right: number; top: number; bottom: number }

interface Variant {
    font: string;
    size: number;
    bold?: boolean;
    upper?: boolean;
    spacing?: number;
    padding: Padding;
    iconPadding?: number;
    stroke?: [string, number];
    shadow?: (kind: Kind) => [number, number, string, number];
    lift?: number;
    textColor: (kind: Kind, p: number) => string;
    turnColor: (own: boolean) => string;
    drawButton: (c: Ctx) => void;
    drawPanel: (g: Phaser.GameObjects.Graphics, r: Rect, s: number, mode: PanelMode, own: boolean) => void;
    turnIcon?: boolean;
}

// ---------- helpers ----------

const hex = (n: number) => '#' + n.toString(16).padStart(6, '0');
const num = (h: string) => parseInt(h.slice(1), 16);
function lerp(a: number, b: number, t: number): number {
    const ch = (c: number, sh: number) => (c >> sh) & 0xff;
    const mix = (sh: number) => Math.round(ch(a, sh) + (ch(b, sh) - ch(a, sh)) * t) << sh;
    return mix(16) | mix(8) | mix(0);
}
const lerpHex = (a: string, b: string, t: number) => hex(lerp(num(a), num(b), t));
const inset = (r: Rect, d: number): Rect => ({ x: r.x + d, y: r.y + d, w: r.w - 2 * d, h: r.h - 2 * d });
const move = (r: Rect, dx: number, dy: number): Rect => ({ x: r.x + dx, y: r.y + dy, w: r.w, h: r.h });
const pt = (x: number, y: number) => ({ x, y });

function fillRR(g: Phaser.GameObjects.Graphics, r: Rect, rad: number, color: number, alpha = 1) {
    g.fillStyle(color, alpha);
    if (rad > 0) g.fillRoundedRect(r.x, r.y, r.w, r.h, Math.min(rad, r.h / 2, r.w / 2));
    else g.fillRect(r.x, r.y, r.w, r.h);
}
function strokeRR(g: Phaser.GameObjects.Graphics, r: Rect, rad: number, width: number, color: number, alpha = 1) {
    g.lineStyle(width, color, alpha);
    if (rad > 0) g.strokeRoundedRect(r.x, r.y, r.w, r.h, Math.min(rad, r.h / 2, r.w / 2));
    else g.strokeRect(r.x, r.y, r.w, r.h);
}
function fillPoly(g: Phaser.GameObjects.Graphics, pts: { x: number; y: number }[], color: number, alpha = 1) {
    g.fillStyle(color, alpha);
    g.fillPoints(pts as Phaser.Math.Vector2[], true);
}
function strokePoly(g: Phaser.GameObjects.Graphics, pts: { x: number; y: number }[], width: number, color: number, alpha = 1) {
    g.lineStyle(width, color, alpha);
    g.strokePoints(pts as Phaser.Math.Vector2[], true);
}
function chamfer(r: Rect, c: number) {
    return [
        pt(r.x + c, r.y), pt(r.x + r.w - c, r.y), pt(r.x + r.w, r.y + c), pt(r.x + r.w, r.y + r.h - c),
        pt(r.x + r.w - c, r.y + r.h), pt(r.x + c, r.y + r.h), pt(r.x, r.y + r.h - c), pt(r.x, r.y + c)
    ];
}
function cutCorners(r: Rect, c: number) {
    return [pt(r.x + c, r.y), pt(r.x + r.w, r.y), pt(r.x + r.w, r.y + r.h - c), pt(r.x + r.w - c, r.y + r.h), pt(r.x, r.y + r.h), pt(r.x, r.y + c)];
}
function slant(r: Rect, k: number) {
    return [pt(r.x + k, r.y), pt(r.x + r.w, r.y), pt(r.x + r.w - k, r.y + r.h), pt(r.x, r.y + r.h)];
}
// ---------- variants ----------

const KIND = <T,>(primary: T, danger: T, neutral: T, label: T) => (k: Kind) => ({ primary, danger, neutral, label })[k];

const fantasyFill = KIND(0x1d2a4a, 0x4a1414, 0x2b2b30, 0x16161e);
const parchmentRibbon = KIND(0x3b2a1a, 0x8b1a12, 0x6b4a2b, 0x3b2a1a);
const neonColor = KIND('#7ff9ff', '#ff7ad9', '#c9c9ff', '#7ff9ff');
const scifiAccent = KIND(0xffb000, 0xff3b30, 0x8aa0b4, 0xffb000);
const blockFill = KIND(0x2ecc71, 0xff4757, 0x70a1ff, 0xffa502);
const blockDepth = KIND(0x1e8449, 0xa4161f, 0x3b5bdb, 0xb36b00);

const VARIANTS: Record<string, Variant> = {
    // 1. Fantasy plate: chamfered dark plate, double gold border that lights up
    fantasy: {
        font: 'Georgia', size: 24, padding: { left: 22, right: 22, top: 10, bottom: 10 },
        stroke: ['#000000', 3],
        textColor: (_k, p) => lerpHex('#e8c872', '#fff6d8', p),
        turnColor: (own) => (own ? '#f5d77a' : '#d9d2c0'),
        drawButton: ({ g, r, p, kind, s }) => {
            const c = 9 * s;
            fillPoly(g, chamfer(move(r, 0, 3 * s), c), 0x000000, 0.45);
            fillPoly(g, chamfer(r, c), lerp(fantasyFill(kind), 0x3a4a70, kind === 'danger' ? 0 : p * 0.5), 0.96);
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
    },
    // 2. Parchment: aged paper notes that lift from the table, with a ribbon
    parchment: {
        font: 'Palatino Linotype', size: 25, bold: true, padding: { left: 30, right: 22, top: 10, bottom: 12 }, lift: 3,
        textColor: (k) => (k === 'danger' ? '#7a1a12' : '#3b2a1a'),
        turnColor: (own) => (own ? '#1e5b2a' : '#3b2a1a'),
        drawButton: ({ g, r, base, p, kind, s }) => {
            fillRR(g, move(base, (2 + 3 * p) * s, (3 + 4 * p) * s), 3 * s, 0x1a1008, 0.35 + 0.1 * p);
            fillRR(g, r, 3 * s, lerp(0xe6d6ab, 0xf4e9c9, p));
            strokeRR(g, inset(r, 3 * s), 2 * s, 1 * s, 0x8a6a3b, 0.35);
            strokeRR(g, r, 3 * s, 2 * s, 0x6b4a2b);
            fillPoly(g, [pt(r.x + 8 * s, r.y), pt(r.x + 16 * s, r.y), pt(r.x + 16 * s, r.y + r.h + 6 * s), pt(r.x + 12 * s, r.y + r.h + 2 * s), pt(r.x + 8 * s, r.y + r.h + 6 * s)], parchmentRibbon(kind));
        },
        drawPanel: (g, r, s, mode) => {
            fillRR(g, move(r, 4 * s, 6 * s), 4 * s, 0x1a1008, 0.4);
            fillRR(g, r, 4 * s, 0xe9dcb5);
            strokeRR(g, inset(r, 5 * s), 2 * s, 1 * s, 0x8a6a3b, 0.4);
            strokeRR(g, r, 4 * s, 2 * s, 0x6b4a2b);
            if (mode === 'dialog') for (const [x, y] of [[r.x, r.y], [r.x + r.w, r.y], [r.x, r.y + r.h], [r.x + r.w, r.y + r.h]]) {
                g.fillStyle(0x6b4a2b, 1);
                g.fillCircle(x, y, 6 * s);
            }
        }
    },
    // 3. Neon: dark glass with a glowing outline that intensifies
    neon: {
        font: 'Consolas', size: 22, upper: true, spacing: 3, padding: { left: 20, right: 20, top: 10, bottom: 10 },
        shadow: (k) => [0, 0, neonColor(k), 10],
        textColor: (k, p) => lerpHex(neonColor(k), '#ffffff', p),
        turnColor: (own) => (own ? '#7ff9ff' : '#b8b8d8'),
        drawButton: ({ g, r, p, kind, s }) => {
            const color = num(neonColor(kind));
            fillRR(g, r, 3 * s, lerp(0x05060f, lerp(0x05060f, color, 0.25), p), 0.8);
            const k = 0.45 + 0.55 * p;
            for (const [w, a] of [[12, 0.06], [7, 0.12], [4, 0.25]]) strokeRR(g, r, 3 * s, w * s, color, a * k);
            strokeRR(g, r, 3 * s, 1.5 * s, lerp(color, 0xffffff, p * 0.6));
        },
        drawPanel: (g, r, s, mode, own) => {
            const color = mode === 'turn' && !own ? 0x8888bb : 0x7ff9ff;
            fillRR(g, r, 4 * s, 0x05060f, 0.88);
            for (let y = r.y + 3 * s; y < r.y + r.h; y += 4 * s) { g.fillStyle(0xffffff, 0.035); g.fillRect(r.x, y, r.w, 1 * s); }
            for (const [w, a] of [[12, 0.05], [6, 0.12]]) strokeRR(g, r, 4 * s, w * s, color, a);
            strokeRR(g, r, 4 * s, 1.5 * s, color);
        }
    },
    // 4. Sci-fi: slanted plates with an accent bar that sweeps across, corner brackets
    'sci-fi': {
        font: 'Bahnschrift', size: 22, upper: true, spacing: 2, padding: { left: 34, right: 24, top: 10, bottom: 10 },
        textColor: (_k, p) => lerpHex('#d6e4f5', '#ffffff', p),
        turnColor: (own) => (own ? '#ffb000' : '#d6e4f5'),
        drawButton: ({ g, r, p, kind, s }) => {
            const k = 10 * s;
            const accent = scifiAccent(kind);
            fillPoly(g, slant(r, k), 0x1c232b, 0.94);
            fillPoly(g, slant({ x: r.x, y: r.y, w: 6 * s + k + (r.w - 6 * s - k) * p, h: r.h }, k), accent, 0.28 * p);
            fillPoly(g, slant({ x: r.x, y: r.y, w: 6 * s + k, h: r.h }, k), accent);
            strokePoly(g, slant(r, k), 1 * s, accent, 0.35 + 0.5 * p);
            const b = 8 * s;
            g.lineStyle(2 * s, accent, p);
            g.strokePoints([pt(r.x + r.w - b - 2 * s, r.y - 4 * s), pt(r.x + r.w + 2 * s, r.y - 4 * s), pt(r.x + r.w + 2 * s, r.y + b - 4 * s)] as Phaser.Math.Vector2[]);
        },
        drawPanel: (g, r, s, mode, own) => {
            const accent = mode === 'turn' && !own ? 0x8aa0b4 : 0xffb000;
            fillPoly(g, cutCorners(r, 14 * s), 0x141a20, 0.94);
            strokePoly(g, cutCorners(r, 14 * s), 1 * s, accent, 0.5);
            g.fillStyle(accent, 1);
            g.fillRect(r.x + 18 * s, r.y - 2 * s, Math.min(120 * s, r.w * 0.4), 4 * s);
            const b = 12 * s;
            g.lineStyle(2 * s, accent, 1);
            g.strokePoints([pt(r.x + r.w - b, r.y + r.h + 4 * s), pt(r.x + r.w + 4 * s, r.y + r.h + 4 * s), pt(r.x + r.w + 4 * s, r.y + r.h - b)] as Phaser.Math.Vector2[]);
        }
    },
    // 5. Chunky 3D: arcade blocks with depth whose top face rises
    'arcade-blocks': {
        font: 'Arial Black', size: 21, upper: true, padding: { left: 22, right: 22, top: 9, bottom: 11 }, lift: 3,
        stroke: ['#111111', 5],
        textColor: () => '#ffffff',
        turnColor: (own) => (own ? '#ffffff' : '#dfe4ea'),
        drawButton: ({ g, r, base, p, kind, s }) => {
            const d = 6 * s;
            const rad = 8 * s;
            const bottom = { x: base.x, y: r.y + d, w: base.w, h: base.y + base.h - r.y };
            fillRR(g, inset(bottom, -3 * s), rad, 0x111111);
            fillRR(g, bottom, rad, blockDepth(kind));
            fillRR(g, inset(r, -3 * s), rad, 0x111111);
            fillRR(g, r, rad, lerp(blockFill(kind), 0xffffff, 0.12 * p));
            fillRR(g, { x: r.x + 6 * s, y: r.y + 4 * s, w: r.w - 12 * s, h: r.h * 0.28 }, 4 * s, 0xffffff, 0.3);
        },
        drawPanel: (g, r, s, mode, own) => {
            const color = mode === 'turn' ? (own ? 0xffa502 : 0x57606f) : 0x2f3542;
            fillRR(g, inset(move(r, 0, 8 * s), -4 * s), 10 * s, 0x111111);
            fillRR(g, inset(r, -4 * s), 10 * s, 0x111111);
            fillRR(g, r, 10 * s, color);
            fillRR(g, { x: r.x + 8 * s, y: r.y + 5 * s, w: r.w - 16 * s, h: Math.min(r.h * 0.25, 20 * s) }, 5 * s, 0xffffff, 0.18);
        }
    },
    // 6. Wooden signs: planks with grain and nails, a warm glow under the pointer
    wood: {
        font: 'Cambria', size: 24, bold: true, padding: { left: 26, right: 24, top: 10, bottom: 10 },
        stroke: ['#3b2410', 4],
        textColor: (_k, p) => lerpHex('#f6e3bd', '#fff8e6', p),
        turnColor: (own) => (own ? '#ffe08a' : '#f6e3bd'),
        drawButton: ({ g, r, p, kind, s }) => {
            strokeRR(g, inset(r, -3 * s), 8 * s, 5 * s, 0xffc966, 0.55 * p);
            fillRR(g, move(r, 0, 4 * s), 6 * s, 0x000000, 0.4);
            fillRR(g, r, 6 * s, lerp(0x7a4a26, 0x9a6236, p));
            for (const f of [0.3, 0.55, 0.8]) { g.fillStyle(0x5a3418, 0.55); g.fillRect(r.x + 6 * s, r.y + r.h * f, r.w - 12 * s, 1.5 * s); }
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
            for (let i = 1; i < planks; i++) { g.fillStyle(0x3b2410, 0.8); g.fillRect(r.x, r.y + (r.h * i) / planks, r.w, 2 * s); }
            for (let y = r.y + 10 * s; y < r.y + r.h; y += 13 * s) { g.fillStyle(0x5a3418, 0.45); g.fillRect(r.x + 8 * s, y, r.w - 16 * s, 1.2 * s); }
            strokeRR(g, r, 8 * s, 4 * s, 0x3b2410);
            g.fillStyle(0xc9a66b, 1);
            for (const [x, y] of [[r.x + 9 * s, r.y + 9 * s], [r.x + r.w - 9 * s, r.y + 9 * s], [r.x + 9 * s, r.y + r.h - 9 * s], [r.x + r.w - 9 * s, r.y + r.h - 9 * s]]) g.fillCircle(x, y, 3 * s);
        }
    }
};

// ---------- wiring ----------

function variant(): Variant | undefined {
    const name = (window as unknown as { __hudVariant?: string }).__hudVariant;
    return name ? VARIANTS[name] : undefined;
}

export function active(): boolean {
    return variant() !== undefined;
}

function kindOf(label: string): Kind {
    if (label === getText('ui.game.end_turn')) return 'primary';
    if (label === getText('ui.game.surrender') || label === getText('ui.game.confirm_yes') || label === getText('ui.game.leave')) return 'danger';
    return 'neutral';
}

function iconOf(label: string): Icon {
    if (label === getText('ui.game.end_turn')) return 'skip';
    if (label === getText('ui.game.surrender')) return 'flag';
    return null;
}

function targetName(label: string): string {
    if (label === getText('ui.game.end_turn')) return 'pass';
    if (label === getText('ui.game.surrender')) return 'surrender';
    if (label === getText('ui.game.confirm_yes')) return 'yes';
    if (label === getText('ui.game.confirm_no')) return 'no';
    return label;
}

function styleText(text: Phaser.GameObjects.Text, v: Variant, kind: Kind, extraLeft = 0) {
    text.setBackgroundColor('transparent');
    text.setFontFamily(v.font);
    text.setFontSize(v.size);
    text.setFontStyle(v.bold ? 'bold' : '');
    text.setPadding({ ...v.padding, left: v.padding.left + extraLeft });
    if (v.stroke) text.setStroke(v.stroke[0], v.stroke[1]);
    if (v.shadow) {
        const [x, y, color, blur] = v.shadow(kind);
        text.setShadow(x, y, color, blur, false, true);
    }
    (text as unknown as { setLetterSpacing?: (n: number) => void }).setLetterSpacing?.(v.spacing ?? 0);
}

function rectOf(text: Phaser.GameObjects.Text, originY: number): Rect {
    const w = text.width * text.scaleX;
    const h = text.height * text.scaleY;
    return { x: text.x - text.originX * w, y: text.y - originY * h, w, h };
}

function follow(scene: Phaser.Scene, text: Phaser.GameObjects.Text, g: Phaser.GameObjects.Graphics, frame: () => void) {
    const onFrame = () => {
        if (!text.active) return;
        const parent = text.parentContainer;
        if (parent && g.parentContainer !== parent) parent.addAt(g, parent.getIndex(text));
        if (!parent) g.setScrollFactor(0).setDepth(text.depth - 0.5);
        g.clear();
        g.setVisible(text.visible);
        g.setAlpha(text.alpha);
        frame();
    };
    scene.events.on('postupdate', onFrame);
    text.once('destroy', () => {
        scene.events.off('postupdate', onFrame);
        if (g.active) g.destroy();
    });
}

function setColor(text: Phaser.GameObjects.Text, color: string) {
    if (text.style.color !== color) text.setColor(color);
}

function upper(text: Phaser.GameObjects.Text, v: Variant) {
    if (v.upper && text.text !== text.text.toUpperCase()) text.setText(text.text.toUpperCase());
}

function publish(scene: Phaser.Scene, name: string, text: Phaser.GameObjects.Text) {
    const b = text.getBounds();
    const cam = scene.cameras.main;
    const toScreen = (x: number, size: number) => (x - size / 2) * cam.zoom + size / 2;
    const w = window as unknown as { __hudTargets?: Record<string, { x: number; y: number }>; __hudSize?: { w: number; h: number } };
    w.__hudTargets = { ...(w.__hudTargets ?? {}), [name]: { x: toScreen(b.centerX, cam.width), y: toScreen(b.centerY, cam.height) } };
    w.__hudSize = { w: cam.width, h: cam.height };
}

export function decorateButton(scene: Phaser.Scene, text: Phaser.GameObjects.Text, label: string): boolean {
    const v = variant();
    if (!v) return false;
    const kind = kindOf(label);
    const icon = v.iconPadding ? iconOf(label) : null;
    styleText(text, v, kind, icon ? v.iconPadding! - v.padding.left : 0);
    upper(text, v);

    let p = 0;
    let tween: Phaser.Tweens.Tween | undefined;
    const go = (to: number) => {
        tween?.stop();
        tween = scene.tweens.addCounter({ from: p, to, duration: 150, ease: 'Cubic.easeOut', onUpdate: (t) => { p = t.getValue() ?? to; } });
    };
    text.on('pointerover', () => go(1));
    text.on('pointerout', () => go(0));

    const g = scene.add.graphics();
    let baseOriginY: number | null = null;
    follow(scene, text, g, () => {
        if (baseOriginY === null) baseOriginY = text.originY;
        const originY = baseOriginY + ((v.lift ?? 0) * p) / text.height;
        if (text.originY !== originY) text.setOrigin(text.originX, originY);
        setColor(text, v.textColor(kind, p));
        v.drawButton({ g, r: rectOf(text, text.originY), base: rectOf(text, baseOriginY), p, kind, s: text.scaleX, icon });
        publish(scene, targetName(label), text);
    });
    return true;
}

export function decorateTurn(scene: Phaser.Scene, text: Phaser.GameObjects.Text) {
    const v = variant();
    if (!v) return;
    styleText(text, v, 'label', v.turnIcon ? 52 - v.padding.left : 0);
    const g = scene.add.graphics();
    follow(scene, text, g, () => {
        upper(text, v);
        if (!text.text) return;
        const own = StoreSystem.getPlayerWithTurn()?.code === StoreSystem.getPlayer().code;
        setColor(text, v.turnColor(own));
        v.drawPanel(g, rectOf(text, text.originY), text.scaleX, 'turn', own);
    });
}

export function decorateDialog(scene: Phaser.Scene, container: Phaser.GameObjects.Container, panel: Phaser.GameObjects.Rectangle, question: Phaser.GameObjects.Text) {
    const v = variant();
    if (!v) return;
    panel.setFillStyle(0, 0);
    panel.isStroked = false;
    const g = scene.add.graphics();
    container.addAt(g, container.getIndex(panel) + 1);
    v.drawPanel(g, { x: panel.x - panel.width / 2, y: panel.y - panel.height / 2, w: panel.width, h: panel.height }, 1, 'dialog', true);
    styleText(question, v, 'label');
    question.setPadding(0);
    upper(question, v);
    setColor(question, v.turnColor(false));
}

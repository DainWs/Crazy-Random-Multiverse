// Reference only, not production code: the shared types and drawing helpers of the skins of docs/skins.
import Phaser from 'phaser';

export type Graphics = Phaser.GameObjects.Graphics;
export type Kind = 'primary' | 'danger' | 'neutral' | 'label';
export type Icon = 'skip' | 'flag' | null;
export type PanelMode = 'dialog' | 'turn';
export interface Rect { x: number; y: number; w: number; h: number }
export interface Point { x: number; y: number }
export type Segment = [number, number, number, number];
export interface Padding { left: number; right: number; top: number; bottom: number }

/** What a HUD skin draws for one button on each frame. `p` is the progress of the hover, from 0 to 1. */
export interface ButtonCtx { g: Graphics; r: Rect; base: Rect; p: number; kind: Kind; s: number; icon: Icon }

export interface HudSkin {
    font: string;
    size: number;
    bold?: boolean;
    upper?: boolean;
    spacing?: number;
    padding: Padding;
    iconPadding?: number;
    stroke?: [string, number];
    shadow?: (kind: Kind) => [number, number, string, number];
    /** Pixels the button rises under the pointer. */
    lift?: number;
    textColor: (kind: Kind, p: number) => string;
    turnColor: (own: boolean) => string;
    drawButton: (c: ButtonCtx) => void;
    drawPanel: (g: Graphics, r: Rect, s: number, mode: PanelMode, own: boolean) => void;
    turnIcon?: boolean;
}

/** A random spot of `spots`, with its own repeatable random numbers `r(k)` from 0 to 1. */
export interface Spot { x: number; y: number; i: number; r: (k: number) => number }

/** The board is the square from (-h, -h), the far left corner, to (h, h), the near right one, in board units.
 * `z` is a height over the ground, in board units. Everything outside the board is the surroundings. */
export interface FieldCtx {
    g: Graphics;
    h: number;
    /** The part of the ground seen around the board, in board units. */
    world: { left: number; right: number; far: number; near: number };
    /** The point of the board on the screen, in perspective, `z` units over the ground. */
    at: (x: number, y: number, z?: number) => Point;
    /** A quadrilateral of the board, from its far left corner to its near right one. */
    quad: (x0: number, y0: number, x1: number, y1: number, color: number, alpha?: number) => void;
    poly: (points: Point[], color: number, alpha?: number) => void;
    /** Lines of the board drawn as one path, so their transparency does not pile up (VIEW-26). */
    lines: (segments: [number, number, number, number][], width: number, color: number, alpha?: number) => void;
    /** A line through points of the board. */
    path: (points: [number, number][], width: number, color: number, alpha?: number, closed?: boolean) => void;
    ring: (cx: number, cy: number, r: number, width: number, color: number, alpha?: number, z?: number) => void;
    disc: (cx: number, cy: number, r: number, color: number, alpha?: number, z?: number) => void;
    /** A disc that fades from `alpha` at its middle to nothing at radius `r`. */
    glow: (cx: number, cy: number, r: number, color: number, alpha: number, steps?: number) => void;
    /** An irregular round shape, the same for the same `seed`; `wobble` is how far its edge strays, as a share of `r`. */
    blob: (cx: number, cy: number, r: number, seed: number, color: number, alpha?: number, wobble?: number) => void;
    /** Bands from `from` to `to` along y (far to near) or x (left to right). */
    gradient: (x0: number, y0: number, x1: number, y1: number, from: number, to: number, axis: 'x' | 'y', steps?: number, alpha?: number) => void;
    /** The whole ground seen around the board. */
    ground: (color: number, alpha?: number) => void;
    /** A band that hangs from an edge of the board towards the bottom of the screen, `t` units tall. */
    side: (edge: 'near' | 'left' | 'right', t: number, color: number, outline?: [number, number]) => void;
    /** A box standing on the ground, with its top, its near face and the side face that looks at the middle. */
    box: (x0: number, y0: number, x1: number, y1: number, z: number, top: number, front: number, side: number, outline?: [number, number]) => void;
    /** A column standing on the ground. */
    pillar: (cx: number, cy: number, r: number, z: number, body: number, top: number, outline?: [number, number]) => void;
    /** `n` random spots in the rectangle, from far to near, left out those within `margin` of the board when `margin` is given. */
    spots: (seed: number, n: number, x0: number, y0: number, x1: number, y1: number, margin?: number) => Spot[];
    /** A repeatable random number from 0 to 1 for the index `i`. */
    rnd: (i: number) => number;
}

export type BattlefieldSkin = (c: FieldCtx) => void;

// ---------- colors ----------

export const hex = (n: number) => '#' + n.toString(16).padStart(6, '0');
export const num = (h: string) => parseInt(h.slice(1), 16);
export function lerp(a: number, b: number, t: number): number {
    const ch = (c: number, sh: number) => (c >> sh) & 0xff;
    const mix = (sh: number) => Math.round(ch(a, sh) + (ch(b, sh) - ch(a, sh)) * t) << sh;
    return mix(16) | mix(8) | mix(0);
}
export const lerpHex = (a: string, b: string, t: number) => hex(lerp(num(a), num(b), t));
export const byKind = <T,>(primary: T, danger: T, neutral: T, label: T) => (k: Kind) => ({ primary, danger, neutral, label })[k];

// ---------- board shapes ----------

/** The four sides of the square of the board centered on its middle, `b` units from it. */
export const square = (b: number): [number, number, number, number][] => [[-b, -b, b, -b], [b, -b, b, b], [b, b, -b, b], [-b, b, -b, -b]];

// ---------- screen shapes ----------

export const inset = (r: Rect, d: number): Rect => ({ x: r.x + d, y: r.y + d, w: r.w - 2 * d, h: r.h - 2 * d });
export const move = (r: Rect, dx: number, dy: number): Rect => ({ x: r.x + dx, y: r.y + dy, w: r.w, h: r.h });
export const pt = (x: number, y: number): Point => ({ x, y });

export function fillRR(g: Graphics, r: Rect, rad: number, color: number, alpha = 1) {
    g.fillStyle(color, alpha);
    if (rad > 0) g.fillRoundedRect(r.x, r.y, r.w, r.h, Math.min(rad, r.h / 2, r.w / 2));
    else g.fillRect(r.x, r.y, r.w, r.h);
}
export function strokeRR(g: Graphics, r: Rect, rad: number, width: number, color: number, alpha = 1) {
    g.lineStyle(width, color, alpha);
    if (rad > 0) g.strokeRoundedRect(r.x, r.y, r.w, r.h, Math.min(rad, r.h / 2, r.w / 2));
    else g.strokeRect(r.x, r.y, r.w, r.h);
}
export function fillPoly(g: Graphics, pts: Point[], color: number, alpha = 1) {
    g.fillStyle(color, alpha);
    g.fillPoints(pts as Phaser.Math.Vector2[], true);
}
export function strokePoly(g: Graphics, pts: Point[], width: number, color: number, alpha = 1, closed = true) {
    g.lineStyle(width, color, alpha);
    g.strokePoints(pts as Phaser.Math.Vector2[], closed);
}
export function chamfer(r: Rect, c: number): Point[] {
    return [
        pt(r.x + c, r.y), pt(r.x + r.w - c, r.y), pt(r.x + r.w, r.y + c), pt(r.x + r.w, r.y + r.h - c),
        pt(r.x + r.w - c, r.y + r.h), pt(r.x + c, r.y + r.h), pt(r.x, r.y + r.h - c), pt(r.x, r.y + c)
    ];
}
export function cutCorners(r: Rect, c: number): Point[] {
    return [pt(r.x + c, r.y), pt(r.x + r.w, r.y), pt(r.x + r.w, r.y + r.h - c), pt(r.x + r.w - c, r.y + r.h), pt(r.x, r.y + r.h), pt(r.x, r.y + c)];
}
export function slant(r: Rect, k: number): Point[] {
    return [pt(r.x + k, r.y), pt(r.x + r.w, r.y), pt(r.x + r.w - k, r.y + r.h), pt(r.x, r.y + r.h)];
}

// Reference only, not production code: draws the HUD skin chosen with window.__hudSkin, each part with its base piece (FX-17).
import Phaser from 'phaser';
import { getText } from '@/core/Texts';
import StoreSystem from '@/core/StoreSystem';
import type { ButtonPiece, HudSkin, Padding, Rect, TextLevel } from './kit';
import { chosenHud } from './registry';

const HOVER_MS = 150;
const GLOW_BLUR = 10;

function buttonOf(skin: HudSkin, label: string): ButtonPiece {
    if (label === getText('ui.game.end_turn')) return skin.buttons.primary;
    if (label === getText('ui.game.surrender') || label === getText('ui.game.confirm_yes') || label === getText('ui.game.leave')) return skin.buttons.destructive;
    return skin.buttons.neutral;
}

function targetName(label: string): string {
    if (label === getText('ui.game.end_turn')) return 'pass';
    if (label === getText('ui.game.surrender')) return 'surrender';
    if (label === getText('ui.game.confirm_yes')) return 'yes';
    if (label === getText('ui.game.confirm_no')) return 'no';
    return label;
}

function styleText(text: Phaser.GameObjects.Text, level: TextLevel, padding: Padding, glow?: string) {
    text.setBackgroundColor('transparent');
    text.setFontFamily(level.font);
    text.setFontSize(level.size);
    text.setFontStyle(level.bold ? 'bold' : '');
    text.setPadding(padding);
    if (level.stroke) text.setStroke(level.stroke[0], level.stroke[1]);
    if (glow) text.setShadow(0, 0, glow, GLOW_BLUR, false, true);
    (text as unknown as { setLetterSpacing?: (n: number) => void }).setLetterSpacing?.(level.spacing ?? 0);
}

function rectOf(text: Phaser.GameObjects.Text, originY: number): Rect {
    const w = text.width * text.scaleX;
    const h = text.height * text.scaleY;
    return { x: text.x - text.originX * w, y: text.y - originY * h, w, h };
}

/** Redraws the shape of a text on every frame, behind it and in its container, so it follows the text wherever the HUD puts it. */
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

function upper(text: Phaser.GameObjects.Text, level: TextLevel) {
    if (level.upper && text.text !== text.text.toUpperCase()) text.setText(text.text.toUpperCase());
}

/** Where each button is on the screen, for the capture to point at it. */
function publish(scene: Phaser.Scene, name: string, text: Phaser.GameObjects.Text) {
    const b = text.getBounds();
    const cam = scene.cameras.main;
    const toScreen = (x: number, size: number) => (x - size / 2) * cam.zoom + size / 2;
    const w = window as unknown as { __hudTargets?: Record<string, { x: number; y: number }> };
    w.__hudTargets = { ...(w.__hudTargets ?? {}), [name]: { x: toScreen(b.centerX, cam.width), y: toScreen(b.centerY, cam.height) } };
}

export function decorateButton(scene: Phaser.Scene, text: Phaser.GameObjects.Text, label: string): boolean {
    const skin = chosenHud();
    if (!skin) return false;
    const piece = buttonOf(skin, label);
    const level = skin.text.label;
    styleText(text, level, piece.padding, piece.glow);
    upper(text, level);

    let p = 0;
    let tween: Phaser.Tweens.Tween | undefined;
    const go = (to: number) => {
        tween?.stop();
        tween = scene.tweens.addCounter({ from: p, to, duration: HOVER_MS, ease: 'Cubic.easeOut', onUpdate: (t) => { p = t.getValue() ?? to; } });
    };
    text.on('pointerover', () => go(1));
    text.on('pointerout', () => go(0));

    const g = scene.add.graphics();
    let baseOriginY: number | null = null;
    follow(scene, text, g, () => {
        if (baseOriginY === null) baseOriginY = text.originY;
        const originY = baseOriginY + ((piece.lift ?? 0) * p) / text.height;
        if (text.originY !== originY) text.setOrigin(text.originX, originY);
        setColor(text, piece.text(p));
        piece.draw({ g, r: rectOf(text, text.originY), base: rectOf(text, baseOriginY), p, s: text.scaleX });
        publish(scene, targetName(label), text);
    });
    return true;
}

export function decorateTurn(scene: Phaser.Scene, text: Phaser.GameObjects.Text) {
    const skin = chosenHud();
    if (!skin) return;
    const panel = skin.panels.hud;
    const level = skin.text.label;
    styleText(text, level, panel.padding, panel.glow);
    const g = scene.add.graphics();
    follow(scene, text, g, () => {
        upper(text, level);
        if (!text.text) return;
        const own = StoreSystem.getPlayerWithTurn()?.code === StoreSystem.getPlayer().code;
        setColor(text, own ? skin.accents.ownTurn : panel.text);
        panel.draw(g, rectOf(text, text.originY), text.scaleX, own ? 'highlight' : 'normal');
    });
}

export function decorateDialog(scene: Phaser.Scene, container: Phaser.GameObjects.Container, frame: Phaser.GameObjects.Rectangle, question: Phaser.GameObjects.Text) {
    const skin = chosenHud();
    if (!skin) return;
    const panel = skin.panels.notice;
    frame.setFillStyle(0, 0);
    frame.isStroked = false;
    const g = scene.add.graphics();
    container.addAt(g, container.getIndex(frame) + 1);
    panel.draw(g, { x: frame.x - frame.width / 2, y: frame.y - frame.height / 2, w: frame.width, h: frame.height }, 1, 'normal');
    styleText(question, skin.text.body, { left: 0, right: 0, top: 0, bottom: 0 }, panel.glow);
    upper(question, skin.text.body);
    setColor(question, panel.text);
}

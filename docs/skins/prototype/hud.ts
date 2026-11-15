// Reference only, not production code: draws the HUD skin chosen with window.__hudSkin.
import Phaser from 'phaser';
import { getText } from '@/core/Texts';
import StoreSystem from '@/core/StoreSystem';
import type { HudSkin, Icon, Kind, Rect } from './kit';
import { chosenHud } from './registry';

const HOVER_MS = 150;

function skin(): HudSkin | undefined {
    return chosenHud();
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

function styleText(text: Phaser.GameObjects.Text, v: HudSkin, kind: Kind, extraLeft = 0) {
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

function upper(text: Phaser.GameObjects.Text, v: HudSkin) {
    if (v.upper && text.text !== text.text.toUpperCase()) text.setText(text.text.toUpperCase());
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
    const v = skin();
    if (!v) return false;
    const kind = kindOf(label);
    const icon = v.iconPadding ? iconOf(label) : null;
    styleText(text, v, kind, icon ? v.iconPadding! - v.padding.left : 0);
    upper(text, v);

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
        const originY = baseOriginY + ((v.lift ?? 0) * p) / text.height;
        if (text.originY !== originY) text.setOrigin(text.originX, originY);
        setColor(text, v.textColor(kind, p));
        v.drawButton({ g, r: rectOf(text, text.originY), base: rectOf(text, baseOriginY), p, kind, s: text.scaleX, icon });
        publish(scene, targetName(label), text);
    });
    return true;
}

export function decorateTurn(scene: Phaser.Scene, text: Phaser.GameObjects.Text) {
    const v = skin();
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
    const v = skin();
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

import type { GameResult } from '@/core/StoreSystem';
import type { Point2D } from '@/domain/Geometry';
import type { GameScene } from '@/scenes/Game';
import type { GameResultSummary } from '@/game/result/GameResultSummary';
import GameResultLayout from '@/game/result/GameResultLayout';
import { summarizeResult } from '@/game/result/GameResultSummary';
import StoreSystem from '@/core/StoreSystem';
import { getText } from '@/core/Texts';
import type { TextLevel } from '@/game/hud/HudSkin';
import { accentColor, createPanel, createText } from '@/game/hud/HudPieces';
import * as Constants from '@/core/Constants';
import { calculateScreenFixedTransform, toLogicalScreen } from '@/core/cameras/CameraCalculations';
import { paletteFill } from '@/game/utils/Palette';
import { playMotion } from '@/core/visual_effects/Motion';

/** Shows over the board whether the local player won or lost, who won and the seconds left until the party (WIN-4). */
class GameResultView {
    private readonly scene: GameScene;
    private readonly layout: GameResultLayout;
    private readonly container: Phaser.GameObjects.Container;
    private readonly veilShape: Phaser.GameObjects.Rectangle;
    private readonly panelShape: Phaser.GameObjects.Rectangle;
    private readonly title: Phaser.GameObjects.Text;
    private readonly winner: Phaser.GameObjects.Text;
    private readonly countdown: Phaser.GameObjects.Text;
    private tick?: Phaser.Time.TimerEvent;
    private readonly panelGroup: Array<Phaser.GameObjects.Rectangle | Phaser.GameObjects.Text>;
    private screenWidth: number;
    private screenHeight: number;
    private remainingSeconds = Constants.GAME_RESULT_COUNTDOWN_SECONDS;
    private readonly stopListening: () => void;

    public constructor(scene: GameScene, result: GameResult) {
        this.scene = scene;
        this.layout = new GameResultLayout(toLogicalScreen(scene.scale, Constants.RENDER_SCALE));

        const positions = this.layout.positions();
        const { veil } = positions;

        this.veilShape = scene.add.rectangle(0, 0, veil.width, veil.height, paletteFill('SCREEN_VEIL'), Constants.GAME_RESULT_VEIL_ALPHA);
        this.veilShape.setOrigin(0, 0);
        this.veilShape.setInteractive();

        const { panel } = positions;
        this.panelShape = createPanel(scene, 'NOTICE');
        this.panelShape.setPosition(panel.x, panel.y);
        this.panelShape.setSize(panel.width, panel.height);

        this.title = this.createLine(positions.title, 'TITLE');
        this.winner = this.createLine(positions.winner, 'BODY');
        this.countdown = this.createLine(positions.countdown, 'BODY');

        this.veilShape.setAlpha(0);
        this.panelGroup = [this.panelShape, this.title, this.winner, this.countdown];
        this.panelGroup.forEach((piece) => piece.setAlpha(0));

        this.container = scene.add.container(0, 0, [this.veilShape, ...this.panelGroup]);
        this.container.setScrollFactor(0);
        this.container.setDepth(Constants.GAME_RESULT_DEPTH);

        this.screenWidth = scene.scale.width;
        this.screenHeight = scene.scale.height;
        this.showResult(result);
        this.applyZoom();
        const sceneEvents = scene.events;
        sceneEvents.on('prerender', this.applyZoom, this);
        this.stopListening = () => sceneEvents.off('prerender', this.applyZoom, this);

        void this.fadeIn();
    }

    /** The veil fades in over the board, then the panel with its texts, and the countdown starts when the panel is in (VIEW-23). */
    private async fadeIn() {
        await playMotion(this.scene, { targets: this.veilShape, to: { alpha: 1 }, duration: Constants.GAME_RESULT_VEIL_FADE_MS, curve: 'ENTER', kind: 'NON_ESSENTIAL' });
        await playMotion(this.scene, { targets: this.panelGroup, to: { alpha: 1 }, duration: 'SLOW', curve: 'ENTER', kind: 'NON_ESSENTIAL' });

        if (this.container.active) {
            this.tick = this.scene.time.addEvent({ delay: Constants.GAME_RESULT_TICK_MS, loop: true, callback: this.onTick.bind(this) });
        }
    }

    /** The winner arrives in an event after the end of the game, so the result can be drawn again. */
    public showResult(result: GameResult) {
        const summary = summarizeResult(result, StoreSystem.getPlayer().code);

        this.title.setText(this.titleOf(summary));
        this.title.setColor(accentColor(summary.isVictory ? 'POSITIVE' : 'NEGATIVE'));
        this.winner.setText(summary.winnerName ? `${getText('ui.game.winner')} ${summary.winnerName}` : '');
        this.refreshCountdown();
    }

    private titleOf(summary: GameResultSummary): string {
        if (!summary.isDecided) {
            return '';
        }

        return getText(summary.isVictory ? 'ui.game.victory' : 'ui.game.defeat');
    }

    /** The result covers the whole screen at any zoom of the camera, which scales it even with scroll factor 0. */
    private applyZoom() {
        const { width, height } = this.scene.scale;
        if (width !== this.screenWidth || height !== this.screenHeight) {
            this.placeToScreen();
        }

        const screen = toLogicalScreen({ width, height }, Constants.RENDER_SCALE);
        const { x, y, scale } = calculateScreenFixedTransform(
            screen.width, screen.height, this.scene.cameraSystem.getCamera().zoom, Constants.RENDER_SCALE
        );
        this.container.setPosition(x, y).setScale(scale);
    }

    /** The veil, the panel and the lines follow the window when it changes size (VIEW-24). */
    private placeToScreen() {
        const { width, height } = this.scene.scale;
        const positions = this.layout.positions();

        this.screenWidth = width;
        this.screenHeight = height;
        this.veilShape.setSize(positions.veil.width, positions.veil.height);
        this.panelShape.setPosition(positions.panel.x, positions.panel.y);
        this.title.setPosition(positions.title.x, positions.title.y);
        this.winner.setPosition(positions.winner.x, positions.winner.y);
        this.countdown.setPosition(positions.countdown.x, positions.countdown.y);
    }

    public destroy() {
        this.stopListening();
        this.tick?.remove();
        this.container.destroy();
    }

    private onTick() {
        this.remainingSeconds = Math.max(0, this.remainingSeconds - 1);
        this.refreshCountdown();
    }

    private refreshCountdown() {
        this.countdown.setText(`${getText('ui.game.returning')} ${this.remainingSeconds}`);
    }

    private createLine(position: Point2D, level: TextLevel): Phaser.GameObjects.Text {
        const text = createText(this.scene, level);
        text.setPosition(position.x, position.y);
        text.setOrigin(0.5);
        return text;
    }
}

export default GameResultView;

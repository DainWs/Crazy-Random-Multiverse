import type { GameResult } from '@/core/StoreSystem';
import type { Point2D } from '@/domain/Geometry';
import type { GameScene } from '@/scenes/Game';
import type { GameResultSummary } from '@/game/result/GameResultSummary';
import GameResultLayout from '@/game/result/GameResultLayout';
import { summarizeResult } from '@/game/result/GameResultSummary';
import StoreSystem from '@/core/StoreSystem';
import { getText } from '@/core/Texts';
import * as Constants from '@/core/Constants';
import { calculateScreenFixedTransform } from '@/core/cameras/CameraCalculations';

/** Shows over the board whether the local player won or lost, who won and the seconds left until the party (WIN-4). */
class GameResultView {
    private readonly scene: GameScene;
    private readonly layout: GameResultLayout;
    private readonly container: Phaser.GameObjects.Container;
    private readonly veilShape: Phaser.GameObjects.Rectangle;
    private readonly title: Phaser.GameObjects.Text;
    private readonly winner: Phaser.GameObjects.Text;
    private readonly countdown: Phaser.GameObjects.Text;
    private readonly tick: Phaser.Time.TimerEvent;
    private screenWidth: number;
    private screenHeight: number;
    private remainingSeconds = Constants.GAME_RESULT_COUNTDOWN_SECONDS;
    private readonly stopListening: () => void;

    public constructor(scene: GameScene, result: GameResult) {
        this.scene = scene;
        this.layout = new GameResultLayout(scene.scale);

        const positions = this.layout.positions();
        const { veil } = positions;

        this.veilShape = scene.add.rectangle(0, 0, veil.width, veil.height, Constants.CONFIRM_VEIL_COLOR, Constants.GAME_RESULT_VEIL_ALPHA);
        this.veilShape.setOrigin(0, 0);
        this.veilShape.setInteractive();

        this.title = this.createText(positions.title, Constants.GAME_RESULT_TITLE_FONT_SIZE);
        this.winner = this.createText(positions.winner, Constants.GAME_RESULT_DETAIL_FONT_SIZE);
        this.countdown = this.createText(positions.countdown, Constants.GAME_RESULT_DETAIL_FONT_SIZE);

        this.container = scene.add.container(0, 0, [this.veilShape, this.title, this.winner, this.countdown]);
        this.container.setScrollFactor(0);
        this.container.setDepth(Constants.GAME_RESULT_DEPTH);

        this.screenWidth = scene.scale.width;
        this.screenHeight = scene.scale.height;
        this.showResult(result);
        this.applyZoom();
        const sceneEvents = scene.events;
        sceneEvents.on('prerender', this.applyZoom, this);
        this.stopListening = () => sceneEvents.off('prerender', this.applyZoom, this);

        this.tick = scene.time.addEvent({ delay: Constants.GAME_RESULT_TICK_MS, loop: true, callback: this.onTick.bind(this) });
    }

    /** The winner arrives in an event after the end of the game, so the result can be drawn again. */
    public showResult(result: GameResult) {
        const summary = summarizeResult(result, StoreSystem.getPlayer().code);

        this.title.setText(this.titleOf(summary));
        this.title.setColor(summary.isVictory ? Constants.GAME_RESULT_VICTORY_COLOR : Constants.GAME_RESULT_DEFEAT_COLOR);
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

        const { x, y, scale } = calculateScreenFixedTransform(width, height, this.scene.cameraSystem.getCamera().zoom);
        this.container.setPosition(x, y).setScale(scale);
    }

    /** The veil and the lines follow the window when it changes size (VIEW-24). */
    private placeToScreen() {
        const { width, height } = this.scene.scale;
        const positions = this.layout.positions();

        this.screenWidth = width;
        this.screenHeight = height;
        this.veilShape.setSize(positions.veil.width, positions.veil.height);
        this.title.setPosition(positions.title.x, positions.title.y);
        this.winner.setPosition(positions.winner.x, positions.winner.y);
        this.countdown.setPosition(positions.countdown.x, positions.countdown.y);
    }

    public destroy() {
        this.stopListening();
        this.tick.remove();
        this.container.destroy();
    }

    private onTick() {
        this.remainingSeconds = Math.max(0, this.remainingSeconds - 1);
        this.refreshCountdown();
    }

    private refreshCountdown() {
        this.countdown.setText(`${getText('ui.game.returning')} ${this.remainingSeconds}`);
    }

    private createText(position: Point2D, fontSize: string): Phaser.GameObjects.Text {
        const text = this.scene.add.text(position.x, position.y, '', { fontSize, color: Constants.HUD_COLOR });
        text.setOrigin(0.5);
        return text;
    }
}

export default GameResultView;

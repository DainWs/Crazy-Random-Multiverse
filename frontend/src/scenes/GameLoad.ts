import type { ActiveGame } from '@/domain/ActiveGame';
import type { ResourceManifest } from '@/domain/Resources';
import Phaser, { Scene } from 'phaser';
import { gameApi } from '@/api';
import { ApiException } from '@/api/models/ApiException';
import SessionSystem from '@/core/SessionSystem';
import ResourceSystem, { IMAGE_XHR_SETTINGS } from '@/core/ResourceSystem';
import { getText } from '@/core/Texts';
import { isFinalRejection, planLoad } from '@/core/GameLoadPlanner';
import CalmTargetingOverlay from '@/game/perspectives/overlays/CalmTargetingOverlay';
import GameLoadLayout from '@/scenes/GameLoadLayout';
import * as Constants from '@/core/Constants';

const BAR_FILL_MIN_WIDTH = 4;
const BAR_STROKE_WIDTH = 1;
const TEXT_COLOR = '#ffffff';
const STATUS_TEXT_SIZE = '20px';
const RETRY_TEXT_SIZE = '24px';

/** The manifest URLs are relative to the server, not to a folder. */
const MANIFEST_ASSETS_PATH = '';

class GameLoadScene extends Scene {
    private overlaysGenerated: boolean = false;
    private closed: boolean = false;
    private activeGame!: ActiveGame;
    private manifest: ResourceManifest | undefined;
    private layout!: GameLoadLayout;
    private progress = 0;
    private panel!: Phaser.GameObjects.Rectangle;
    private barFrame!: Phaser.GameObjects.Rectangle;
    private progressBar!: Phaser.GameObjects.Rectangle;
    private statusText!: Phaser.GameObjects.Text;
    private retryButton!: Phaser.GameObjects.Text;

    constructor() {
        super('GameLoad');
    }

    init() {
        this.closed = false;
        this.manifest = undefined;
        SessionSystem.cancelLeaderIntro();
        this.cameras.main.setAlpha(1);

        this.events.once('shutdown', this.onShutdown, this);
        this.createLoadingView();
        this.scale.on(Phaser.Scale.Events.RESIZE, this.placeLoadingView, this);
    }

    /** The panel, the bar and the texts are centered on the window and follow its size (VIEW-29). */
    private createLoadingView() {
        this.panel = this.add.rectangle(0, 0, 0, 0, Constants.LOAD_PANEL_COLOR);
        this.panel.setStrokeStyle(Constants.LOAD_PANEL_BORDER_WIDTH, Constants.LOAD_PANEL_BORDER_COLOR);

        this.barFrame = this.add.rectangle(0, 0, 0, 0).setStrokeStyle(BAR_STROKE_WIDTH, Constants.LOAD_PANEL_BORDER_COLOR);
        this.progressBar = this.add.rectangle(0, 0, BAR_FILL_MIN_WIDTH, 0, Constants.LOAD_BAR_FILL_COLOR);
        this.progressBar.setOrigin(0, 0.5);

        this.statusText = this.add.text(0, 0, '', { fontSize: STATUS_TEXT_SIZE, color: TEXT_COLOR });
        this.statusText.setOrigin(0.5, 0.5);

        this.retryButton = this.add.text(0, 0, getText('ui.game_load.retry'), { fontSize: RETRY_TEXT_SIZE, color: TEXT_COLOR });
        this.retryButton.setBackgroundColor(Constants.HUD_BUTTON_BACKGROUND);
        this.retryButton.setPadding(Constants.HUD_BUTTON_PADDING);
        this.retryButton.setOrigin(0.5, 0.5);
        this.retryButton.setInteractive({ useHandCursor: true });
        this.retryButton.on('pointerdown', () => void this.run());
        this.retryButton.on('pointerover', () => this.retryButton.setBackgroundColor(Constants.HUD_BUTTON_HOVER_BACKGROUND));
        this.retryButton.on('pointerout', () => this.retryButton.setBackgroundColor(Constants.HUD_BUTTON_BACKGROUND));
        this.retryButton.setVisible(false);

        this.placeLoadingView();
        this.updateProgressBar(0);
    }

    private placeLoadingView() {
        this.layout = new GameLoadLayout(this.scale);
        const panel = this.layout.panel();
        const barFrame = this.layout.barFrame();
        const barFill = this.layout.barFill();
        const statusText = this.layout.statusText();
        const retryButton = this.layout.retryButton();

        this.panel.setPosition(panel.x, panel.y).setSize(panel.width, panel.height);
        this.barFrame.setPosition(barFrame.x, barFrame.y).setSize(barFrame.width, barFrame.height);
        this.progressBar.setPosition(barFill.x, barFill.y);
        this.progressBar.height = barFill.height;
        this.statusText.setPosition(statusText.x, statusText.y);
        this.retryButton.setPosition(retryButton.x, retryButton.y);
        this.updateProgressBar(this.progress);
    }

    private onShutdown() {
        this.scale.off(Phaser.Scale.Events.RESIZE, this.placeLoadingView, this);
        this.closed = true;
        this.load.removeAllListeners('progress');
        this.load.removeAllListeners('complete');
    }

    create() {
        const activeGame = SessionSystem.activeGame.value;
        if (activeGame) {
            this.activeGame = activeGame;
            void this.run();
        } else {
            console.error('GameLoad started without an active game');
            SessionSystem.abandonGame();
        }
    }

    /** Downloads what the game needs and, while loading, confirms with the server. Repeating it only repeats what is missing (UI-12). */
    private async run() {
        this.showStatus(getText('ui.game_load.loading'));
        this.retryButton.setVisible(false);
        this.updateProgressBar(0);

        try {
            const manifest = this.manifest ?? (await gameApi.loadGameResourceManifest(this.activeGame.gameCode));
            if (!this.closed) {
                await this.loadGame(manifest);
            }
        } catch (error) {
            if (!this.closed) {
                this.onFailure(error);
            }
        }
    }

    private async loadGame(manifest: ResourceManifest) {
        this.manifest = manifest;
        ResourceSystem.registerDynamic(manifest.dynamic);

        const failedKeys = await this.downloadResources(manifest);
        const hasFailed = failedKeys.length > 0;
        if (!this.closed && hasFailed) {
            this.showFailure(getText('ui.game_load.failed'));
        }

        if (!this.closed && !hasFailed) {
            this.generateOverlays();
            await this.finishLoading();
        }
    }

    private async finishLoading() {
        if (SessionSystem.userState.value === 'GAME_LOADING') {
            await this.confirmReady();
        } else {
            this.scene.launch('Game');
        }
    }

    private async confirmReady() {
        await gameApi.sendReady(this.activeGame.gameCode);
        SessionSystem.requestLeaderIntro();
        if (!this.closed) {
            this.showStatus(getText('ui.game_load.waiting'));
        }
    }

    private onFailure(error: unknown) {
        if (isFinalRejection(error)) {
            SessionSystem.abandonGame((error as ApiException).key);
        } else {
            this.showFailure(this.failureMessage(error));
        }
    }

    private failureMessage(error: unknown): string {
        if (error instanceof ApiException) {
            return getText(error.key);
        }

        return getText('ui.game_load.failed');
    }

    private showStatus(message: string) {
        this.statusText.setText(message);
    }

    private showFailure(message: string) {
        this.showStatus(message);
        this.retryButton.setVisible(true);
    }

    /** Resolves with the keys of the required resources that are still missing (LOAD-2). */
    private downloadResources(manifest: ResourceManifest): Promise<string[]> {
        const { required, optional } = planLoad(manifest, this.activeGame.leaders, (key) => this.textures.exists(key));

        return new Promise((resolve) => {
            const onProgress = (ratio: number) => this.updateProgressBar(ratio);
            this.load.on('progress', onProgress);
            this.load.once('complete', () => {
                this.load.off('progress', onProgress);
                this.updateProgressBar(1);
                resolve(required.filter((resource) => !this.textures.exists(resource.key)).map((resource) => resource.key));
            });

            this.load.setPath(MANIFEST_ASSETS_PATH);
            for (const resource of [...required, ...optional]) {
                this.load.image(resource.key, resource.url, IMAGE_XHR_SETTINGS);
            }

            this.load.start();
        });
    }

    private updateProgressBar(ratio: number) {
        this.progress = Math.min(Math.max(ratio, 0), 1);
        const maxWidth = this.layout.barFill().width;
        this.progressBar.width = BAR_FILL_MIN_WIDTH + ((maxWidth - BAR_FILL_MIN_WIDTH) * this.progress);
    }

    private generateOverlays() {
        if (!this.overlaysGenerated) {
            CalmTargetingOverlay.generateTexture(this);
            this.overlaysGenerated = true;
        }
    }
}

export { GameLoadScene as GameLoad }
export type { GameLoadScene }

import type { ActiveGame } from '@/domain/ActiveGame';
import type { ResourceManifest } from '@/domain/Resources';
import { Scene } from 'phaser';
import { gameApi } from '@/api';
import { ApiException } from '@/api/models/ApiException';
import Zone from '@/domain/Zone';
import Player from '@/domain/Player';
import cardFactory from '@/domain/cardFactory';
import GameConfiguration from '@/domain/GameConfiguration';
import Battlefield from '@/domain/Battlefield';
import { DEFAULT_SKIN } from '@/domain/BattlefieldSkin';
import StoreSystem, { GameState } from '@/core/StoreSystem';
import SessionSystem from '@/core/SessionSystem';
import ResourceSystem, { IMAGE_XHR_SETTINGS } from '@/core/ResourceSystem';
import { getText } from '@/core/Texts';
import { isFinalRejection, planLoad } from '@/core/GameLoadPlanner';
import CalmTargetingOverlay from '@/game/perspectives/overlays/CalmTargetingOverlay';

const BAR_CENTER_X = 512;
const BAR_CENTER_Y = 384;
const BAR_FRAME_WIDTH = 468;
const BAR_FRAME_HEIGHT = 32;
const BAR_FILL_HEIGHT = 28;
const BAR_FILL_MIN_WIDTH = 4;
const BAR_FILL_MAX_WIDTH = 460;
const BAR_FILL_START_OFFSET = 230;
const BAR_COLOR = 0xffffff;
const BAR_STROKE_WIDTH = 1;
const STATUS_TEXT_OFFSET_Y = 56;
const RETRY_TEXT_OFFSET_Y = 104;
const TEXT_COLOR = '#ffffff';
const STATUS_TEXT_SIZE = '20px';
const RETRY_TEXT_SIZE = '24px';

/** Files that exist only for the mocked hand, served by the frontend until Phase 3 removes it. */
const MOCK_ASSETS_PATH = 'assets';
/** The manifest URLs are relative to the server, not to a folder. */
const MANIFEST_ASSETS_PATH = '';

class GameLoadScene extends Scene {
    private playerCount: number = 2;
    private overlaysGenerated: boolean = false;
    private closed: boolean = false;
    private activeGame!: ActiveGame;
    private manifest: ResourceManifest | undefined;
    private progressBar!: Phaser.GameObjects.Rectangle;
    private statusText!: Phaser.GameObjects.Text;
    private retryButton!: Phaser.GameObjects.Text;

    constructor() {
        super('GameLoad');
    }

    init(data: { playerCount?: number }) {
        this.closed = false;
        this.manifest = undefined;
        if (data?.playerCount) {
            this.playerCount = data.playerCount;
        }

        this.events.once('shutdown', this.onShutdown, this);
        this.createLoadingView();
    }

    private createLoadingView() {
        this.add.rectangle(BAR_CENTER_X, BAR_CENTER_Y, BAR_FRAME_WIDTH, BAR_FRAME_HEIGHT).setStrokeStyle(BAR_STROKE_WIDTH, BAR_COLOR);
        this.progressBar = this.add.rectangle(BAR_CENTER_X - BAR_FILL_START_OFFSET, BAR_CENTER_Y, BAR_FILL_MIN_WIDTH, BAR_FILL_HEIGHT, BAR_COLOR);
        this.progressBar.setOrigin(0, 0.5);

        this.statusText = this.add.text(BAR_CENTER_X, BAR_CENTER_Y + STATUS_TEXT_OFFSET_Y, '', { fontSize: STATUS_TEXT_SIZE, color: TEXT_COLOR });
        this.statusText.setOrigin(0.5, 0.5);

        this.retryButton = this.add.text(BAR_CENTER_X, BAR_CENTER_Y + RETRY_TEXT_OFFSET_Y, getText('ui.game_load.retry'), { fontSize: RETRY_TEXT_SIZE, color: TEXT_COLOR });
        this.retryButton.setOrigin(0.5, 0.5);
        this.retryButton.setInteractive({ useHandCursor: true });
        this.retryButton.on('pointerdown', () => void this.run());
        this.retryButton.setVisible(false);

        this.updateProgressBar(0);
    }

    private onShutdown() {
        this.closed = true;
        this.load.removeAllListeners('progress');
        this.load.removeAllListeners('complete');
    }

    create() {
        const activeGame = SessionSystem.activeGame.value;
        if (!activeGame) {
            console.error('GameLoad started without an active game');
            SessionSystem.abandonGame();
            return;
        }

        this.activeGame = activeGame;
        this.loadGameData();
        void this.run();
    }

    /** Downloads what the game needs and, while loading, confirms with the server. Repeating it only repeats what is missing (UI-12). */
    private async run() {
        this.showStatus(getText('ui.game_load.loading'));
        this.retryButton.setVisible(false);
        this.updateProgressBar(0);

        try {
            const manifest = this.manifest ?? (await gameApi.loadGameResourceManifest(this.activeGame.gameCode));
            if (this.closed) return;
            this.manifest = manifest;
            ResourceSystem.registerDynamic(manifest.dynamic);

            const failedKeys = await this.downloadResources(manifest);
            if (this.closed) return;
            if (failedKeys.length > 0) {
                this.showFailure(getText('ui.game_load.failed'));
                return;
            }

            this.generateOverlays();
            await this.finishLoading();
        } catch (error) {
            if (!this.closed) this.onFailure(error);
        }
    }

    private async finishLoading() {
        if (SessionSystem.userState.value !== 'GAME_LOADING') {
            this.scene.start('Game');
            return;
        }

        await gameApi.sendReady(this.activeGame.gameCode);
        if (this.closed) return;
        this.showStatus(getText('ui.game_load.waiting'));
    }

    private onFailure(error: unknown) {
        if (isFinalRejection(error)) {
            SessionSystem.abandonGame();
            return;
        }

        const message = error instanceof ApiException ? getText(error.key) : getText('ui.game_load.failed');
        this.showFailure(message);
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

            this.enqueueMockAssets();

            this.load.setPath(MANIFEST_ASSETS_PATH);
            for (const resource of [...required, ...optional]) {
                this.load.image(resource.key, resource.url, IMAGE_XHR_SETTINGS);
            }

            this.load.start();
        });
    }

    private enqueueMockAssets() {
        this.load.setPath(MOCK_ASSETS_PATH);
        // TODO mock-only: spells are not in the manifest (CON-30); remove with the mocked hand in Phase 3
        this.load.image('frame.spell', 'card-spell.png');

        this.load.image('warrior.common.1', 'common-01.png');
        this.load.audio('warrior.common.1.put', 'common-put-01.mp3');
        this.load.audio('warrior.common.1.attack.1', 'common-attack-01-1.mp3');
        this.load.audio('warrior.common.1.attack.2', 'common-attack-01-2.mp3');
        this.load.audio('warrior.common.1.attack.3', 'common-attack-01-3.mp3');
        this.load.audio('warrior.common.1.die', 'common-die-01.mp3');

        this.load.image('warrior.mythic.1', 'mythic-01.png');
        this.load.audio('warrior.mythic.1.put', 'mythic-put-01.mp3');
        this.load.audio('warrior.mythic.1.attack.1', 'mythic-attack-01-1.mp3');
        this.load.audio('warrior.mythic.1.attack.2', 'mythic-attack-01-1.mp3');
        this.load.audio('warrior.mythic.1.attack.3', 'mythic-attack-01-1.mp3');
        this.load.audio('warrior.mythic.1.die', 'mythic-die-01.mp3');
    }

    private updateProgressBar(ratio: number) {
        const clamped = Math.min(Math.max(ratio, 0), 1);
        this.progressBar.width = BAR_FILL_MIN_WIDTH + (BAR_FILL_MAX_WIDTH * clamped);
    }

    private generateOverlays() {
        if (this.overlaysGenerated) return;

        CalmTargetingOverlay.generateTexture(this);
        this.overlaysGenerated = true;
    }

    private loadGameData() {
        const gameState = this.createGameState();
        StoreSystem.initializeGame(gameState);
    }

    // TODO remove this method and receive the game state from the GameEngine
    public createGameState(): GameState {
        const PLAYER_COUNT = this.playerCount;
        const gameConfiguration = new GameConfiguration(this.activeGame.gameCode, 'CLASSIC', PLAYER_COUNT);
        const user = StoreSystem.getUser();
        const player = new Player(user.code, user.name);
        const playerZone = new Zone(player, 'FRIENDLY', 'BASE');
        const battlefield = new Battlefield(DEFAULT_SKIN, gameConfiguration, playerZone);
        const zones = this.getMockedZones(battlefield, playerZone);
        battlefield.addZones(zones);

        return {
            gameConfiguration: gameConfiguration,
            battlefield: battlefield,
            turn: 1,
            round: 1,
            zones: zones,
            player: player,
            playerZone: playerZone,
            playerHand: this.getPlayerMockedHand(),
        };
    }

    // TODO remove this method and receive the game state from the GameEngine
    private getPlayerMockedHand() {
        return [
            cardFactory.createLeaderCard(),
            cardFactory.createWarriorCard({ rarity: 'COMMON', code: '1' }),
            cardFactory.createWarriorCard({ rarity: 'MYTHIC', code: '1' }),
            cardFactory.createWarriorCard({}),
            cardFactory.createWarriorCard({}),
            cardFactory.createEquipmentCard(),
            cardFactory.createEquipmentCard(),
            cardFactory.createSpellCard(),
            cardFactory.createSpellCard(),
            cardFactory.createSpellCard()
        ];
    }

    // TODO remove this method and receive the game state from the GameEngine
    private getMockedZones(battlefield: Battlefield, playerZone: Zone) {
        const zones: Zone[] = [playerZone];

        const maxAlies = 0;
        const maxEnemies = battlefield.gameConfiguration.playerCount - (maxAlies + 1);

        for (let i = 0; i < maxAlies; i++) {
            const allyPlayer = new Player(`Ally:${i.toString()}`, `Ally ${i}`);
            const allyPlayerZone = new Zone(allyPlayer, 'FRIENDLY', 'BASE');
            zones.push(allyPlayerZone);
        }

        for (let i = 0; i < maxEnemies; i++) {
            const enemyPlayer = new Player(`Enemy:${i.toString()}`, `Enemy ${i}`);
            const enemyPlayerZone = new Zone(enemyPlayer, 'ENEMY', 'BASE');
            zones.push(enemyPlayerZone);
        }

        return zones;
    }

}

export { GameLoadScene as GameLoad }
export type { GameLoadScene }

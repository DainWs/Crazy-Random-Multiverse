import { Scene } from 'phaser';
import Zone from '@/domain/Zone';
import Player from '@/domain/Player';
import cardFactory from '@/domain/cardFactory';
import StoreSystem, { GameState } from '@/core/StoreSystem';
import CalmTargetingOverlay from '@/game/perspectives/overlays/CalmTargetingOverlay';
import GameConfiguration from '@/domain/GameConfiguration';
import Battlefield from '@/domain/Battlefield';
import { DEFAULT_SKIN } from '@/domain/BattlefieldSkin';
import type { ResourceManifest } from '@/domain/Resources';
import { gameApi } from '@/api';

class GameLoadScene extends Scene {
    private playerCount: number = 2;
    private alreadyProcessed: boolean = false;
    private progressBar!: Phaser.GameObjects.Rectangle;
    private totalItemsToLoad: number = 0;
    private loadedItemsCount: number = 0;

    constructor() {
        super('GameLoad');
    }

    init(data: { playerCount?: number }) {
        if (data?.playerCount) {
            this.playerCount = data.playerCount;
        }

        // Barra de progreso (marco y relleno)
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);
        this.progressBar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        this.totalItemsToLoad = 0;
        this.loadedItemsCount = 0;
        this.updateProgressBar(0);
    }

    private updateProgressBar(ratio: number) {
        const clamped = Math.min(Math.max(ratio, 0), 1);
        if (this.progressBar) {
            this.progressBar.width = 4 + (460 * clamped);
        }
    }

    private incrementProgress() {
        this.loadedItemsCount++;
        const ratio = this.totalItemsToLoad > 0 ? this.loadedItemsCount / this.totalItemsToLoad : 1;
        this.updateProgressBar(ratio);
    }

    async preload() {
        if (!this.alreadyProcessed) {
            this.loadBaseAssets();
            this.generateOverlays();
        }

        this.loadGameData();
        this.alreadyProcessed = true;

        const gameConfiguration = StoreSystem.getGameConfiguration();
        let manifest: ResourceManifest | null = null;

        if (gameConfiguration) {
            try {
                manifest = await gameApi.loadGameResourceManifest(gameConfiguration.gameCode);
            } catch (error) {
                console.warn('[GameLoad] Failed to load game resource manifest, proceeding with defaults:', error);
            }
        }

        if (manifest) {
            this.registerManifestResources(manifest);
        }

        // Si hay recursos encolados en Phaser Loader, escuchar eventos por archivo para actualizar la barra
        this.load.on('filecomplete', () => {
            this.incrementProgress();
        });

        this.load.once('complete', () => {
            this.updateProgressBar(1);
            this.onLoadingFinished();
        });

        // Iniciar la descarga en Phaser Loader
        this.load.start();
    }

    private loadBaseAssets() {
        this.load.setPath('assets');
        this.enqueueImage('unknown', 'unknown.png');

        this.enqueueImage('statistic-icon_unknown', 'unknown.png');
        this.enqueueImage('statistic-icon_true_damage', 'true_sword.png');
        this.enqueueImage('statistic-icon_physical_damage', 'sword.png');
        this.enqueueImage('statistic-icon_magic_damage', 'staff.png');
        this.enqueueImage('statistic-icon_physical_armor', 'shield.png');
        this.enqueueImage('statistic-icon_magic_armor', 'magic_shield.png');
        this.enqueueImage('statistic-icon_health', 'hearth.png');

        this.enqueueImage('common-card', 'card-common.png');
        this.enqueueImage('uncommon-card', 'card-uncommon.png');
        this.enqueueImage('rare-card', 'card-rare.png');
        this.enqueueImage('epic-card', 'card-epic.png');
        this.enqueueImage('legendary-card', 'card-legendary.png');
        this.enqueueImage('mythic-card', 'card-mythic.png');

        this.enqueueImage('leader-card', 'card-leader.png');
        this.enqueueImage('equipment-card', 'card-equipment.png');
        this.enqueueImage('spell-card', 'card-spell.png');

        this.enqueueImage('zoneslot-mark-warrior', 'warrior_mark.png');
        this.enqueueImage('zoneslot-mark-leader', 'leader_mark.png');

        this.enqueueImage('warrior-0', 'logo.png');
        this.enqueueImage('common-1', 'common-01.png');
        this.enqueueAudio('common-put-1-1', 'common-put-01.mp3');
        this.enqueueAudio('common-attack-1-1', 'common-attack-01-1.mp3');
        this.enqueueAudio('common-attack-1-2', 'common-attack-01-2.mp3');
        this.enqueueAudio('common-attack-1-3', 'common-attack-01-3.mp3');
        this.enqueueAudio('common-die-1-1', 'common-die-01.mp3');

        this.enqueueImage('mythic-1', 'mythic-01.png');
        this.enqueueAudio('mythic-put-1-1', 'mythic-put-01.mp3');
        this.enqueueAudio('mythic-attack-1-1', 'mythic-attack-01-1.mp3');
        this.enqueueAudio('mythic-attack-1-2', 'mythic-attack-01-1.mp3');
        this.enqueueAudio('mythic-attack-1-3', 'mythic-attack-01-1.mp3');
        this.enqueueAudio('mythic-die-1-1', 'mythic-die-01.mp3');
    }

    private registerManifestResources(manifest: ResourceManifest) {
        // The manifest URLs are relative to the server, not to the assets folder of the base files.
        this.load.setPath('');
        for (const resource of manifest.fixed) {
            this.enqueueImage(resource.key, resource.url);
        }

        // The dynamic resources are downloaded when a card is shown, so only their URLs are kept.
        for (const resource of manifest.dynamic) {
            this.registry.set(resource.key, resource.url);
        }
    }

    private enqueueImage(key: string, path: string) {
        this.totalItemsToLoad++;
        this.load.image(key, path);
    }

    private enqueueAudio(key: string, path: string) {
        this.totalItemsToLoad++;
        this.load.audio(key, path);
    }

    private generateOverlays() {
        CalmTargetingOverlay.generateTexture(this);
    }

    private loadGameData() {
        const gameState = this.createGameState();
        StoreSystem.initializeGame(gameState);
    }

    // TODO remove this method and receive the game state from the GameEngine
    public createGameState(): GameState {
        const PLAYER_COUNT = this.playerCount;
        const gameConfiguration = new GameConfiguration('Code:1', 'CLASSIC', PLAYER_COUNT);
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

    create() {
        // Si no hubiera archivos pendientes por cargar en el loader, finalizamos directamente
        if (!this.load.isLoading() && this.totalItemsToLoad === 0) {
            this.onLoadingFinished();
        }
    }

    private async onLoadingFinished() {
        const gameConfiguration = StoreSystem.getGameConfiguration();
        if (gameConfiguration) {
            await gameApi.sendReady(gameConfiguration.gameCode);
        } else {
            console.error("No game configuration found in StoreSystem");
            this.scene.start('MainMenu');
        }
    }
}

export { GameLoadScene as GameLoad }
export type { GameLoadScene }
import { Scene } from 'phaser';
import Zone from '@/domain/Zone';
import Player from '@/domain/Player';
import cardFactory from '@/domain/cardFactory';
import StoreSystem, { GameState } from '@/core/StoreSystem';
import CalmTargetingOverlay from '@/game/perspectives/overlays/CalmTargetingOverlay';
import GameConfiguration from '@/domain/GameConfiguration';
import Battlefield from '@/domain/Battlefield';
import { DEFAULT_SKIN } from '@/domain/BattlefieldSkin';
import { gameApi } from '@/api';

class GameLoadScene extends Scene {
    private playerCount: number = 2;
    private alreadyProcessed: boolean = false;

    constructor() {
        super('GameLoad');
    }

    init(data: { playerCount?: number }) {
        if (data?.playerCount) {
            this.playerCount = data.playerCount;
        }

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload() {
        if (!this.alreadyProcessed) {
            this.loadAssets();
            this.generateOverlays();
        }

        this.loadGameData();
        this.alreadyProcessed = true;
    }

    private loadAssets() {
        this.load.setPath('assets');
        this.load.image('unknown', 'unknown.png');

        this.load.image('statistic-icon_unknown', 'unknown.png');
        this.load.image('statistic-icon_true_damage', 'true_sword.png');
        this.load.image('statistic-icon_physical_damage', 'sword.png');
        this.load.image('statistic-icon_magic_damage', 'staff.png');
        this.load.image('statistic-icon_physical_armor', 'shield.png');
        this.load.image('statistic-icon_magic_armor', 'magic_shield.png');
        this.load.image('statistic-icon_health', 'hearth.png');

        this.load.image('common-card', 'card-common.png');
        this.load.image('uncommon-card', 'card-uncommon.png');
        this.load.image('rare-card', 'card-rare.png');
        this.load.image('epic-card', 'card-epic.png');
        this.load.image('legendary-card', 'card-legendary.png');
        this.load.image('mithic-card', 'card-mithic.png');

        this.load.image('leader-card', 'card-leader.png');
        this.load.image('equipment-card', 'card-equipment.png');
        this.load.image('spell-card', 'card-spell.png');

        this.load.image('zoneslot-mark-warrior', 'warrior_mark.png');
        this.load.image('zoneslot-mark-leader', 'leader_mark.png');

        this.load.image('warrior-0', 'logo.png');
        this.load.image('common-1', 'common-01.png');
        this.load.audio('common-put-1-1', 'common-put-01.mp3');
        this.load.audio('common-attack-1-1', 'common-attack-01-1.mp3');
        this.load.audio('common-attack-1-2', 'common-attack-01-2.mp3');
        this.load.audio('common-attack-1-3', 'common-attack-01-3.mp3');
        this.load.audio('common-die-1-1', 'common-die-01.mp3');

        this.load.image('mithic-1', 'mithic-01.png');
        this.load.audio('mithic-put-1-1', 'mithic-put-01.mp3');
        this.load.audio('mithic-attack-1-1', 'mithic-attack-01-1.mp3');
        this.load.audio('mithic-attack-1-2', 'mithic-attack-01-1.mp3');
        this.load.audio('mithic-attack-1-3', 'mithic-attack-01-1.mp3');
        this.load.audio('mithic-die-1-1', 'mithic-die-01.mp3');
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
        const playerZone = new Zone(player, 'friendly', 'BASE');
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
            cardFactory.createWarriorCard({ rarity: 'COMMON', code: 1 }),
            cardFactory.createWarriorCard({ rarity: 'MITHIC', code: 1 }),
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
            const allyPlayerZone = new Zone(allyPlayer, 'friendly', 'BASE');
            zones.push(allyPlayerZone);
        }

        for (let i = 0; i < maxEnemies; i++) {
            const enemyPlayer = new Player(`Enemy:${i.toString()}`, `Enemy ${i}`);
            const enemyPlayerZone = new Zone(enemyPlayer, 'enemy', 'BASE');
            zones.push(enemyPlayerZone);
        }

        return zones;
    }

    async create() {
        const gameConfiguration = StoreSystem.getGameConfiguration();
        if (gameConfiguration) {
            await gameApi.sendReady(gameConfiguration.gameCode);
            this.scene.start('Game');
        } else {
            console.error("No game configuration found in StoreSystem");
            this.scene.start('MainMenu');
        }
    }
}

export { GameLoadScene as GameLoad }
export type { GameLoadScene }
import CardController from '@/controllers/CardController';
import CardViewFactory from '@/controllers/CardViewFactory';
import HandController from '@/controllers/HandController';
import ActionSystem from '@/core/ActionSystem';
import StoreSystem, { GameState } from '@/core/StoreSystem';
import ZoneView from '@/game/zone/ZoneView';
import ZoneViewFactory from '@/game/zone/ZoneViewFactory';
import { Scene } from 'phaser';
import * as Constants from '@/core/Constants';
import CameraSystem from '@/core/CameraSystem';
import BattlefieldView from '@/game/battlefield/BattlefieldView';
import Player from '@/domain/Player';
import Zone from '@/domain/Zone';
import Battlefield from '@/domain/Battlefield';
import GameConfiguration from '@/domain/GameConfiguration';
import * as ExternalStoreApi from "@/api/LocalStorageApi";
import { DEFAULT_SKIN } from '@/domain/BattlefieldSkin';

class GameScene extends Scene {
    public camera: Phaser.Cameras.Scene2D.Camera;
    public background: Phaser.GameObjects.Image;

    public readonly actionSystem: ActionSystem;
    public readonly cameraSystem: CameraSystem;
    public readonly cardController: CardController;
    public readonly handController: HandController;

    private battlefieldContainer: Phaser.GameObjects.Container;
    public zones: ZoneView[];

    public constructor() {
        super('Game');

        this.actionSystem = new ActionSystem('game-code');
        this.cameraSystem = new CameraSystem();

        this.cardController = new CardController(this);

        const cardViewFactory = new CardViewFactory(this.cardController);
        this.handController = new HandController(this, cardViewFactory);
    }

    public init() {
        const { width, height } = this.scale;
        this.battlefieldContainer = this.add.container(width / 2, height * 0.3);

        this.cameraSystem.initialize(this);
        this.cameraSystem.setupBattlefieldCamera(width / 2, height / 2);

        this.handController.init();
    }

    public create() {    
        this.input.dragDistanceThreshold = Constants.DRAG_DISTANCE_THRESHOLD;
        this.input.dragTimeThreshold = Constants.DRAG_TIME_THRESHOLD;
        this.input.setPollAlways();

        this.renderAll();
        this.createDebugUI();
    }

    private updateDebugUI = () => {};
    
    // TODO: Remove in production, for removal find commit with "remove_debug_ui"
    private createDebugUI() {
        const playerCount = StoreSystem.getGameConfiguration().playerCount;
        
        const uiContainer = this.add.container(0, 0);
        
        const playerCountText = this.add.text(0, 0, `Players: ${playerCount}`, { fontSize: '16px', color: '#fff' })
            .setScrollFactor(0);
        uiContainer.add(playerCountText);

        const decrementPlayerCountText = this.add.text(0, 24, '[ - ]', { fontSize: '24px', color: '#fff' })
            .setInteractive({ useHandCursor: true })
            .setScrollFactor(0)
            .on('pointerdown', () => this.scene.start('GameLoad', { playerCount: playerCount - 1 }));
        uiContainer.add(decrementPlayerCountText);

        const incrementPlayerCountText = this.add.text(68, 24, '[ + ]', { fontSize: '24px', color: '#fff' })
            .setInteractive({ useHandCursor: true })
            .setScrollFactor(0)
            .on('pointerdown', () => this.scene.start('GameLoad', { playerCount: playerCount + 1 }));
        uiContainer.add(incrementPlayerCountText);
        this.add.existing(uiContainer);

        this.updateDebugUI = () => {
            const halfWidth = uiContainer.width / 2;
            const halfHeight = uiContainer.height / 2;
            const position = this.cameraSystem.getHUDPosition(halfWidth, halfHeight);
            uiContainer.setScale(1 / this.cameraSystem.getCamera().zoom);
            uiContainer.setPosition(position.x, position.y);
        };
    }

    private renderAll() {
        this.renderHand();
        this.renderZones();
    }

    private renderHand() {
        this.handController.clearCards();
        this.handController.addCards(...StoreSystem.getPlayerHand());
    }

    private renderZones() {
        this.zones = [];
        this.battlefieldContainer.removeAll(true);

        const battlefield = StoreSystem.getBattlefield();
        const battlefieldView = new BattlefieldView(this, battlefield);
        this.battlefieldContainer.add(battlefieldView);

        const zoneViews = ZoneViewFactory.createAllZoneViews(this, battlefield);
        console.log("zoneviews", zoneViews);
        for (const zoneView of zoneViews) {
            this.zones.push(zoneView);
            this.battlefieldContainer.add(zoneView);
        }
    }

    public changeScene() {
        this.scene.start('GameOver');
    }

    override update(time: number, delta: number): void {
        super.update(time, delta);
        this.handController.update();
        this.updateDebugUI();

        const playerZone = StoreSystem.getPlayerZone();
        if (!playerZone.isAlive()) {
            this.scene.start('GameOver');
            return;
        }

        const player = StoreSystem.getPlayer();
        const othersZones = StoreSystem.getZones().filter(zone => zone.owner !== player);
        if (othersZones.length > 0 && othersZones.every(zone => !zone.isAlive())) {
            this.scene.start('GameOver');
            return;
        }
    }
}

export { GameScene }
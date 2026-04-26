import CardController from '@/controllers/CardController';
import CardViewFactory from '@/controllers/CardViewFactory';
import HandController from '@/controllers/HandController';
import ActionSystem from '@/core/ActionSystem';
import StoreSystem from '@/core/StoreSystem';
import ZoneView from '@/game/zone/ZoneView';
import { Scene } from 'phaser';
import * as Constants from '@/core/Constants';
import BattlefieldLayout, { PlayerPosition } from '@/core/BattlefieldLayout';
import CameraSystem from '@/core/CameraSystem';
import BattlefieldFloor from '@/game/board/BattlefieldFloor';
import Player from '@/domain/Player';
import Zone from '@/domain/Zone';

class GameScene extends Scene {
    public camera: Phaser.Cameras.Scene2D.Camera;
    public background: Phaser.GameObjects.Image;

    public readonly actionSystem: ActionSystem;
    public readonly cardController: CardController;
    public readonly handController: HandController;

    private battlefield: Phaser.GameObjects.Container;
    private cameraSystem: CameraSystem;
    public zones: ZoneView[];

    public constructor() {
        super('Game');

        this.actionSystem = new ActionSystem('game-code');
        this.cardController = new CardController(this);

        const cardViewFactory = new CardViewFactory(this.cardController);
        this.handController = new HandController(this, cardViewFactory);
    }

    public init() {
        this.handController.init();
    }

    public create() {    
        this.input.dragDistanceThreshold = Constants.DRAG_DISTANCE_THRESHOLD;
        this.input.dragTimeThreshold = Constants.DRAG_TIME_THRESHOLD;
        this.input.setPollAlways();
        
        const { width, height } = this.scale;

        this.battlefield = this.add.container(width / 2, height * 0.42);
        
        this.cameraSystem = new CameraSystem(this);
        this.cameraSystem.setupBattlefieldCamera(width / 2, height / 2);

        this.renderAll();
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
        this.battlefield.removeAll(true);

        const floor = new BattlefieldFloor(this);
        this.battlefield.add(floor);

        const positions = [
            PlayerPosition.BOTTOM,
            PlayerPosition.TOP,
            PlayerPosition.LEFT,
            PlayerPosition.RIGHT
        ];

        const zones = this.getOrMockZones();

        positions.forEach((pos, index) => {
            const zoneData = zones[index];
            if (!zoneData) return;

            const layout = BattlefieldLayout.getPlayerLayout(pos);
            const zoneView = new ZoneView(this, zoneData, layout);
            
            this.zones.push(zoneView);
            this.battlefield.add(zoneView);
        });
    }

    private getOrMockZones(): Zone[] {
        let zones = StoreSystem.getZones();
        if (zones.length === 0) {
            const players = [
                StoreSystem.getPlayer(),
                new Player('p2', 'Opponent 1'),
                new Player('p3', 'Opponent 2'),
                new Player('p4', 'Opponent 3')
            ];
            zones = players.map(p => new Zone(p, 'BASE'));
        }
        return zones;
    }

    public changeScene() {
        this.scene.start('GameOver');
    }

    override update(time: number, delta: number): void {
        super.update(time, delta);

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
import CardController from '@/controllers/CardController';
import CardViewFactory from '@/controllers/CardViewFactory';
import HandController from '@/controllers/HandController';
import ActionSystem from '@/core/ActionSystem';
import StoreSystem from '@/core/StoreSystem';
import ZoneView from '@/game/zone/ZoneView';
import { Scene } from 'phaser';
import * as Constants from '@/core/Constants';
import CameraSystem from '@/core/CameraSystem';
import BattlefieldView from '@/game/battlefield/BattlefieldView';
import Player from '@/domain/Player';
import Zone from '@/domain/Zone';
import CardView from '@/game/cards/CardView';
import { BattlefieldSide, MAX_PLAYERS_PER_BATTLEFIELD_SIDE } from '@/domain/Battlefield';

class GameScene extends Scene {
    public camera: Phaser.Cameras.Scene2D.Camera;
    public background: Phaser.GameObjects.Image;

    public readonly actionSystem: ActionSystem;
    public readonly cardController: CardController;
    public readonly handController: HandController;

    private battlefieldContainer: Phaser.GameObjects.Container;
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

        this.battlefieldContainer = this.add.container(width / 2, height * 0.3);
        
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
        this.battlefieldContainer.removeAll(true);

        const battlefield = StoreSystem.getBattlefield();
        const battlefieldView = new BattlefieldView(this, battlefield);
        this.battlefieldContainer.add(battlefieldView);
        
        const battlefieldSides = [
            BattlefieldSide.BOTTOM,
            BattlefieldSide.TOP,
            BattlefieldSide.LEFT,
            BattlefieldSide.RIGHT
        ];

        const zones = this.getOrMockZones();
        let zoneIdx = 0;

        battlefieldSides.forEach((side) => {
            for (let i = 0; i < MAX_PLAYERS_PER_BATTLEFIELD_SIDE; i++) {
                const zoneData = zones[zoneIdx++];
                if (!zoneData) continue;

                const zoneView = new ZoneView(this, zoneData, {
                    position: battlefield.getPlayerZonePosition(side, i),
                    rotation: battlefield.getRotationForSide(side),
                    slotSize: CardView.SIZE
                });

                this.zones.push(zoneView);
                this.battlefieldContainer.add(zoneView);
            }
        });

    }

    private getOrMockZones(): Zone[] {
        let zones = StoreSystem.getZones();
        const totalNeeded = 4 * MAX_PLAYERS_PER_BATTLEFIELD_SIDE;

        if (zones.length < totalNeeded) {
            const players: Player[] = [];
            // First player is the user
            players.push(StoreSystem.getPlayer());
            
            // Add opponents
            for (let i = 1; i < totalNeeded; i++) {
                players.push(new Player(`p${i+1}`, `Opponent ${i}`));
            }
            zones = players.map(p => new Zone(p, 'BASE'));
        }
        return zones;
    }


    public changeScene() {
        this.scene.start('GameOver');
    }

    override update(time: number, delta: number): void {
        super.update(time, delta);

        if (this.cameraSystem) {
            this.cameraSystem.update(delta);
        }

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
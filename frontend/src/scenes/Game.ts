import HandController from '@/controllers/HandController';
import ActionSystem from '@/core/ActionSystem';
import StoreSystem from '@/core/StoreSystem';
import { CardView } from '@/game/cards/CardView';
import HandView from '@/game/hand/HandView';
import ZoneView from '@/game/ZoneView';
import { Scene } from 'phaser';

class GameScene extends Scene {
    public camera: Phaser.Cameras.Scene2D.Camera;
    public background: Phaser.GameObjects.Image;

    public readonly actionSystem: ActionSystem;

    public readonly handController: HandController;

    public zones: ZoneView[];

    public constructor() {
        super('Game');
        this.actionSystem = new ActionSystem(this, 'game-code');

        this.handController = new HandController(this);
    }

    public create() {    
        this.input.dragDistanceThreshold = 10;
        this.camera = this.cameras.main;

        this.handController.addCards(...StoreSystem.getPlayerHand());

        const zoneView = new ZoneView(this, 1300, 150, StoreSystem.getPlayerZone());
        this.zones = [];
        this.zones.push(zoneView);
        this.children.add(zoneView);

        this.children.add(this.add.rectangle(1300, 200, 1, 1, 0xFFFFFF, 0.5).setStrokeStyle(1, 0x000000));
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
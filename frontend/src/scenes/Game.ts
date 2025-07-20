import ActionSystem from '@/core/ActionSystem';
import StoreSystem from '@/core/StoreSystem';
import { CardView } from '@/game/cards/CardView';
import HandView from '@/game/HandView';
import ZoneView from '@/game/ZoneView';
import { Scene } from 'phaser';

class GameScene extends Scene {
    public camera: Phaser.Cameras.Scene2D.Camera;
    public background: Phaser.GameObjects.Image;

    public readonly actionSystem: ActionSystem;

    public zones: ZoneView[];

    public constructor() {
        super('Game');
        this.actionSystem = new ActionSystem(this, 'game-code');
    }

    public create() {    
        this.input.dragDistanceThreshold = 10;

        this.camera = this.cameras.main;

        
        const cardXOutOfVision = this.camera.x - CardView.WIDTH;
        const cardYOutOfVision = this.camera.y - CardView.HEIGHT;
        
        const cards: CardView[] = [];
        for (const card of StoreSystem.getPlayerHand()) {
            cards.push(new CardView(this, cardXOutOfVision, cardYOutOfVision, card));
        }
        
        const handView = new HandView(this);
        handView.addCards(...cards);
        this.children.add(handView);


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
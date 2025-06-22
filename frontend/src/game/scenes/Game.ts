import ActionSystem from '@/core/ActionSystem';
import InteractionSystem from '@/core/InteractionSystem';
import VisualEffectSystem from '@/core/VisualEffectSystem';
import ActionEvent from '@/domain/ActionEvent';
import cardFactory from '@/domain/cardFactory';
import Player from '@/domain/Player';
import { CardView } from '@/game/cards/CardView';
import ZoneView from '@/game/zone/ZoneView';
import { Scene } from 'phaser';

class GameScene extends Scene {
    public camera: Phaser.Cameras.Scene2D.Camera;
    public background: Phaser.GameObjects.Image;

    public readonly actionSystem: ActionSystem;
    public readonly visualEffectSystem: VisualEffectSystem;
    public readonly interactionSystem: InteractionSystem;

    public zones: ZoneView[];

    public constructor() {
        super('Game');
        this.actionSystem = new ActionSystem(this, 'game-code');
        this.visualEffectSystem = new VisualEffectSystem(this);
        this.interactionSystem = new InteractionSystem(this);
    }

    public create() {
        console.log(new ActionEvent({
            element: 'Hand.Card',
            input: 'DoubleClick',
            position: null,
            player: new Player("none", "DainWs"),
            card: null
        }));

        this.camera = this.cameras.main;

        for (let i = 0; i < 5; i++) {
            const x = (200 + 10) * i;
        
            const card = new CardView(this, 150 + x, 200, cardFactory.createWarriorCard({}));
            this.children.add(card);
        }

        const zone = new ZoneView(this, 1300, 150);
        this.zones = [];
        this.zones.push(zone);
        this.children.add(zone);

        this.add.rectangle(150, 200, 1, 1, 0xFF0000, 0.5).setStrokeStyle(1, 0x000000);
    }

    public changeScene() {
        this.scene.start('GameOver');
    }
}

export { GameScene as Game }
export type { GameScene }
import Battlefield from '@/domain/Battlefield';
import BattlefieldViewStrategy from '@/game/battlefield/BattlefieldViewStrategy';
import { dispatchBattlefieldViewStrategy } from '@/game/battlefield/BattlefieldViewStrategyDispatcher';

class BattlefieldView extends Phaser.GameObjects.Graphics {
    private battlefield: Battlefield;
    private battlefieldViewStrategy: BattlefieldViewStrategy;

    constructor(scene: Phaser.Scene, battlefield: Battlefield) {
        super(scene);
        this.battlefield = battlefield;
        this.battlefieldViewStrategy = dispatchBattlefieldViewStrategy(battlefield);
        this.setDepth(-10000);
        this.render();
        scene.add.existing(this);
    }

    private render() {
        this.battlefieldViewStrategy.render(this, this.battlefield);
    }

}

export default BattlefieldView;

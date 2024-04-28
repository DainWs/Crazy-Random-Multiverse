import Owner from '@/domain/models/Player';
import Combatant from '@/domain/models/Card';

class Zone {
    public health: Number;
    public maxHealth: Number;
    public owner: Owner;
    public combatants: Combatant[][];

    public constructor(owner: Owner) {
        this.health = 0;
        this.maxHealth = 0;
        this.owner = owner;
        this.combatants = new Array();
    }

    public isPlayerOwner(player: Owner): boolean {
        return this.owner.code === player.code;
    }
}

export default Zone;
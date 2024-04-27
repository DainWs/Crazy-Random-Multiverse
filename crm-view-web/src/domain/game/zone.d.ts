import { Player as Owner } from '@/domain/game/player';
import { Card as Combatant } from '@/domain/game/card';

export type Zone = {
    health: Number,
    maxHealth: Number,
    owner: Owner,
    combatants: Combatant[][]
};

export declare function isPlayerOwnerOfZone(player: Owner, zone: Zone) : boolean; 
import Owner from '@/domain/models/Player';
import Combatant from '@/domain/models/Card';
import { ZonePosition } from '@/domain/models/Position';

class Zone {
  public health: number;
  public maxHealth: number;
  public owner: Owner;
  public combatants: Combatant[][];

  public constructor(owner: Owner) {
    this.health = 0;
    this.maxHealth = 0;
    this.owner = owner;
    this.combatants = new Array();
  }

  public isPlayerOwner(player: Owner | null): boolean {
    if (!player) return false;
    return this.owner.code === player.code;
  }

  public isEnabledPosition(position: ZonePosition) {
    if (!this.hasLeaderInBoard()) {
      return position.row == 0 && position.column == 0;
    }

    if (!this.isPreviousLineFull(position.row)) {
      return false;
    }

    return !this.hasCombatant(position);
  }

  private hasLeaderInBoard() {
    const combatant = this.combatants[0][0];
    return combatant?.isType('LEADER')
  }

  private isPreviousLineFull(row: number) {
    const previousRow = row - 1;
    if (previousRow <= 0) {
      return true;
    }

    return this.isLineFull(previousRow);
  }

  private isLineFull(row: number) {
    return !this.combatants[row].every(combatant => combatant != null);
  }

  private hasCombatant(position: ZonePosition) {
    return this.combatants[position.row][position.column] != null;
  }
}

export default Zone;

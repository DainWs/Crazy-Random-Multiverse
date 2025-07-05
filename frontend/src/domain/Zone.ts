import Owner, { PlayerCode } from '@/domain/Player';
import { ZonePosition } from '@/domain/Position';
import { ZoneOrganizationsType, getZoneOrganization } from '@/domain/ZoneOrganizations';
import ZoneSlot, { AllowedCombatant } from '@/domain/ZoneSlot';

class Zone {
  public readonly owner: Owner;
  public readonly type: ZoneOrganizationsType;
  public health: number;
  public maxHealth: number;
  public slots: ZoneSlot[][];

  public constructor(owner: Owner, type: ZoneOrganizationsType = 'BASE') {
    this.owner = owner;
    this.type = type;

    this.health = 0;
    this.maxHealth = 0;
    this.slots = new Array();

    this.initializeSlots();
  }

  private initializeSlots() {
    const organization = getZoneOrganization(this.type);
    for (const row of organization) {
      this.slots[row.index] = [];

      for (let column = 0; column < row.columnCount; column++) {
        const position = new ZonePosition(row.index, column);
        const zoneSlot = new ZoneSlot(position, row.allowedCombatant as AllowedCombatant);
        this.slots[row.index][column] = zoneSlot;
      }
    }
  }

  public isAlive() {
    if (this.health === 0 && this.maxHealth === 0) {
      return true;
    }

    return this.maxHealth > 0 && this.health > 0;
  }

  public isPlayerOwner(playerIdentifier: Owner | PlayerCode): boolean {
    if (playerIdentifier instanceof Owner) {
      return this.owner.code == playerIdentifier.code;
    }
  
    return this.owner.code == playerIdentifier;
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
    if (this.type === 'NO_LEADER') {
      return false;
    }

    return this.slots[0][0]?.combatant?.isType('LEADER');
  }

  private isPreviousLineFull(row: number) {
    const previousRow = row - 1;
    if (previousRow <= 0) {
      return true;
    }

    return this.isLineFull(previousRow);
  }

  private isLineFull(row: number) {
    return !this.slots[row].every(slot => slot.combatant != null);
  }

  private hasCombatant(position: ZonePosition) {
    return this.slots[position.row][position.column]?.combatant != null;
  }

  public getMaxColumns() {
    return this.slots.reduce((max, row) => Math.max(max, row.length), 0);
  }
}

export default Zone;

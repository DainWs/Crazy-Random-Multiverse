import Owner, { PlayerCode } from '@/domain/Player';
import type Card from '@/domain/Card';
import { ZonePosition } from '@/domain/Position';
import Team from '@/domain/Team';
import { ZoneOrganizationsType, getZoneOrganization } from '@/domain/ZoneOrganizations';
import ZoneSlot, { AllowedCombatant } from '@/domain/ZoneSlot';

type ZoneId = string;

class Zone {
  public readonly code: ZoneId;
  public readonly owner: Owner;
  public readonly type: ZoneOrganizationsType;
  public team: Team;
  public health: number;
  public maxHealth: number;
  public slots: ZoneSlot[][];

  public constructor(owner: Owner, team: Team, type: ZoneOrganizationsType = 'BASE') {
    this.code = owner.code;
    this.owner = owner;
    this.type = type;
    this.team = team;

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

  /** The player places cards in their own zone, and a warrior goes to a row only while the row towards the leader is filled (BOARD-5, EQUIP-3); the rows are numbered from the center (VIEW-1). */
  public canPlaceCard(position: ZonePosition, card: Card, player: Owner): boolean {
    const slot = this.slots[position.row]?.[position.column];
    const isOwnZone = this.isPlayerOwner(player.code);
    const slotAcceptsCard = slot !== undefined && slot.canPlaceCard(card);
    const isRowAllowed = !card.isCombatant() || this.isRowTowardsLeaderFilled(position.row);

    return isOwnZone && slotAcceptsCard && isRowAllowed;
  }

  /** A warrior moves inside the zone of the player to a free slot of an allowed row, checked with the card still in its origin, or swaps places with another warrior (BOARD-7). */
  public canMoveCard(source: ZoneSlot, target: ZoneSlot, player: Owner): boolean {
    const isOwnZone = this.isPlayerOwner(player.code);
    const areSlotsOfThisZone = this.hasSlot(source) && this.hasSlot(target);
    const isWarriorSlot = target.allowedCombatant === 'WARRIOR';
    const isReachable = target.isOccupied() || this.isRowTowardsLeaderFilled(target.position.row);

    return isOwnZone && areSlotsOfThisZone && source !== target && this.isMovable(source) && isWarriorSlot && isReachable;
  }

  private hasSlot(slot: ZoneSlot): boolean {
    return this.slots.some((row) => row.includes(slot));
  }

  private isMovable(slot: ZoneSlot): boolean {
    const isOccupied = slot.isOccupied();
    const isLeader = slot.combatant?.isType('LEADER') === true;

    return isOccupied && !isLeader;
  }

  private isRowTowardsLeaderFilled(row: number): boolean {
    const rowTowardsLeader = this.slots[row + 1];
    const isLeaderRow = rowTowardsLeader === undefined;

    return isLeaderRow || rowTowardsLeader.every((slot) => slot.isOccupied());
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

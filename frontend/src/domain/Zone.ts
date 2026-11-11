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

    return this.isPlayerOwner(player.code)
      && slot !== undefined
      && slot.canPlaceCard(card)
      && (!card.isCombatant() || this.isRowTowardsLeaderFilled(position.row));
  }

  /** A warrior moves inside the zone of the player to a free slot of an allowed row, checked with the card still in its origin, or swaps places with another warrior (BOARD-7). */
  public canMoveCard(source: ZoneSlot, target: ZoneSlot, player: Owner): boolean {
    return this.isPlayerOwner(player.code)
      && this.hasSlot(source)
      && this.hasSlot(target)
      && source !== target
      && this.isMovable(source)
      && target.allowedCombatant === 'WARRIOR'
      && (target.isOccupied() || this.isRowTowardsLeaderFilled(target.position.row));
  }

  /** The player attacks from their own zone to an occupied slot of another player's zone, with the flags the server computed: the attacker `attackAvailable` and the target `targetable` (COMBAT-11, COMBAT-12, UI-5). */
  public canAttackCard(source: ZoneSlot, targetZone: Zone, target: ZoneSlot, player: Owner): boolean {
    return this.isPlayerOwner(player.code)
      && !targetZone.isPlayerOwner(player.code)
      && this.hasSlot(source)
      && source.combatant?.isAttackAvailable === true
      && targetZone.hasSlot(target)
      && target.combatant?.isTargetable === true;
  }

  private hasSlot(slot: ZoneSlot): boolean {
    return this.slots.some((row) => row.includes(slot));
  }

  private isMovable(slot: ZoneSlot): boolean {
    return slot.isOccupied()
      && slot.combatant?.isType('LEADER') !== true;
  }

  private isRowTowardsLeaderFilled(row: number): boolean {
    const rowTowardsLeader = this.slots[row + 1];
    return rowTowardsLeader === undefined
      || rowTowardsLeader.every((slot) => slot.isOccupied());
  }
}

export default Zone;

import { beforeEach, describe, expect, it } from 'vitest';
import Card, { CardCode, type CombatantCard, type EquipmentCard } from '@/domain/Card';
import Player from '@/domain/Player';
import { ZonePosition } from '@/domain/Position';
import Zone from '@/domain/Zone';
import ZoneSlot from '@/domain/ZoneSlot';

const WARRIOR_COLUMNS = 3;
const owner = new Player('p-1', 'One');

const createCard = (type: 'LEADER' | 'WARRIOR' | 'EQUIPMENT'): Card => {
  return new Card({ code: new CardCode('1', type), name: 'name', description: 'description', type, rarity: type === 'WARRIOR' ? 'COMMON' : undefined });
};

const createWarriorRow = (row: number, occupiedColumns: number): ZoneSlot[] => {
  return Array.from({ length: WARRIOR_COLUMNS }, (_, column) => {
    const slot = new ZoneSlot(new ZonePosition(row, column), 'WARRIOR');
    if (column < occupiedColumns) {
      slot.combatant = createCard('WARRIOR') as CombatantCard;
    }

    return slot;
  });
};

describe('Zone', () => {
  let zone: Zone;

  // The rows are numbered from the center: row 0 is the outermost, row 2 the leader row (VIEW-1)
  const createZone = (outerOccupied: number, innerOccupied: number): Zone => {
    const created = new Zone(owner, 'FRIENDLY');
    const leaderSlot = new ZoneSlot(new ZonePosition(2, 0), 'LEADER');
    leaderSlot.combatant = createCard('LEADER') as CombatantCard;
    created.slots = [createWarriorRow(0, outerOccupied), createWarriorRow(1, innerOccupied), [leaderSlot]];
    return created;
  };

  describe('canPlaceCard', () => {
    beforeEach(() => {
      zone = createZone(0, 0);
    });

    // BOARD-5
    it('accepts a warrior in the row next to the leader', () => {
      expect(zone.canPlaceCard(new ZonePosition(1, 0), createCard('WARRIOR'), owner)).toBe(true);
    });

    it('rejects a warrior in the outer row while the inner row is not filled', () => {
      expect(zone.canPlaceCard(new ZonePosition(0, 0), createCard('WARRIOR'), owner)).toBe(false);
    });

    it('accepts a warrior in the outer row once the inner row is filled', () => {
      zone = createZone(0, WARRIOR_COLUMNS);

      expect(zone.canPlaceCard(new ZonePosition(0, 0), createCard('WARRIOR'), owner)).toBe(true);
    });

    it('rejects a warrior in the outer row when a gap opens in the inner row', () => {
      zone = createZone(1, WARRIOR_COLUMNS);
      zone.slots[1][1].combatant = null;

      expect(zone.canPlaceCard(new ZonePosition(0, 1), createCard('WARRIOR'), owner)).toBe(false);
    });

    it('rejects an occupied slot', () => {
      zone = createZone(0, 1);

      expect(zone.canPlaceCard(new ZonePosition(1, 0), createCard('WARRIOR'), owner)).toBe(false);
    });

    // EQUIP-3
    it('rejects a slot of the zone of another player', () => {
      const otherPlayer = new Player('p-2', 'Two');

      expect(zone.canPlaceCard(new ZonePosition(1, 0), createCard('WARRIOR'), otherPlayer)).toBe(false);
    });

    it('rejects a position outside the zone', () => {
      expect(zone.canPlaceCard(new ZonePosition(5, 0), createCard('WARRIOR'), owner)).toBe(false);
    });

    it('rejects a warrior in the leader slot', () => {
      zone.slots[2][0].combatant = null;

      expect(zone.canPlaceCard(new ZonePosition(2, 0), createCard('WARRIOR'), owner)).toBe(false);
    });

    // EQUIP-3
    it('accepts equipment on an occupied slot', () => {
      zone = createZone(0, 1);

      expect(zone.canPlaceCard(new ZonePosition(1, 0), createCard('EQUIPMENT'), owner)).toBe(true);
    });

    it('rejects equipment on an empty slot', () => {
      zone = createZone(0, 1);

      expect(zone.canPlaceCard(new ZonePosition(1, 1), createCard('EQUIPMENT'), owner)).toBe(false);
    });

    // EQUIP-4
    it('accepts a second piece of equipment on a card that already has one', () => {
      zone = createZone(0, 1);
      zone.slots[1][0].combatant!.equipment = [createCard('EQUIPMENT') as EquipmentCard];

      expect(zone.canPlaceCard(new ZonePosition(1, 0), createCard('EQUIPMENT'), owner)).toBe(true);
    });
  });

  describe('canMoveCard', () => {
    // BOARD-7
    it('accepts a move to a free slot of a row whose previous row is filled', () => {
      zone = createZone(1, 2);

      expect(zone.canMoveCard(zone.slots[1][0], zone.slots[1][2], owner)).toBe(true);
    });

    it('rejects a move to a free slot of a row whose previous row is not filled', () => {
      zone = createZone(0, 2);

      expect(zone.canMoveCard(zone.slots[1][0], zone.slots[0][0], owner)).toBe(false);
    });

    it('accepts a move that leaves a gap behind', () => {
      zone = createZone(0, WARRIOR_COLUMNS);

      expect(zone.canMoveCard(zone.slots[1][1], zone.slots[0][0], owner)).toBe(true);
    });

    it('accepts a swap with another warrior', () => {
      zone = createZone(1, 1);

      expect(zone.canMoveCard(zone.slots[0][0], zone.slots[1][0], owner)).toBe(true);
    });

    it('rejects a move in the zone of another player', () => {
      zone = createZone(0, 2);
      const otherPlayer = new Player('p-2', 'Two');

      expect(zone.canMoveCard(zone.slots[1][0], zone.slots[1][2], otherPlayer)).toBe(false);
    });

    it('rejects a move to a slot of another zone', () => {
      zone = createZone(0, 2);
      const otherZone = createZone(0, 2);

      expect(zone.canMoveCard(zone.slots[1][0], otherZone.slots[1][2], owner)).toBe(false);
    });

    it('rejects moving the leader', () => {
      zone = createZone(0, 1);

      expect(zone.canMoveCard(zone.slots[2][0], zone.slots[1][1], owner)).toBe(false);
    });

    it('rejects swapping with the leader', () => {
      zone = createZone(0, 1);

      expect(zone.canMoveCard(zone.slots[1][0], zone.slots[2][0], owner)).toBe(false);
    });

    it('rejects moving a card to its own slot', () => {
      zone = createZone(0, 1);

      expect(zone.canMoveCard(zone.slots[1][0], zone.slots[1][0], owner)).toBe(false);
    });

    it('rejects moving from an empty slot', () => {
      zone = createZone(0, 1);

      expect(zone.canMoveCard(zone.slots[1][2], zone.slots[1][1], owner)).toBe(false);
    });
  });

  describe('canAttackCard', () => {
    const rival = new Player('p-2', 'Two');
    let rivalZone: Zone;

    beforeEach(() => {
      zone = createZone(1, 1);
      rivalZone = new Zone(rival, 'ENEMY');
      rivalZone.slots = [createWarriorRow(0, 1), createWarriorRow(1, 1), [new ZoneSlot(new ZonePosition(2, 0), 'LEADER')]];
    });

    // COMBAT-11, COMBAT-12
    it('accepts an attack from an own card to a card of another player', () => {
      expect(zone.canAttackCard(zone.slots[0][0], rivalZone, rivalZone.slots[0][0], owner)).toBe(true);
    });

    it('rejects an attack from the zone of another player', () => {
      expect(zone.canAttackCard(zone.slots[0][0], rivalZone, rivalZone.slots[0][0], rival)).toBe(false);
    });

    it('rejects an attack on an own card', () => {
      expect(zone.canAttackCard(zone.slots[0][0], zone, zone.slots[1][0], owner)).toBe(false);
    });

    it('rejects an attack on an empty slot', () => {
      expect(zone.canAttackCard(zone.slots[0][0], rivalZone, rivalZone.slots[0][2], owner)).toBe(false);
    });

    it('rejects an attack from an empty slot', () => {
      expect(zone.canAttackCard(zone.slots[0][2], rivalZone, rivalZone.slots[0][0], owner)).toBe(false);
    });

    it('rejects an attack on a slot that is not in the target zone', () => {
      expect(zone.canAttackCard(zone.slots[0][0], rivalZone, createZone(1, 1).slots[0][0], owner)).toBe(false);
    });
  });
});

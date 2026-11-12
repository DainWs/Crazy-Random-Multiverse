import { describe, expect, it } from 'vitest';
import ZoneLayout from '@/game/zone/ZoneLayout';
import Battlefield, { BattlefieldSide } from '@/domain/Battlefield';
import { DEFAULT_SKIN } from '@/domain/BattlefieldSkin';
import type { Point2D } from '@/domain/Geometry';

describe('ZoneLayout', () => {
  const createMockBattlefield = (friendlyCount = 0, enemyCount = 0) => {
    return {
      playerSpacing: 900,
      getSideSize: () => 3200,
      skin: DEFAULT_SKIN,
      friendlyZones: new Array(friendlyCount).fill({}),
      enemyZones: new Array(enemyCount).fill({})
    } as unknown as Battlefield;
  };

  const ENEMY_SIDES = [BattlefieldSide.TOP, BattlefieldSide.LEFT, BattlefieldSide.RIGHT];

  describe('distribution across sides', () => {
    it('allocates main player on BOTTOM side when 0 friends and 0 enemies', () => {
      const battlefield = createMockBattlefield(0, 0);
      const layout = new ZoneLayout(battlefield, ENEMY_SIDES);

      // Bottom has 1 (the main player)
      const bottomPos = layout.getPlayerZonePosition(BattlefieldSide.BOTTOM, 0);
      expect(bottomPos.x).toBe(0);
      // y = halfWidth - offset = 1600 - (100*2 + 470) = 1600 - 670 = 930
      expect(bottomPos.y).toBe(930);
    });

    // VIEW-13
    it('seats the rivals clockwise from the left, starting with the one that plays next', () => {
      const battlefield = createMockBattlefield(0, 3);
      const layout = new ZoneLayout(battlefield, ENEMY_SIDES);

      const enemy0 = layout.getNextEnemyZonePosition(0);
      const enemy1 = layout.getNextEnemyZonePosition(1);
      const enemy2 = layout.getNextEnemyZonePosition(2);

      // The first rival is on the LEFT side, the second on the TOP one and the third on the RIGHT one
      expect([enemy0.x, enemy1.y, enemy2.x]).toEqual([-930, -930, 930]);
    });
  });

  describe('getEnemySide', () => {
    // VIEW-13
    it.each([
      { enemyCount: 1, expected: ['top'] },
      { enemyCount: 2, expected: ['left', 'top'] },
      { enemyCount: 4, expected: ['left', 'top', 'top', 'right'] },
      { enemyCount: 9, expected: ['left', 'left', 'left', 'top', 'top', 'top', 'right', 'right', 'right'] }
    ])('gives the sides $expected to $enemyCount rivals', ({ enemyCount, expected }) => {
      const layout = new ZoneLayout(createMockBattlefield(0, enemyCount), ENEMY_SIDES);

      const sides = Array.from({ length: enemyCount }, (_, index) => layout.getEnemySide(index));

      expect(sides).toEqual(expected);
    });
  });

  describe('turn order on a side', () => {
    // VIEW-13
    it('goes from the bottom to the top on the left side', () => {
      const layout = new ZoneLayout(createMockBattlefield(0, 9), ENEMY_SIDES);

      const [first, second, third] = [0, 1, 2].map((index) => layout.getNextEnemyZonePosition(index));

      expect(first.y).toBeGreaterThan(second.y);
      expect(second.y).toBeGreaterThan(third.y);
    });

    // VIEW-13
    it('goes from the left to the right on the top side', () => {
      const layout = new ZoneLayout(createMockBattlefield(0, 9), ENEMY_SIDES);

      const [first, second, third] = [3, 4, 5].map((index) => layout.getNextEnemyZonePosition(index));

      expect(first.x).toBeLessThan(second.x);
      expect(second.x).toBeLessThan(third.x);
    });

    // VIEW-13
    it('goes from the top to the bottom on the right side', () => {
      const layout = new ZoneLayout(createMockBattlefield(0, 9), ENEMY_SIDES);

      const [first, second, third] = [6, 7, 8].map((index) => layout.getNextEnemyZonePosition(index));

      expect(first.y).toBeLessThan(second.y);
      expect(second.y).toBeLessThan(third.y);
    });
  });

  describe('getZoneScale', () => {
    // VIEW-2
    it('grows the zones when only two players share the table', () => {
      const layout = new ZoneLayout(createMockBattlefield(0, 1), ENEMY_SIDES);

      expect(layout.getZoneScale()).toBe(1.25);
    });

    // VIEW-2
    it.each([
      { description: 'no enemies', friendlyCount: 0, enemyCount: 0 },
      { description: 'zones on the left and right sides', friendlyCount: 0, enemyCount: 3 },
      { description: 'ten players', friendlyCount: 0, enemyCount: 9 }
    ])('keeps the base size with $description', ({ friendlyCount, enemyCount }) => {
      const layout = new ZoneLayout(createMockBattlefield(friendlyCount, enemyCount), ENEMY_SIDES);

      expect(layout.getZoneScale()).toBe(1);
    });

    // VIEW-2
    it('keeps the outer edge of the zones where it was', () => {
      const layout = new ZoneLayout(createMockBattlefield(0, 1), ENEMY_SIDES);

      const bottomPosition = layout.getPlayerZonePosition(BattlefieldSide.BOTTOM, 0);

      // 1600 - (100 * 2 + 470 * 1.25): the zone center moves in so that its outer edge stays at 1400
      expect(bottomPosition.y).toBe(812.5);
    });
  });

  describe('getNextBottomZonePosition', () => {
    it('skips the centerPlayerIndex for teammate slots', () => {
      const battlefield = createMockBattlefield(1, 0);
      const layout = new ZoneLayout(battlefield, ENEMY_SIDES);

      // centerPlayerIndex = 0, teammate index = 0 -> slotIndex should be index + 1 = 1
      const teammatePos = layout.getNextBottomZonePosition(0, 0);
      const slot1Pos = layout.getPlayerZonePosition(BattlefieldSide.BOTTOM, 1, 0);

      expect(teammatePos).toEqual(slot1Pos);
    });
  });

  describe('vertical offset calculation on LEFT and RIGHT sides', () => {
    it('uses linear offset when players on side is <= 2', () => {
      const battlefield = createMockBattlefield(0, 2);
      const layout = new ZoneLayout(battlefield, ENEMY_SIDES);

      const pos = layout.getPlayerZonePosition(BattlefieldSide.LEFT, 0);
      expect(pos.x).toBe(-930);
      expect(typeof pos.y).toBe('number');
    });

    it('calculates progressive offset when players on side is > 2', () => {
      // 9 enemies -> 3 on TOP, 3 on LEFT, 3 on RIGHT (> 2 per side)
      const battlefield = createMockBattlefield(0, 9);
      const layout = new ZoneLayout(battlefield, ENEMY_SIDES);

      const leftSlot0 = layout.getPlayerZonePosition(BattlefieldSide.LEFT, 0);
      const leftSlot1 = layout.getPlayerZonePosition(BattlefieldSide.LEFT, 1);
      const leftSlot2 = layout.getPlayerZonePosition(BattlefieldSide.LEFT, 2);

      expect(leftSlot0.y).toBeLessThan(leftSlot1.y);
      expect(leftSlot1.y).toBeLessThan(leftSlot2.y);
    });
  });
  // VIEW-2
  describe('layouts of 2 to 10 players', () => {
    const ZONE_WIDTH = 640;
    const ZONE_HEIGHT = 940;

    type Footprint = { name: string; left: number; right: number; top: number; bottom: number };

    /** The area a zone covers on the table: the zone is turned a quarter on the left and right sides. */
    const footprintOf = (name: string, center: Point2D, side: BattlefieldSide, scale: number): Footprint => {
      const isSideways = side === BattlefieldSide.LEFT || side === BattlefieldSide.RIGHT;
      const halfWidth = ((isSideways ? ZONE_HEIGHT : ZONE_WIDTH) * scale) / 2;
      const halfHeight = ((isSideways ? ZONE_WIDTH : ZONE_HEIGHT) * scale) / 2;

      return { name, left: center.x - halfWidth, right: center.x + halfWidth, top: center.y - halfHeight, bottom: center.y + halfHeight };
    };

    const footprintsOfLayout = (playerCount: number) => {
      const enemyCount = playerCount - 1;
      const sideSize = Battlefield.sideSizeForPlayerCount(Math.ceil(enemyCount / 3));
      const battlefield = { ...createMockBattlefield(0, enemyCount), getSideSize: () => sideSize } as unknown as Battlefield;
      const layout = new ZoneLayout(battlefield, ENEMY_SIDES);
      const scale = layout.getZoneScale();

      const own = footprintOf('own', layout.getPlayerZonePosition(BattlefieldSide.BOTTOM, 0, 0), BattlefieldSide.BOTTOM, scale);
      const rivals = Array.from({ length: enemyCount }, (_, index) => {
        return footprintOf(`rival ${index}`, layout.getNextEnemyZonePosition(index), layout.getEnemySide(index), scale);
      });

      return { footprints: [own, ...rivals], halfSide: sideSize / 2 };
    };

    const overlap = (first: Footprint, second: Footprint): boolean => {
      return first.left < second.right && second.left < first.right && first.top < second.bottom && second.top < first.bottom;
    };

    const counts = [2, 3, 4, 5, 6, 7, 8, 9, 10].map((playerCount) => ({ playerCount }));

    it.each(counts)('keeps every zone inside the table with $playerCount players', ({ playerCount }) => {
      const { footprints, halfSide } = footprintsOfLayout(playerCount);

      const outside = footprints.filter((zone) => Math.min(zone.left, zone.top) < -halfSide || Math.max(zone.right, zone.bottom) > halfSide);

      expect(outside.map((zone) => zone.name)).toEqual([]);
    });

    it.each(counts)('overlaps no two zones with $playerCount players', ({ playerCount }) => {
      const { footprints } = footprintsOfLayout(playerCount);

      const overlapping = footprints.flatMap((zone, index) => {
        return footprints.slice(index + 1).filter((other) => overlap(zone, other)).map((other) => `${zone.name} and ${other.name}`);
      });

      expect(overlapping).toEqual([]);
    });
  });
});

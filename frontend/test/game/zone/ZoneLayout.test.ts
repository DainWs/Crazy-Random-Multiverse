import { describe, expect, it } from 'vitest';
import ZoneLayout from '@/game/zone/ZoneLayout';
import Battlefield, { BattlefieldSide } from '@/domain/Battlefield';
import { DEFAULT_SKIN } from '@/domain/BattlefieldSkin';

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

    it('distributes enemy players round-robin across sides', () => {
      const battlefield = createMockBattlefield(0, 3);
      const layout = new ZoneLayout(battlefield, ENEMY_SIDES);

      const enemy0 = layout.getNextEnemyZonePosition(0);
      const enemy1 = layout.getNextEnemyZonePosition(1);
      const enemy2 = layout.getNextEnemyZonePosition(2);

      // Enemy 0 should be on TOP side
      expect(enemy0.y).toBe(-930);
      // Enemy 1 should be on LEFT side
      expect(enemy1.x).toBe(-930);
      // Enemy 2 should be on RIGHT side
      expect(enemy2.x).toBe(930);
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
});

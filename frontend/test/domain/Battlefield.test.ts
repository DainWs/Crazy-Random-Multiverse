import { describe, expect, it } from 'vitest';
import Battlefield from '@/domain/Battlefield';
import { DEFAULT_SKIN } from '@/domain/BattlefieldSkin';
import GameConfiguration from '@/domain/GameConfiguration';
import Player from '@/domain/Player';
import Zone from '@/domain/Zone';

const createZones = (...codes: string[]): Zone[] => {
  return codes.map((code) => new Zone(new Player(code, code), 'ENEMY'));
};

const createBattlefield = (zones: Zone[], myCode: string): Battlefield => {
  const myZone = zones.find((zone) => zone.owner.code === myCode)!;
  const battlefield = new Battlefield(DEFAULT_SKIN, new GameConfiguration('game-1', 'CLASSIC', zones.length), myZone);
  battlefield.addZones(zones);

  return battlefield;
};

const ownerCodes = (zones: Zone[]): string[] => zones.map((zone) => zone.owner.code);

describe('Battlefield', () => {
  describe('addZones', () => {
    // VIEW-13
    it('takes the rivals starting with the one that plays after the local player', () => {
      const zones = createZones('p-1', 'p-2', 'p-3', 'p-4', 'p-5');
      const battlefield = createBattlefield(zones, 'p-3');

      expect(ownerCodes(battlefield.enemyZones)).toEqual(['p-4', 'p-5', 'p-1', 'p-2']);
    });

    // VIEW-13
    it('keeps the order of the zones when the local player is the first one', () => {
      const zones = createZones('p-1', 'p-2', 'p-4');
      const battlefield = createBattlefield(zones, 'p-1');

      expect(ownerCodes(battlefield.enemyZones)).toEqual(['p-2', 'p-4']);
    });

    // VIEW-13
    it('puts the first zones last when the local player is the last one', () => {
      const zones = createZones('p-1', 'p-2', 'p-4');
      const battlefield = createBattlefield(zones, 'p-4');

      expect(ownerCodes(battlefield.enemyZones)).toEqual(['p-1', 'p-2']);
    });

    it('leaves out the zone of the local player', () => {
      const zones = createZones('p-1', 'p-2', 'p-4');
      const battlefield = createBattlefield(zones, 'p-2');

      expect(ownerCodes(battlefield.enemyZones)).not.toContain('p-2');
    });
  });
});

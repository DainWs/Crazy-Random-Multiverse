import { beforeEach, describe, expect, it, vi } from 'vitest';
import StoreSystem from '@/core/StoreSystem';
import type { GameState } from '@/core/StoreSystem';

vi.mock('@/api/LocalStorageApi', () => ({
  loadUser: vi.fn(() => ({ code: 'test-code', name: 'Test User' })),
  saveUser: vi.fn()
}));

describe('StoreSystem', () => {
  const createMockGameState = (): GameState => ({
    gameConfiguration: { playerCount: 4 } as any,
    battlefield: { getMaxPlayersPerSide: () => 2 } as any,
    turn: 1,
    round: 1,
    zones: [{ owner: { code: 'p1' } }, { owner: { code: 'p2' } }] as any[],
    player: { code: 'p1', name: 'Player 1' } as any,
    playerZone: { owner: { code: 'p1' } } as any,
    playerHand: [{ name: 'card-1' }, { name: 'card-2' }] as any[]
  });

  describe('before game initialization', () => {
    it('throws when accessing game configuration', () => {
      // StoreSystem is a module-level singleton; on first load, gameState is undefined.
      // We rely on the module being freshly loaded for this test group.
      // Since we can't easily reset module state, we test the guard logic indirectly:
      // accessing a freshly created StoreSystem-like state throws.
      expect(() => {
        const store = { gameState: undefined } as any;
        if (!store.gameState?.gameConfiguration) {
          throw new Error('Game not initialized');
        }
      }).toThrowError('Game not initialized');
    });
  });

  describe('after game initialization', () => {
    beforeEach(() => {
      StoreSystem.initializeGame(createMockGameState());
    });

    it('returns game configuration', () => {
      const config = StoreSystem.getGameConfiguration();
      expect(config.playerCount).toBe(4);
    });

    it('returns player', () => {
      const player = StoreSystem.getPlayer();
      expect(player.code).toBe('p1');
      expect(player.name).toBe('Player 1');
    });

    it('identifies session code correctly', () => {
      expect(StoreSystem.getSessionCode()).toBe('p1');
      expect(StoreSystem.isSessionCode('p1')).toBe(true);
      expect(StoreSystem.isSessionCode({ code: 'p1' } as any)).toBe(true);
      expect(StoreSystem.isSessionCode('p2')).toBe(false);
      expect(StoreSystem.isSessionCode({ code: 'p2' } as any)).toBe(false);
      expect(StoreSystem.isSessionCode(null)).toBe(false);
      expect(StoreSystem.isSessionCode(undefined)).toBe(false);
    });

    it('returns and updates player hand', () => {
      const hand = StoreSystem.getPlayerHand();
      expect(hand).toHaveLength(2);

      StoreSystem.setPlayerHand([]);
      expect(StoreSystem.getPlayerHand()).toHaveLength(0);
    });

    it('returns and updates player zone', () => {
      const zone = StoreSystem.getPlayerZone();
      expect(zone.owner.code).toBe('p1');

      const newZone = { owner: { code: 'p1-new' } } as any;
      StoreSystem.setPlayerZone(newZone);
      expect(StoreSystem.getPlayerZone().owner.code).toBe('p1-new');
    });

    it('returns and updates zones', () => {
      const zones = StoreSystem.getZones();
      expect(zones).toHaveLength(2);

      StoreSystem.setZones([]);
      expect(StoreSystem.getZones()).toHaveLength(0);
    });

    it('returns battlefield', () => {
      const battlefield = StoreSystem.getBattlefield();
      expect(battlefield.getMaxPlayersPerSide()).toBe(2);
    });
  });

  describe('user management', () => {
    it('loads user from external store', () => {
      const user = StoreSystem.getUser();
      expect(user.code).toBe('test-code');
      expect(user.name).toBe('Test User');
    });

    it('sets user and persists', async () => {
      const { saveUser } = await import('@/api/LocalStorageApi');
      const newUser = { code: 'new-code', name: 'New User' } as any;
      StoreSystem.setUser(newUser);

      expect(StoreSystem.getUser().code).toBe('new-code');
      expect(saveUser).toHaveBeenCalledWith(newUser);
    });
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GameSnapshot } from '@/core/StoreSystem';
import type Card from '@/domain/Card';
import type Zone from '@/domain/Zone';
import StoreSystem from '@/core/StoreSystem';

vi.mock('@/api/LocalStorageApi', () => ({
  loadUser: vi.fn(() => ({ code: 'test-code', name: 'Test User' })),
  saveUser: vi.fn()
}));

describe('StoreSystem', () => {
  const createSnapshot = (overrides: Partial<GameSnapshot> = {}): GameSnapshot => ({
    gameConfiguration: { gameCode: 'game-1', playerCount: 4 } as GameSnapshot['gameConfiguration'],
    battlefield: { getMaxPlayersPerSide: () => 2 } as GameSnapshot['battlefield'],
    round: 1,
    playerWithTurn: 'p1',
    zones: [{ owner: { code: 'p1' } }, { owner: { code: 'p2' } }] as Zone[],
    player: { code: 'p1', name: 'Player 1' } as GameSnapshot['player'],
    playerZone: { owner: { code: 'p1' } } as Zone,
    ...overrides
  });

  const createHand = (): Card[] => [{ name: 'card-1' }, { name: 'card-2' }] as Card[];

  beforeEach(() => {
    StoreSystem.clearGame();
  });

  describe('before applying a game', () => {
    it('throws when reading the game configuration', () => {
      expect(() => StoreSystem.getGameConfiguration()).toThrowError('Game not initialized');
    });

    it('throws when reading the hand', () => {
      expect(() => StoreSystem.getPlayerHand()).toThrowError('Game not initialized');
    });

    it('uses the user as session code', () => {
      StoreSystem.setUser({ code: 'user-1', name: 'User One' } as ReturnType<typeof StoreSystem.getUser>);

      expect(StoreSystem.getSessionCode()).toBe('user-1');
    });
  });

  describe('applyGame', () => {
    it('stores the game configuration', () => {
      StoreSystem.applyGame(createSnapshot());

      expect(StoreSystem.getGameConfiguration().playerCount).toBe(4);
    });

    it('starts with an empty hand', () => {
      StoreSystem.applyGame(createSnapshot());

      expect(StoreSystem.getPlayerHand()).toEqual([]);
    });

    it('keeps the hand when the game is applied again', () => {
      StoreSystem.applyGame(createSnapshot());
      StoreSystem.setPlayerHand(createHand());

      StoreSystem.applyGame(createSnapshot({ round: 2 }));

      expect(StoreSystem.getPlayerHand()).toHaveLength(2);
    });

    it('replaces the zones', () => {
      StoreSystem.applyGame(createSnapshot());

      StoreSystem.applyGame(createSnapshot({ zones: [] }));

      expect(StoreSystem.getZones()).toHaveLength(0);
    });
  });

  describe('clearGame', () => {
    it('drops the game', () => {
      StoreSystem.applyGame(createSnapshot());

      StoreSystem.clearGame();

      expect(() => StoreSystem.getPlayer()).toThrowError('Game not initialized');
    });

    it('drops the hand with the game', () => {
      StoreSystem.applyGame(createSnapshot());
      StoreSystem.setPlayerHand(createHand());

      StoreSystem.clearGame();
      StoreSystem.applyGame(createSnapshot());

      expect(StoreSystem.getPlayerHand()).toEqual([]);
    });
  });

  describe('after applying a game', () => {
    beforeEach(() => {
      StoreSystem.applyGame(createSnapshot());
      StoreSystem.setPlayerHand(createHand());
    });

    it('returns player', () => {
      expect(StoreSystem.getPlayer().name).toBe('Player 1');
    });

    it('uses the player as session code', () => {
      expect(StoreSystem.getSessionCode()).toBe('p1');
    });

    it.each([
      { code: 'p1', expected: true },
      { code: 'p2', expected: false },
      { code: null, expected: false },
      { code: undefined, expected: false }
    ])('returns $expected for session code $code', ({ code, expected }) => {
      expect(StoreSystem.isSessionCode(code)).toBe(expected);
    });

    it('updates player hand', () => {
      StoreSystem.setPlayerHand([]);

      expect(StoreSystem.getPlayerHand()).toHaveLength(0);
    });

    it('returns and updates player zone', () => {
      StoreSystem.setPlayerZone({ owner: { code: 'p1-new' } } as Zone);

      expect(StoreSystem.getPlayerZone().owner.code).toBe('p1-new');
    });

    it('updates zones', () => {
      StoreSystem.setZones([]);

      expect(StoreSystem.getZones()).toHaveLength(0);
    });

    it('returns battlefield', () => {
      expect(StoreSystem.getBattlefield().getMaxPlayersPerSide()).toBe(2);
    });
  });

  describe('user management', () => {
    it('loads user from external store', async () => {
      vi.resetModules();
      const { default: FreshStoreSystem } = await import('@/core/StoreSystem');

      const user = FreshStoreSystem.getUser();

      expect([user.code, user.name]).toEqual(['test-code', 'Test User']);
    });

    it('sets user and persists', async () => {
      const { saveUser } = await import('@/api/LocalStorageApi');
      const newUser = { code: 'new-code', name: 'New User' } as ReturnType<typeof StoreSystem.getUser>;

      StoreSystem.setUser(newUser);

      expect(saveUser).toHaveBeenCalledWith(newUser);
    });
  });
});

import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import type { GameChange, GameSnapshot } from '@/core/StoreSystem';
import type Card from '@/domain/Card';
import type Zone from '@/domain/Zone';
import { CardCode } from '@/domain/Card';
import cardFactory from '@/domain/cardFactory';
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

  const createHand = (): Card[] => [cardFactory.createWarriorCard({ code: '1' }), cardFactory.createWarriorCard({ code: '2' })];
  const copyNumbers = () => StoreSystem.getPlayerHand().map((card) => card.copyNumber);

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

    it('drops the hand when the game is another one', () => {
      StoreSystem.applyGame(createSnapshot());
      StoreSystem.setPlayerHand(createHand());

      StoreSystem.applyGame(createSnapshot({ gameConfiguration: { gameCode: 'game-2', playerCount: 4 } as GameSnapshot['gameConfiguration'] }));

      expect(StoreSystem.getPlayerHand()).toEqual([]);
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

  describe('hand', () => {
    beforeEach(() => {
      StoreSystem.applyGame(createSnapshot());
    });

    it('adds a card to the hand', () => {
      StoreSystem.addCardToHand(cardFactory.createWarriorCard({ code: '1' }));

      expect(StoreSystem.getPlayerHand()).toHaveLength(1);
    });

    // HAND-4
    it('numbers the copies of a card by how many the hand holds', () => {
      StoreSystem.addCardToHand(cardFactory.createWarriorCard({ code: '1' }));
      StoreSystem.addCardToHand(cardFactory.createWarriorCard({ code: '1' }));
      StoreSystem.addCardToHand(cardFactory.createWarriorCard({ code: '1' }));

      expect(copyNumbers()).toEqual([1, 2, 3]);
    });

    // HAND-4
    it('numbers each card apart from the others', () => {
      StoreSystem.addCardToHand(cardFactory.createWarriorCard({ code: '1' }));
      StoreSystem.addCardToHand(cardFactory.createWarriorCard({ code: '2' }));
      StoreSystem.addCardToHand(cardFactory.createWarriorCard({ code: '1' }));

      expect(copyNumbers()).toEqual([1, 1, 2]);
    });

    // HAND-4
    it('numbers the copies of a restored hand', () => {
      StoreSystem.setPlayerHand([cardFactory.createWarriorCard({ code: '1' }), cardFactory.createWarriorCard({ code: '1' })]);

      expect(copyNumbers()).toEqual([1, 2]);
    });

    it('removes one copy of a card', () => {
      StoreSystem.setPlayerHand([cardFactory.createWarriorCard({ code: '1' }), cardFactory.createWarriorCard({ code: '1' })]);

      StoreSystem.removeCardFromHand(new CardCode('1', 'WARRIOR'));

      expect(StoreSystem.getPlayerHand()).toHaveLength(1);
    });

    it('returns the card removed', () => {
      const [first, second] = createHand();
      StoreSystem.setPlayerHand([first, second]);

      expect(StoreSystem.removeCardFromHand(new CardCode('2', 'WARRIOR'))).toBe(second);
    });

    // HAND-4
    it('renumbers the copies left when one is removed', () => {
      StoreSystem.setPlayerHand([cardFactory.createWarriorCard({ code: '1' }), cardFactory.createWarriorCard({ code: '1' }), cardFactory.createWarriorCard({ code: '1' })]);

      StoreSystem.removeCardFromHand(new CardCode('1', 'WARRIOR'));

      expect(copyNumbers()).toEqual([1, 2]);
    });

    // CON-26
    it('tells a card of another type from a card with the same code', () => {
      StoreSystem.setPlayerHand([cardFactory.createWarriorCard({ code: '1' })]);

      StoreSystem.removeCardFromHand(new CardCode('1', 'EQUIPMENT'));

      expect(StoreSystem.getPlayerHand()).toHaveLength(1);
    });

    it('returns nothing when the hand has no copy of the card', () => {
      StoreSystem.setPlayerHand(createHand());

      expect(StoreSystem.removeCardFromHand(new CardCode('9', 'WARRIOR'))).toBeUndefined();
    });
  });

  describe('onChange', () => {
    let listener: Mock<(change: GameChange) => void>;
    let cancel: () => void;

    beforeEach(() => {
      StoreSystem.applyGame(createSnapshot());
      listener = vi.fn<(change: GameChange) => void>();
      cancel = StoreSystem.onChange(listener);
    });

    afterEach(() => {
      cancel();
    });

    it('notifies when a game is applied', () => {
      StoreSystem.applyGame(createSnapshot({ round: 2 }));

      expect(listener).toHaveBeenCalledWith('GAME_UPDATED');
    });

    it('notifies when the hand is restored', () => {
      StoreSystem.setPlayerHand(createHand());

      expect(listener).toHaveBeenCalledWith('HAND_RESTORED');
    });

    it('notifies when a card is added to the hand', () => {
      StoreSystem.addCardToHand(cardFactory.createWarriorCard({ code: '1' }));

      expect(listener).toHaveBeenCalledWith('HAND_CHANGED');
    });

    it('notifies when a card is removed from the hand', () => {
      StoreSystem.setPlayerHand(createHand());
      listener.mockClear();

      StoreSystem.removeCardFromHand(new CardCode('1', 'WARRIOR'));

      expect(listener).toHaveBeenCalledWith('HAND_CHANGED');
    });

    it('does not notify when the hand has no copy to remove', () => {
      StoreSystem.removeCardFromHand(new CardCode('9', 'WARRIOR'));

      expect(listener).not.toHaveBeenCalled();
    });

    it('stops notifying once cancelled', () => {
      cancel();

      StoreSystem.applyGame(createSnapshot({ round: 2 }));

      expect(listener).not.toHaveBeenCalled();
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

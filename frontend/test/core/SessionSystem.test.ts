import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GameEventListener, Listener, StatusChangeListener } from '@/api/models/Listeners';
import type { ActiveGame } from '@/domain/ActiveGame';
import type { GameSnapshot } from '@/core/StoreSystem';
import { gameEventApi, gameStateApi, socketService, userApi, userEventApi } from '@/api';
import Party from '@/domain/Party';
import User from '@/domain/User';
import SessionSystem from '@/core/SessionSystem';
import StoreSystem from '@/core/StoreSystem';

vi.mock('@/api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/api')>()),
  userApi: { findAccount: vi.fn(), register: vi.fn() },
  socketService: { connect: vi.fn(), onStatusChange: vi.fn() },
  gameEventApi: { onGameApiEvent: vi.fn(), onGameLoading: vi.fn(), onGameSync: vi.fn() },
  gameStateApi: { bind: vi.fn(), reset: vi.fn() },
  userEventApi: { onPartyInfo: vi.fn(), onUserSynced: vi.fn() }
}));

describe('SessionSystem', () => {
  let statusListener: StatusChangeListener;
  let gameListeners: Map<string, GameEventListener>;
  let gameLoadingListener: Listener<ActiveGame>;
  let gameSyncListener: Listener<ActiveGame>;
  let partyListener: (party: Party) => void;
  let syncedListener: () => void;

  const registeredUser = new User('usr-1', 'One');
  const createParty = (members: User[] = [registeredUser]) => {
    const party = new Party('party-1');
    party.users = members;
    return party;
  };
  const gameEvent = { code: 'GAME_SYNC', details: {} } as never;
  const activeGame: ActiveGame = { gameCode: 'game-1', leaders: [] };
  const createSnapshot = () => ({ gameConfiguration: { gameCode: 'game-1' }, player: { code: 'usr-1' } }) as GameSnapshot;

  beforeEach(() => {
    vi.clearAllMocks();
    gameListeners = new Map();
    vi.mocked(userApi.findAccount).mockResolvedValue(registeredUser);
    vi.mocked(socketService.onStatusChange).mockImplementation((listener) => {
      statusListener = listener;
      return () => undefined;
    });
    vi.mocked(gameEventApi.onGameApiEvent).mockImplementation((code, listener) => {
      gameListeners.set(code, listener);
      return () => undefined;
    });
    vi.mocked(gameEventApi.onGameLoading).mockImplementation((listener) => {
      gameLoadingListener = listener;
      return () => undefined;
    });
    vi.mocked(gameEventApi.onGameSync).mockImplementation((listener) => {
      gameSyncListener = listener;
      return () => undefined;
    });
    vi.mocked(userEventApi.onPartyInfo).mockImplementation((listener) => {
      partyListener = listener;
      return () => undefined;
    });
    vi.mocked(userEventApi.onUserSynced).mockImplementation((listener) => {
      syncedListener = listener as () => void;
      return () => undefined;
    });
  });

  describe('start', () => {
    // USER-6
    it('stores the existing user', async () => {
      await SessionSystem.start();

      expect(StoreSystem.getUser()).toBe(registeredUser);
    });

    // USER-6
    it('registers a new user when the user is not found', async () => {
      const newUser = new User('usr-2', 'Two');
      vi.mocked(userApi.findAccount).mockResolvedValueOnce(undefined);
      vi.mocked(userApi.register).mockResolvedValueOnce(newUser);

      await SessionSystem.start();

      expect(StoreSystem.getUser()).toBe(newUser);
    });

    it('rethrows a failure without registering', async () => {
      vi.mocked(userApi.findAccount).mockRejectedValueOnce(new Error('exception.request.malformed'));

      await expect(SessionSystem.start()).rejects.toThrow('exception.request.malformed');
      expect(userApi.register).not.toHaveBeenCalled();
    });

    // CON-1
    it('connects the socket', async () => {
      await SessionSystem.start();

      expect(socketService.connect).toHaveBeenCalledTimes(1);
    });

    // CON-10
    it('binds the game state to the events', async () => {
      await SessionSystem.start();

      expect(gameStateApi.bind).toHaveBeenCalledTimes(1);
    });

    it('does not connect the socket when the user cannot be loaded', async () => {
      vi.mocked(userApi.findAccount).mockRejectedValueOnce(new Error('Unexpected response status 500'));

      await expect(SessionSystem.start()).rejects.toThrow();
      expect(socketService.connect).not.toHaveBeenCalled();
    });
  });

  // CON-23
  describe('state on connection', () => {
    beforeEach(async () => {
      await SessionSystem.start();
      statusListener('connecting');
    });

    it('goes idle when only user:synced arrives', () => {
      syncedListener();

      expect(SessionSystem.userState.value).toBe('IDLE');
    });

    it('goes to the party when party:info arrives before user:synced', () => {
      partyListener(createParty());
      syncedListener();

      expect(SessionSystem.userState.value).toBe('IN_PARTY');
    });

    it('stores the party received', () => {
      const party = createParty();

      partyListener(party);

      expect(SessionSystem.party.value).toBe(party);
    });

    // LOAD-6
    it('keeps the game announced by GAME_SYNC', () => {
      gameSyncListener(activeGame);

      expect(SessionSystem.activeGame.value).toBe(activeGame);
    });

    it('goes to the game in progress when GAME_SYNC arrives first', () => {
      gameSyncListener(activeGame);
      partyListener(createParty());
      syncedListener();

      expect(SessionSystem.userState.value).toBe('GAME_IN_PROGRESS');
    });

    it('goes to the loading game when GAME_LOADING arrives first', () => {
      gameLoadingListener(activeGame);
      partyListener(createParty());
      syncedListener();

      expect(SessionSystem.userState.value).toBe('GAME_LOADING');
    });

    it('keeps the sync when the socket reports connected after user:synced', () => {
      syncedListener();

      statusListener('connected');

      expect(SessionSystem.screen.value).toBe('MAIN_MENU');
    });

    it('forgets the previous game when the socket connects again', () => {
      gameLoadingListener(activeGame);

      statusListener('connecting');

      expect(SessionSystem.activeGame.value).toBeUndefined();
    });

    it('forgets the previous party when the socket connects again', () => {
      partyListener(createParty());

      statusListener('connecting');

      expect(SessionSystem.party.value).toBeUndefined();
    });

    // UI-17
    it('has no screen before user:synced', () => {
      statusListener('connecting');

      expect(SessionSystem.screen.value).toBeUndefined();
    });

    // UI-17
    it('shows the main menu when only user:synced arrives', () => {
      syncedListener();

      expect(SessionSystem.screen.value).toBe('MAIN_MENU');
    });

    // UI-17
    it('shows the party when party:info arrives before user:synced', () => {
      partyListener(createParty());
      syncedListener();

      expect(SessionSystem.screen.value).toBe('PARTY');
    });

    // UI-17
    it('shows the game when GAME_LOADING arrives before user:synced', () => {
      gameLoadingListener(activeGame);
      partyListener(createParty());
      syncedListener();

      expect(SessionSystem.screen.value).toBe('GAME');
    });

    it('hides the screen again when the socket connects again', () => {
      syncedListener();

      statusListener('connecting');

      expect(SessionSystem.screen.value).toBeUndefined();
    });
  });

  // UI-17
  describe('state after the sync', () => {
    beforeEach(async () => {
      await SessionSystem.start();
      statusListener('connecting');
      syncedListener();
    });

    it('goes to the party when party:info arrives from the main menu', () => {
      partyListener(createParty());

      expect(SessionSystem.userState.value).toBe('IN_PARTY');
    });

    it('goes to loading when GAME_LOADING arrives in the party', () => {
      partyListener(createParty());

      gameLoadingListener(activeGame);

      expect(SessionSystem.userState.value).toBe('GAME_LOADING');
    });

    it('goes to the game when GAME_START arrives while loading', () => {
      partyListener(createParty());
      gameLoadingListener(activeGame);

      gameListeners.get('GAME_START')!(gameEvent);

      expect(SessionSystem.userState.value).toBe('GAME_IN_PROGRESS');
    });

    it('goes back to the party when GAME_CANCELLED arrives while loading', () => {
      partyListener(createParty());
      gameLoadingListener(activeGame);

      gameListeners.get('GAME_CANCELLED')!(gameEvent);

      expect(SessionSystem.userState.value).toBe('IN_PARTY');
    });

    it('keeps the loading state when party:info arrives', () => {
      partyListener(createParty());
      gameLoadingListener(activeGame);

      partyListener(createParty());

      expect(SessionSystem.userState.value).toBe('GAME_LOADING');
    });

    // LOAD-2
    it('keeps the game announced by GAME_LOADING', () => {
      partyListener(createParty());

      gameLoadingListener(activeGame);

      expect(SessionSystem.activeGame.value).toBe(activeGame);
    });

    // UI-12
    it('abandoning the game while loading goes back to the party', () => {
      partyListener(createParty());
      gameLoadingListener(activeGame);

      SessionSystem.abandonGame();

      expect(SessionSystem.userState.value).toBe('IN_PARTY');
    });

    // UI-12
    it('abandoning the game without a party goes to the main menu', () => {
      gameLoadingListener(activeGame);

      SessionSystem.abandonGame();

      expect(SessionSystem.userState.value).toBe('IDLE');
    });

    // UI-17
    it('drops the game state when the game is abandoned', () => {
      partyListener(createParty());
      gameLoadingListener(activeGame);
      StoreSystem.applyGame(createSnapshot());

      SessionSystem.abandonGame();

      expect(() => StoreSystem.getPlayer()).toThrowError('Game not initialized');
    });

    // CON-12
    it('drops the events waiting when the game is abandoned', () => {
      partyListener(createParty());
      gameLoadingListener(activeGame);
      vi.mocked(gameStateApi.reset).mockClear();

      SessionSystem.abandonGame();

      expect(gameStateApi.reset).toHaveBeenCalledTimes(1);
    });

    // UI-17
    it('keeps the game state when the game starts', () => {
      partyListener(createParty());
      gameLoadingListener(activeGame);
      StoreSystem.applyGame(createSnapshot());

      gameListeners.get('GAME_START')!(gameEvent);

      expect(StoreSystem.getPlayer().code).toBe('usr-1');
    });

    it('abandoning the game outside of a game changes nothing', () => {
      partyListener(createParty());

      SessionSystem.abandonGame();

      expect(SessionSystem.userState.value).toBe('IN_PARTY');
    });

    it('goes to the party when the server confirms entering it', () => {
      const party = createParty();

      SessionSystem.enterParty(party);

      expect(SessionSystem.userState.value).toBe('IN_PARTY');
      expect(SessionSystem.party.value).toBe(party);
    });

    it('goes back to the main menu when leaving the party', () => {
      SessionSystem.enterParty(createParty());

      SessionSystem.leaveParty();

      expect(SessionSystem.userState.value).toBe('IDLE');
      expect(SessionSystem.party.value).toBeUndefined();
    });

    // PARTY-12
    it('goes back to the main menu when party:info no longer lists the user', () => {
      SessionSystem.enterParty(createParty());

      partyListener(createParty([new User('usr-9', 'Nine')]));

      expect(SessionSystem.userState.value).toBe('IDLE');
    });

    it('ignores GAME_START outside loading', () => {
      gameListeners.get('GAME_START')!(gameEvent);

      expect(SessionSystem.userState.value).toBe('IDLE');
    });
  });

  describe('state on connection', () => {
    beforeEach(async () => {
      await SessionSystem.start();
      statusListener('connecting');
    });

    it('keeps the state when user:synced repeats without a new connection', () => {
      partyListener(createParty());
      syncedListener();

      syncedListener();

      expect(SessionSystem.userState.value).toBe('IN_PARTY');
    });
  });
});

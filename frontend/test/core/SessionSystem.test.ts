import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GameEventListener, StatusChangeListener } from '@/api/models/Listeners';
import { gameEventApi, socketService, userApi, userEventApi } from '@/api';
import Party from '@/domain/Party';
import User from '@/domain/User';
import SessionSystem from '@/core/SessionSystem';
import StoreSystem from '@/core/StoreSystem';

vi.mock('@/api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/api')>()),
  userApi: { findAccount: vi.fn(), register: vi.fn() },
  socketService: { connect: vi.fn(), onStatusChange: vi.fn() },
  gameEventApi: { onGameApiEvent: vi.fn() },
  userEventApi: { onPartyInfo: vi.fn(), onUserSynced: vi.fn() }
}));

describe('SessionSystem', () => {
  let statusListener: StatusChangeListener;
  let gameListeners: Map<string, GameEventListener>;
  let partyListener: (party: Party) => void;
  let syncedListener: () => void;

  const registeredUser = new User('usr-1', 'One');
  const createParty = () => new Party('party-1');
  const gameEvent = { code: 'GAME_SYNC', details: {} } as never;

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
      statusListener('connected');
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

    it('goes to the game in progress when GAME_SYNC arrives first', () => {
      gameListeners.get('GAME_SYNC')!(gameEvent);
      partyListener(createParty());
      syncedListener();

      expect(SessionSystem.userState.value).toBe('GAME_IN_PROGRESS');
    });

    it('goes to the loading game when GAME_LOADING arrives first', () => {
      gameListeners.get('GAME_LOADING')!(gameEvent);
      partyListener(createParty());
      syncedListener();

      expect(SessionSystem.userState.value).toBe('GAME_LOADING');
    });

    it('forgets the previous party when the socket connects again', () => {
      partyListener(createParty());

      statusListener('connected');

      expect(SessionSystem.party.value).toBeUndefined();
    });

    it('ignores game events outside the connection sync', () => {
      syncedListener();

      gameListeners.get('GAME_LOADING')!(gameEvent);
      statusListener('connected');
      syncedListener();

      expect(SessionSystem.userState.value).toBe('IDLE');
    });

    it('keeps the state when user:synced repeats without a new connection', () => {
      partyListener(createParty());
      syncedListener();

      syncedListener();

      expect(SessionSystem.userState.value).toBe('IN_PARTY');
    });
  });
});

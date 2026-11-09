import { beforeEach, describe, expect, it, vi } from 'vitest';
import { partyMemberApi, partyOwnerApi, userApi } from '@/api';
import { ApiException } from '@/api/models/ApiException';
import Party from '@/domain/Party';
import User from '@/domain/User';
import partyController from '@/controllers/PartyController';
import SessionSystem from '@/core/SessionSystem';

vi.mock('@/api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/api')>()),
  userApi: { createParty: vi.fn(), joinParty: vi.fn() },
  partyMemberApi: { leaveParty: vi.fn() },
  partyOwnerApi: { startPartyGame: vi.fn() }
}));

describe('PartyController', () => {
  const owner = new User('usr-1', 'One');
  const member = new User('usr-2', 'Two');
  let party: Party;

  const createParty = (overrides: Partial<Party> = {}) => Object.assign(new Party('party-1'), { owner, userCount: 2, ...overrides });

  beforeEach(() => {
    vi.clearAllMocks();
    party = createParty();
    vi.spyOn(SessionSystem, 'enterParty').mockImplementation(() => undefined);
    vi.spyOn(SessionSystem, 'leaveParty').mockImplementation(() => undefined);
  });

  describe('createParty', () => {
    // PARTY-1
    it('enters the party the server created', async () => {
      vi.mocked(userApi.createParty).mockResolvedValueOnce(party);

      const errorKey = await partyController.createParty();

      expect(errorKey).toBeUndefined();
      expect(SessionSystem.enterParty).toHaveBeenCalledWith(party);
    });

    // UI-18
    it('returns the key of a rejection', async () => {
      vi.mocked(userApi.createParty).mockRejectedValueOnce(new ApiException('exception.party.user_already_in_party'));

      const errorKey = await partyController.createParty();

      expect(errorKey).toBe('exception.party.user_already_in_party');
      expect(SessionSystem.enterParty).not.toHaveBeenCalled();
    });

    it('returns the unexpected key for any other failure', async () => {
      vi.mocked(userApi.createParty).mockRejectedValueOnce(new Error('Unexpected response status 500'));

      expect(await partyController.createParty()).toBe('exception.unexpected');
    });
  });

  describe('joinParty', () => {
    // PARTY-5
    it('joins with the trimmed code and enters the party', async () => {
      vi.mocked(userApi.joinParty).mockResolvedValueOnce(party);

      await partyController.joinParty('  party-1 ');

      expect(userApi.joinParty).toHaveBeenCalledWith('party-1');
      expect(SessionSystem.enterParty).toHaveBeenCalledWith(party);
    });

    // UI-18
    it('returns the key of a rejection', async () => {
      vi.mocked(userApi.joinParty).mockRejectedValueOnce(new ApiException('exception.party.is_full'));

      expect(await partyController.joinParty('party-1')).toBe('exception.party.is_full');
    });
  });

  describe('leaveGame', () => {
    // SPEC-3
    it('leaves the game after the server accepts', async () => {
      vi.spyOn(SessionSystem, 'leaveGame').mockImplementation(() => undefined);
      vi.spyOn(SessionSystem, 'party', 'get').mockReturnValue({ value: party } as typeof SessionSystem.party);
      vi.mocked(partyMemberApi.leaveParty).mockResolvedValueOnce(undefined);

      await partyController.leaveGame();

      expect(partyMemberApi.leaveParty).toHaveBeenCalledWith('party-1');
      expect(SessionSystem.leaveGame).toHaveBeenCalledTimes(1);
    });

    it('stays in the game when the server rejects', async () => {
      vi.spyOn(SessionSystem, 'leaveGame').mockImplementation(() => undefined);
      vi.spyOn(SessionSystem, 'party', 'get').mockReturnValue({ value: party } as typeof SessionSystem.party);
      vi.mocked(partyMemberApi.leaveParty).mockRejectedValueOnce(new ApiException('exception.party.not_found'));

      const errorKey = await partyController.leaveGame();

      expect(errorKey).toBe('exception.party.not_found');
      expect(SessionSystem.leaveGame).not.toHaveBeenCalled();
    });
  });

  describe('leaveParty', () => {
    // PARTY-6
    it('leaves the session party after the server accepts', async () => {
      vi.mocked(partyMemberApi.leaveParty).mockResolvedValueOnce(undefined);

      await partyController.leaveParty(party);

      expect(partyMemberApi.leaveParty).toHaveBeenCalledWith('party-1');
      expect(SessionSystem.leaveParty).toHaveBeenCalledTimes(1);
    });

    it('keeps the party when the server rejects', async () => {
      vi.mocked(partyMemberApi.leaveParty).mockRejectedValueOnce(new ApiException('exception.party.locked'));

      const errorKey = await partyController.leaveParty(party);

      expect(errorKey).toBe('exception.party.locked');
      expect(SessionSystem.leaveParty).not.toHaveBeenCalled();
    });
  });

  describe('startGame', () => {
    // LOAD-1
    it('asks the server to start the game of the party', async () => {
      vi.mocked(partyOwnerApi.startPartyGame).mockResolvedValueOnce(undefined);

      await partyController.startGame(party);

      expect(partyOwnerApi.startPartyGame).toHaveBeenCalledWith('party-1');
    });

    it('returns the key of a rejection', async () => {
      vi.mocked(partyOwnerApi.startPartyGame).mockRejectedValueOnce(new ApiException('exception.party.not_enough_players'));

      expect(await partyController.startGame(party)).toBe('exception.party.not_enough_players');
    });
  });

  describe('canStartGame', () => {
    // UI-20
    it.each([
      { description: 'the owner with enough members', user: owner, overrides: {}, expected: true },
      { description: 'a member who is not the owner', user: member, overrides: {}, expected: false },
      { description: 'the owner of a party with one member', user: owner, overrides: { userCount: 1 }, expected: false },
      // UI-16
      { description: 'the owner of a locked party', user: owner, overrides: { isLocked: true }, expected: false }
    ])('is $expected for $description', ({ user, overrides, expected }) => {
      expect(partyController.canStartGame(createParty(overrides), user)).toBe(expected);
    });
  });
});

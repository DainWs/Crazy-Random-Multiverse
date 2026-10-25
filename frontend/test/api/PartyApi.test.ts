import { beforeEach, describe, expect, it, vi } from 'vitest';
import { partyMemberApi, partyOwnerApi } from '@/api/PartyApi';
import Party from '@/domain/Party';
import { toBase64UrlSafe } from '@/api/models/Codification';

describe('PartyApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('partyMemberApi', () => {
    it('leaveParty sends POST request to leave endpoint', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({} as Response);
      const partyCode = 'party/test=1';

      await partyMemberApi.leaveParty(partyCode);

      expect(fetchSpy).toHaveBeenCalledWith(
        `/party/${toBase64UrlSafe(partyCode)}/leave`,
        { method: 'POST' }
      );
    });
  });

  describe('partyOwnerApi', () => {
    it('updateParty sends PUT with UpdatePartyRequest body', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({} as Response);
      const party = new Party('party-1');
      party.maxUsers = 6;
      party.gameMode = 'CLASSIC';

      await partyOwnerApi.updateParty(party);

      expect(fetchSpy).toHaveBeenCalledWith(
        `/party/${toBase64UrlSafe(party.code)}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            code: 'party-1',
            maxPlayers: 6,
            gameMode: 'CLASSIC',
          }),
        }
      );
    });

    it('kickoutUser sends POST to kick endpoint with KickoutFromPartyRequest', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({} as Response);

      await partyOwnerApi.kickoutUser('party-1', 'user-2');

      expect(fetchSpy).toHaveBeenCalledWith(
        `/party/${toBase64UrlSafe('party-1')}/kick`,
        {
          method: 'POST',
          body: JSON.stringify({
            partyCode: 'party-1',
            userCode: 'user-2',
          }),
        }
      );
    });

    it('startPartyGame sends POST to start endpoint', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({} as Response);

      await partyOwnerApi.startPartyGame('party-1');

      expect(fetchSpy).toHaveBeenCalledWith(
        `/party/${toBase64UrlSafe('party-1')}/start`,
        { method: 'POST' }
      );
    });
  });
});

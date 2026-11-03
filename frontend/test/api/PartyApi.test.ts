import { beforeEach, describe, expect, it, vi } from 'vitest';
import { partyMemberApi, partyOwnerApi } from '@/api/PartyApi';
import Party from '@/domain/Party';
import { toBase64UrlSafe } from '@/api/models/Codification';
import { ApiException } from '@/api/models/ApiException';

describe('PartyApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('partyMemberApi', () => {
    // CON-18
    it('leaveParty throws the key of a rejected request', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ key: 'exception.party.not_found' })
      } as Response);

      await expect(partyMemberApi.leaveParty('party-1')).rejects.toThrow(new ApiException('exception.party.not_found'));
    });

    it('leaveParty sends POST request to leave endpoint', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true } as Response);
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
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true } as Response);
      const party = new Party('party-1');
      party.maxUsers = 6;
      party.gameMode = 'CLASSIC';

      await partyOwnerApi.updateParty(party);

      expect(fetchSpy).toHaveBeenCalledWith(
        `/party/${toBase64UrlSafe(party.code)}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            maxUsers: 6,
            gameMode: 'CLASSIC',
          }),
        }
      );
    });

    it('kickoutUser sends POST to kick endpoint with the user code in the path', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true } as Response);

      await partyOwnerApi.kickoutUser('party-1', 'user-2');

      expect(fetchSpy).toHaveBeenCalledWith(
        `/party/${toBase64UrlSafe('party-1')}/kick/${toBase64UrlSafe('user-2')}`,
        { method: 'POST' }
      );
    });

    it('startPartyGame sends POST to start endpoint', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true } as Response);

      await partyOwnerApi.startPartyGame('party-1');

      expect(fetchSpy).toHaveBeenCalledWith(
        `/party/${toBase64UrlSafe('party-1')}/start`,
        { method: 'POST' }
      );
    });
  });
});

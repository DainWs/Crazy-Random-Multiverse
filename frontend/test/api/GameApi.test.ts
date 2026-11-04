import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loadGameResourceManifest, sendReady } from '@/api/GameApi';
import { toBase64UrlSafe } from '@/api/models/Codification';
import { ApiException } from '@/api/models/ApiException';

describe('GameApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('loadGameResourceManifest', () => {
    const manifestBody = {
      fixed: [{ key: 'icon.health', type: 'IMAGE', url: '/resources/icons/health.png' }],
      dynamic: [{ key: 'warrior.rare.4.put', type: 'AUDIO', url: '/resources/cards/warrior/rare/4/put.mp3' }]
    };

    // CON-28
    it('requests the manifest with the game code in Base64 URL-safe', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, json: async () => manifestBody } as Response);
      const gameCode = 'game/special+code';

      await loadGameResourceManifest(gameCode);

      expect(fetchSpy).toHaveBeenCalledWith(`/game/${toBase64UrlSafe(gameCode)}/resources`);
    });

    it('maps the fixed resources of the response', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, json: async () => manifestBody } as Response);

      const manifest = await loadGameResourceManifest('game-1');

      expect(manifest.fixed).toEqual([{ key: 'icon.health', type: 'IMAGE', url: '/resources/icons/health.png' }]);
    });

    it('maps the dynamic resources of the response', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, json: async () => manifestBody } as Response);

      const manifest = await loadGameResourceManifest('game-1');

      expect(manifest.dynamic).toEqual([{ key: 'warrior.rare.4.put', type: 'AUDIO', url: '/resources/cards/warrior/rare/4/put.mp3' }]);
    });

    // CON-18
    it('throws the key of a rejected request', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ key: 'exception.game.not_found' })
      } as Response);

      await expect(loadGameResourceManifest('game-1')).rejects.toThrow(new ApiException('exception.game.not_found'));
    });

    it('throws on an unexpected status', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: false, status: 500 } as Response);

      await expect(loadGameResourceManifest('game-1')).rejects.toThrow('Unexpected response status 500');
    });
  });

  it('sendReady posts to /game/{gameCode}/ready with the code in Base64 URL-safe', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true } as Response);

    await sendReady('game/special+code');

    expect(fetchSpy).toHaveBeenCalledWith(`/game/${toBase64UrlSafe('game/special+code')}/ready`, { method: 'POST' });
  });
});

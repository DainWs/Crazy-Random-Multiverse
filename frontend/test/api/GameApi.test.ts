import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loadGameResourceManifest, sendReady } from '@/api/GameApi';
import { toBase64UrlSafe } from '@/api/models/Codification';

describe('GameApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('loadGameResourceManifest fetches resources with url-safe game code and parses json', async () => {
    const mockResources = {
      images: [],
      audios: [],
      cards: [],
    };

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      json: async () => mockResources,
    } as Response);

    const gameCode = 'game/special+code';
    const result = await loadGameResourceManifest(gameCode);

    expect(fetchSpy).toHaveBeenCalledWith(`/game/${toBase64UrlSafe(gameCode)}/resources`);
    expect(result).toEqual(mockResources);
  });

  it('sendReady posts to /game/{gameCode}/ready', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({} as Response);

    await sendReady('game-123');

    expect(fetchSpy).toHaveBeenCalledWith('/game/game-123/ready', { method: 'POST' });
  });
});

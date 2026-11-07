import { beforeEach, describe, expect, it, vi } from 'vitest';
import type ActionEvent from '@/domain/ActionEvent';
import { loadGameResourceManifest, sendPlayerAction, sendReady } from '@/api/GameApi';
import { toBase64UrlSafe } from '@/api/models/Codification';
import { ApiException } from '@/api/models/ApiException';
import Action from '@/domain/Action';
import Player from '@/domain/Player';
import { ZonePosition } from '@/domain/Position';

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

  describe('sendPlayerAction', () => {
    const createAction = (): Action => {
      const source = { position: null, player: new Player('p-1', 'One'), card: null } as unknown as ActionEvent;
      const target = { position: new ZonePosition(0, 2), player: new Player('p-1', 'One'), card: null } as unknown as ActionEvent;
      return new Action('game/special+code', source, target);
    };

    it('posts the action to /game/{gameCode}/action with the code in Base64 URL-safe', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true } as Response);

      await sendPlayerAction('PUT_ACTION', createAction(), 3);

      expect(fetchSpy.mock.calls[0][0]).toBe(`/game/${toBase64UrlSafe('game/special+code')}/action`);
    });

    it('sends the action as JSON', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true } as Response);

      await sendPlayerAction('PUT_ACTION', createAction(), 3);

      const requestInit = fetchSpy.mock.calls[0][1];
      const sentAction = JSON.parse(requestInit!.body as string);

      expect(sentAction).toMatchObject({ type: 'PUT_ACTION', targetPosition: { row: 2, column: 2 } });
    });

    // CON-18
    it('throws the key of a rejected action', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ key: 'exception.player-action.allowed_only_on_turn' })
      } as Response);

      await expect(sendPlayerAction('PUT_ACTION', createAction(), 3)).rejects.toThrow(new ApiException('exception.player-action.allowed_only_on_turn'));
    });
  });
});

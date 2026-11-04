import { describe, expect, it } from 'vitest';
import type { GameResource, ResourceManifest } from '@/domain/Resources';
import { ApiException } from '@/api/models/ApiException';
import { CardCode } from '@/domain/Card';
import { isFinalRejection, planLoad } from '@/core/GameLoadPlanner';

const image = (key: string): GameResource => ({ key, type: 'IMAGE', url: `/resources/${key}.png` });
const audio = (key: string): GameResource => ({ key, type: 'AUDIO', url: `/resources/${key}.mp3` });

const keysOf = (resources: GameResource[]) => resources.map((resource) => resource.key);

describe('GameLoadPlanner', () => {
  const manifest: ResourceManifest = {
    fixed: [image('icon.health'), image('frame.common')],
    dynamic: [image('leader.0'), audio('leader.0.put'), image('leader.1'), image('warrior.rare.4')]
  };
  const leaders = [new CardCode('0', 'LEADER')];
  const nothingLoaded = () => false;

  describe('planLoad', () => {
    // LOAD-2
    it('requires every fixed resource that is not loaded', () => {
      const plan = planLoad(manifest, leaders, nothingLoaded);

      expect(keysOf(plan.required)).toEqual(['icon.health', 'frame.common']);
    });

    // LOAD-2
    it('does not require a fixed resource that is already loaded', () => {
      const plan = planLoad(manifest, leaders, (key) => key === 'icon.health');

      expect(keysOf(plan.required)).toEqual(['frame.common']);
    });

    // LOAD-2
    it('tries the image of each leader of the game', () => {
      const plan = planLoad(manifest, leaders, nothingLoaded);

      expect(keysOf(plan.optional)).toEqual(['leader.0']);
    });

    it('does not try a leader image that is already loaded', () => {
      const plan = planLoad(manifest, leaders, (key) => key === 'leader.0');

      expect(plan.optional).toEqual([]);
    });

    it('does not try the audios of a leader', () => {
      const plan = planLoad(manifest, leaders, nothingLoaded);

      expect(keysOf(plan.optional)).not.toContain('leader.0.put');
    });

    it('does not try a leader image the manifest does not list', () => {
      const plan = planLoad(manifest, [new CardCode('7', 'LEADER')], nothingLoaded);

      expect(plan.optional).toEqual([]);
    });

    it('tries the image of every different leader', () => {
      const plan = planLoad(manifest, [new CardCode('0', 'LEADER'), new CardCode('1', 'LEADER')], nothingLoaded);

      expect(keysOf(plan.optional)).toEqual(['leader.0', 'leader.1']);
    });

    // CON-31
    it('does not try the images of the cards that are not leaders', () => {
      const plan = planLoad(manifest, leaders, nothingLoaded);

      expect(keysOf(plan.optional)).not.toContain('warrior.rare.4');
    });
  });

  // UI-12
  describe('isFinalRejection', () => {
    it.each(['exception.game.not_found', 'exception.access_denied.wrong_game', 'exception.user.not_found'])('is true for %s', (key) => {
      expect(isFinalRejection(new ApiException(key))).toBe(true);
    });

    it('is false for another rejection', () => {
      expect(isFinalRejection(new ApiException('exception.request.malformed'))).toBe(false);
    });

    it('is false for an unexpected failure', () => {
      expect(isFinalRejection(new Error('Unexpected response status 500'))).toBe(false);
    });
  });
});

import type { UserState } from '@/domain/User';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { syncScenes } from '@/AppController';

describe('syncScenes', () => {
  let active: Set<string>;
  let sceneManager: Phaser.Scenes.SceneManager;

  beforeEach(() => {
    active = new Set();
    sceneManager = {
      isActive: vi.fn((key: string) => active.has(key)),
      start: vi.fn((key: string) => active.add(key)),
      stop: vi.fn((key: string) => active.delete(key))
    } as unknown as Phaser.Scenes.SceneManager;
  });

  // UI-17
  it.each([
    { userState: 'GAME_LOADING' as UserState, expected: 'GameLoad' },
    { userState: 'GAME_IN_PROGRESS' as UserState, expected: 'Game' }
  ])('starts $expected scene for $userState', ({ userState, expected }) => {
    syncScenes(sceneManager, userState);

    expect(active).toEqual(new Set([expected]));
  });

  // UI-17
  it.each([{ userState: 'IDLE' as UserState }, { userState: 'IN_PARTY' as UserState }])('stops the game scenes for $userState', ({ userState }) => {
    active = new Set(['GameLoad', 'Game']);

    syncScenes(sceneManager, userState);

    expect(active).toEqual(new Set());
  });

  it('replaces the loading scene when the game starts', () => {
    active = new Set(['GameLoad']);

    syncScenes(sceneManager, 'GAME_IN_PROGRESS');

    expect(active).toEqual(new Set(['Game']));
  });

  it('does not restart an active scene', () => {
    active = new Set(['Game']);

    syncScenes(sceneManager, 'GAME_IN_PROGRESS');

    expect(sceneManager.start).not.toHaveBeenCalled();
  });
});

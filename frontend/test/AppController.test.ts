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
    syncScenes(sceneManager, userState, true);

    expect(active).toEqual(new Set([expected]));
  });

  // UI-17
  it.each([{ userState: 'IDLE' as UserState }, { userState: 'IN_PARTY' as UserState }])('stops the game scenes for $userState', ({ userState }) => {
    active = new Set(['GameLoad', 'Game']);

    syncScenes(sceneManager, userState, true);

    expect(active).toEqual(new Set());
  });

  // VIEW-29
  it('keeps the loading scene under the board when the game starts, for the board to fade it out', () => {
    active = new Set(['GameLoad']);

    syncScenes(sceneManager, 'GAME_IN_PROGRESS', true);

    expect(active).toEqual(new Set(['GameLoad', 'Game']));
  });

  it('does not restart an active scene', () => {
    active = new Set(['Game']);

    syncScenes(sceneManager, 'GAME_IN_PROGRESS', true);

    expect(sceneManager.start).not.toHaveBeenCalled();
  });

  // LOAD-6
  it('loads the resources before showing a game in progress when they are missing', () => {
    syncScenes(sceneManager, 'GAME_IN_PROGRESS', false);

    expect(active).toEqual(new Set(['GameLoad']));
  });

  // LOAD-6
  it('keeps the loading scene when the game starts while the resources are still missing', () => {
    active = new Set(['GameLoad']);

    syncScenes(sceneManager, 'GAME_IN_PROGRESS', false);

    expect(sceneManager.start).not.toHaveBeenCalled();
  });

  it('does not ask for the resources of a game that is only loading', () => {
    syncScenes(sceneManager, 'GAME_LOADING', false);

    expect(active).toEqual(new Set(['GameLoad']));
  });
});

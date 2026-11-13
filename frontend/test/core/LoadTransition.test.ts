import 'phaser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GameScene } from '@/scenes/Game';
import { playLoadTransition } from '@/core/visual_effects/LoadTransition';
import { LOAD_SCENE_KEY, LOAD_TRANSITION_MS } from '@/core/Constants';

type Tween = { targets: { alpha: number }; alpha: number; duration: number; onComplete?: () => void };

// VIEW-29
describe('playLoadTransition', () => {
  let tweens: Tween[];
  let stopped: string[];
  let board: { alpha: number; setAlpha: (alpha: number) => void };
  let loading: { alpha: number };
  let loadingIsActive: boolean;
  let scene: GameScene;

  beforeEach(() => {
    tweens = [];
    stopped = [];
    loadingIsActive = true;
    board = { alpha: 1, setAlpha(alpha: number) { board.alpha = alpha; } };
    loading = { alpha: 1 };
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    scene = {
      cameras: { main: board },
      tweens: { add: (tween: Tween) => tweens.push(tween) },
      scene: {
        isActive: (key: string) => key === LOAD_SCENE_KEY && loadingIsActive,
        get: () => ({ cameras: { main: loading } }),
        stop: (key: string) => stopped.push(key)
      }
    } as unknown as GameScene;
  });

  it('fades the board in and the loading screen out together', () => {
    playLoadTransition(scene);

    expect([board.alpha, tweens.map((tween) => [tween.targets === board, tween.targets === loading, tween.alpha, tween.duration])]).toEqual([0, [[true, false, 1, LOAD_TRANSITION_MS], [false, true, 0, LOAD_TRANSITION_MS]]]);
  });

  it('removes the loading screen when it has faded out', () => {
    playLoadTransition(scene);

    tweens[1].onComplete?.();

    expect(stopped).toEqual([LOAD_SCENE_KEY]);
  });

  it('shows the board as it is when there is no loading screen', () => {
    loadingIsActive = false;

    playLoadTransition(scene);

    expect([board.alpha, tweens.length, stopped]).toEqual([1, 0, []]);
  });

  it('replaces the loading screen at once when the system asks for reduced motion', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }));

    playLoadTransition(scene);

    expect([board.alpha, tweens.length, stopped]).toEqual([1, 0, [LOAD_SCENE_KEY]]);
  });
});

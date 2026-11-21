import 'phaser';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { GameScene } from '@/scenes/Game';
import { playLoadTransition } from '@/core/visual_effects/LoadTransition';
import { LOAD_SCENE_KEY } from '@/core/Constants';

type Tween = { targets: { alpha: number }; alpha: number; duration: number; ease: string; onComplete?: () => void };

// VIEW-29
describe('playLoadTransition', () => {
  let tweens: Tween[];
  let stopped: string[];
  let board: { alpha: number; setAlpha: (alpha: number) => void };
  let loading: { alpha: number };
  let loadingIsActive: boolean;
  let scene: GameScene;

  /** Lets the promises of the transition go on until it waits for a tween again. */
  const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

  beforeEach(() => {
    tweens = [];
    stopped = [];
    loadingIsActive = true;
    board = { alpha: 1, setAlpha(alpha: number) { board.alpha = alpha; } };
    loading = { alpha: 1 };
    scene = {
      cameras: { main: board },
      events: { once: () => {}, off: () => {} },
      tweens: { add: (tween: Tween) => tweens.push(tween) },
      scene: {
        isActive: (key: string) => key === LOAD_SCENE_KEY && loadingIsActive,
        get: () => ({ cameras: { main: loading } }),
        stop: (key: string) => stopped.push(key)
      }
    } as unknown as GameScene;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('starts by fading the loading screen out in 400 ms, speeding up, with the board hidden', () => {
    void playLoadTransition(scene);

    expect(board.alpha).toBe(0);
    expect(tweens).toHaveLength(1);
    expect(tweens[0]).toMatchObject({ alpha: 0, duration: 400, ease: 'Quad.easeIn' });
    expect(tweens[0].targets).toBe(loading);
  });

  it('removes the loading screen when it has faded out, before the board starts to fade in', async () => {
    void playLoadTransition(scene);

    tweens[0].onComplete?.();
    await settle();

    expect(stopped).toEqual([LOAD_SCENE_KEY]);
  });

  it('then fades the board in in 400 ms, slowing down at the end', async () => {
    void playLoadTransition(scene);

    tweens[0].onComplete?.();
    await settle();

    expect(tweens).toHaveLength(2);
    expect(tweens[1]).toMatchObject({ alpha: 1, duration: 400, ease: 'Power1' });
    expect(tweens[1].targets).toBe(board);
  });

  it('resolves when the board has faded in', async () => {
    const ended = vi.fn();
    void playLoadTransition(scene).then(ended);
    tweens[0].onComplete?.();
    await settle();

    expect(ended).not.toHaveBeenCalled();

    tweens[1].onComplete?.();
    await settle();

    expect(ended).toHaveBeenCalledOnce();
  });

  it('shows the board as it is when there is no loading screen', async () => {
    loadingIsActive = false;

    await playLoadTransition(scene);

    expect([board.alpha, tweens.length, stopped]).toEqual([1, 0, []]);
  });

  it('fades even when the system asks for reduced motion', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }));

    void playLoadTransition(scene);

    expect([board.alpha, tweens.length, stopped]).toEqual([0, 1, []]);
  });
});

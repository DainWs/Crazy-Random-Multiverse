import { afterEach, describe, expect, it } from 'vitest';
import AnimationSystem from '@/core/AnimationSystem';

describe('AnimationSystem', () => {
  const flush = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

  /** A step that ends only when the test says so, to observe the queue while it plays. */
  const createManualStep = (played: string[], name: string) => {
    let finish: () => void = () => {};
    const step = () =>
      new Promise<void>((resolve) => {
        played.push(name);
        finish = resolve;
      });

    return { step, finish: () => finish() };
  };

  afterEach(async () => {
    AnimationSystem.clear();
    await flush();
  });

  it('is not playing when nothing was queued', () => {
    expect(AnimationSystem.isPlaying()).toBe(false);
  });

  it('is playing from the moment an animation is queued until it ends', async () => {
    const played: string[] = [];
    const first = createManualStep(played, 'first');

    AnimationSystem.enqueue(first.step);
    const playingWhileRunning = AnimationSystem.isPlaying();
    first.finish();
    await flush();

    expect(playingWhileRunning).toBe(true);
    expect(AnimationSystem.isPlaying()).toBe(false);
  });

  it('plays the animations one after another in the order they were queued', async () => {
    const played: string[] = [];
    const first = createManualStep(played, 'first');
    const second = createManualStep(played, 'second');

    AnimationSystem.enqueue(first.step);
    AnimationSystem.enqueue(second.step);
    const playedBeforeFirstEnds = [...played];
    first.finish();
    await flush();
    second.finish();
    await flush();

    expect(playedBeforeFirstEnds).toEqual(['first']);
    expect(played).toEqual(['first', 'second']);
  });

  it('plays the next animation when one fails', async () => {
    const played: string[] = [];
    const failing = () => Promise.reject(new Error('broken animation'));
    const next = createManualStep(played, 'next');

    AnimationSystem.enqueue(failing);
    AnimationSystem.enqueue(next.step);
    await flush();
    next.finish();
    await flush();

    expect(played).toEqual(['next']);
    expect(AnimationSystem.isPlaying()).toBe(false);
  });

  it('drops the waiting animations when it is cleared', async () => {
    const played: string[] = [];
    const first = createManualStep(played, 'first');
    const second = createManualStep(played, 'second');

    AnimationSystem.enqueue(first.step);
    AnimationSystem.enqueue(second.step);
    AnimationSystem.clear();
    first.finish();
    await flush();

    expect(played).toEqual(['first']);
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';
import type HandView from '@/game/hand/HandView';
import HandAnimator from '@/game/hand/HandAnimator';

describe('HandAnimator', () => {
  let tweens: { add: ReturnType<typeof vi.fn>; killTweensOf: ReturnType<typeof vi.fn> };
  let handView: HandView;
  let animator: HandAnimator;

  beforeEach(() => {
    vi.clearAllMocks();
    tweens = { add: vi.fn(), killTweensOf: vi.fn() };
    handView = { scene: { tweens } } as unknown as HandView;
    animator = new HandAnimator();
  });

  describe('animateHandExpansion', () => {
    // VIEW-16
    it('tweens the hidden ratio of the hand', () => {
      animator.animateHandExpansion(handView, 0.75, 250);

      expect(tweens.add).toHaveBeenCalledWith(
        expect.objectContaining({ targets: handView, hiddenRatio: 0.75, duration: 250 })
      );
    });

    // VIEW-16
    it('starts a second tween while the first one is running', () => {
      animator.animateHandExpansion(handView, 0);
      animator.animateHandExpansion(handView, 0.75);

      expect(tweens.add).toHaveBeenCalledTimes(2);
    });

    it('stops the running tween of the hand first', () => {
      animator.animateHandExpansion(handView, 0);

      expect(tweens.killTweensOf).toHaveBeenCalledWith(handView);
    });
  });
});

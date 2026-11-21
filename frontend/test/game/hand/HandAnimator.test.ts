import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HAND_ARRIVAL_DEPTH_BOOST } from '@/core/Constants';
import type HandView from '@/game/hand/HandView';
import HandAnimator from '@/game/hand/HandAnimator';

vi.mock('@/core/visual_effects/CardAnimator', () => ({ default: { playTween: vi.fn(() => Promise.resolve()) } }));

describe('HandAnimator', () => {
  let tweens: { add: ReturnType<typeof vi.fn>; killTweensOf: ReturnType<typeof vi.fn> };
  let handView: HandView;
  let animator: HandAnimator;

  beforeEach(() => {
    vi.clearAllMocks();
    tweens = { add: vi.fn(), killTweensOf: vi.fn() };
    handView = { scene: { tweens, events: { once: vi.fn(), off: vi.fn() } } } as unknown as HandView;
    animator = new HandAnimator();
  });

  // VIEW-8
  describe('animateIncomingCards', () => {
    const createCard = (y: number) => ({
      getOriginalPosition: () => ({ x: 100, y }),
      getOriginalDepth: () => 5,
      setPosition: vi.fn(),
      setDepth: vi.fn(),
      resetDepth: vi.fn(),
      setInteractive: vi.fn(),
      disableInteractive: vi.fn()
    });

    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('starts each card outside the left edge, at the height of its slot', () => {
      const [first, second] = [createCard(40), createCard(60)];

      animator.animateIncomingCards(-300, [], [first, second] as never[]);

      expect([first.setPosition, second.setPosition].map((setPosition) => setPosition.mock.calls[0])).toEqual([[-300, 40], [-300, 60]]);
    });

    it('draws each card above the cards of the hand', () => {
      const card = createCard(40);

      animator.animateIncomingCards(-300, [], [card] as never[]);

      expect(card.setDepth).toHaveBeenCalledWith(5 + HAND_ARRIVAL_DEPTH_BOOST);
    });

    it('is over 400 ms after the first card starts when two cards are dealt', () => {
      const onComplete = vi.fn();

      animator.animateIncomingCards(-300, [], [createCard(40), createCard(60)] as never[], onComplete);
      vi.advanceTimersByTime(399);
      const early = onComplete.mock.calls.length;
      vi.advanceTimersByTime(1);

      expect([early, onComplete.mock.calls.length]).toEqual([0, 1]);
    });

    it('keeps the cards of the hand from being used while the new one slides in', () => {
      const handCard = createCard(40);

      animator.animateIncomingCards(-300, [handCard] as never[], [createCard(60)] as never[]);

      expect(handCard.disableInteractive).toHaveBeenCalled();
    });
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

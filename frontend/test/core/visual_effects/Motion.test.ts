import 'phaser';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import EffectSettings from '@/core/EffectSettings';
import type { Motion } from '@/core/visual_effects/Motion';
import { durationOf, MOTION_EASES, playMotion } from '@/core/visual_effects/Motion';

type TweenConfig = Record<string, unknown> & { onComplete: () => void };

// VIEW-30, VIEW-31
describe('Motion', () => {
  let configs: TweenConfig[];
  let shutdowns: (() => void)[];
  let scene: Phaser.Scene;

  beforeEach(() => {
    configs = [];
    shutdowns = [];
    scene = {
      tweens: { add: (config: TweenConfig) => configs.push(config) },
      events: {
        once: (_event: string, listener: () => void) => shutdowns.push(listener),
        off: vi.fn()
      }
    } as unknown as Phaser.Scene;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const motionOf = (overrides: Partial<Motion> = {}): Motion => ({
    targets: { alpha: 0 },
    to: { alpha: 1 },
    duration: 'MEDIUM',
    curve: 'ENTER',
    kind: 'ESSENTIAL',
    ...overrides
  });

  describe('durationOf', () => {
    it('gives 150, 250 and 400 ms to the three speeds', () => {
      expect([durationOf('FAST'), durationOf('MEDIUM'), durationOf('SLOW')]).toEqual([150, 250, 400]);
    });

    it('keeps the milliseconds of a named exception', () => {
      expect(durationOf(1200)).toBe(1200);
    });
  });

  describe('playMotion', () => {
    it('creates a tween with the final values, the duration and the ease of its curve', () => {
      const motion = motionOf({ duration: 'SLOW', curve: 'LEAVE' });

      void playMotion(scene, motion);

      expect(configs[0]).toMatchObject({
        targets: motion.targets,
        alpha: 1,
        duration: 400,
        ease: MOTION_EASES.get('LEAVE'),
        persist: false
      });
    });

    it('uses the ease of an exception as it is', () => {
      void playMotion(scene, motionOf({ curve: { ease: 'Cubic.easeOut' } }));

      expect(configs[0].ease).toBe('Cubic.easeOut');
    });

    it('passes only the options the motion sets', () => {
      void playMotion(scene, motionOf({ yoyo: true, repeat: 3 }));

      expect([configs[0].yoyo, configs[0].repeat, 'delay' in configs[0], 'onUpdate' in configs[0]]).toEqual([true, 3, false, false]);
    });

    it('resolves when the tween ends', async () => {
      const ended = vi.fn();
      void playMotion(scene, motionOf()).then(ended);

      configs[0].onComplete();
      await Promise.resolve();

      expect(ended).toHaveBeenCalledOnce();
    });

    it('resolves when the scene shuts down, which drops its tweens', async () => {
      const ended = vi.fn();
      void playMotion(scene, motionOf()).then(ended);

      shutdowns[0]();
      await Promise.resolve();

      expect(ended).toHaveBeenCalledOnce();
    });

    it('does not resolve before the tween ends', async () => {
      const ended = vi.fn();
      void playMotion(scene, motionOf()).then(ended);

      await Promise.resolve();

      expect(ended).not.toHaveBeenCalled();
    });

    describe('when the settings do not play the kind of the effect', () => {
      beforeEach(() => {
        vi.spyOn(EffectSettings, 'plays').mockReturnValue(false);
      });

      it('creates no tween and leaves the final values at once', async () => {
        const target = { alpha: 0, scaleX: 1 };

        await playMotion(scene, motionOf({ targets: target, to: { alpha: 1, scaleX: { from: 3, to: 2 } } }));

        expect([configs.length, target]).toEqual([0, { alpha: 1, scaleX: 2 }]);
      });

      it('leaves nothing to set in a motion that goes back to where it started', async () => {
        const target = { x: 5 };

        await playMotion(scene, motionOf({ targets: target, to: { x: 15 }, yoyo: true }));

        expect(target).toEqual({ x: 5 });
      });

      it('shows the final value of a counter through its update', async () => {
        const counter = { value: 10 };
        const shown: number[] = [];

        await playMotion(scene, motionOf({ targets: counter, to: { value: 4 }, onUpdate: () => shown.push(counter.value) }));

        expect(shown).toEqual([4]);
      });
    });
  });
});

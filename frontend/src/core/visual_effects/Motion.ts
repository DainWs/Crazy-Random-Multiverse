import type { EffectKind } from '@/core/EffectSettings';
import Phaser from 'phaser';
import EffectSettings from '@/core/EffectSettings';

/** The three durations of every animation (VIEW-30). */
type MotionSpeed = 'FAST' | 'MEDIUM' | 'SLOW';

/** The four curves of every animation (VIEW-31): `ENTER` slows down at the end, `LEAVE` starts slowly and speeds up, `TRAVEL` is slow at both ends and `STRIKE` speeds up until it stops. */
type MotionCurve = 'ENTER' | 'LEAVE' | 'TRAVEL' | 'STRIKE';

/** A Phaser ease that an effect keeps as its own constant, because it is not one of the four curves yet. */
type ExceptionEase = { ease: string };

type MotionTarget = object | object[];

type Motion = {
  targets: MotionTarget;
  /** The final values. A value `{ from, to }` starts at `from` and ends at `to`. */
  to: Record<string, unknown>;
  /** A speed of the scale, or the milliseconds of a named exception of the effect. */
  duration: MotionSpeed | number;
  curve: MotionCurve | ExceptionEase;
  kind: EffectKind;
  delay?: number;
  hold?: number;
  completeDelay?: number;
  yoyo?: boolean;
  repeat?: number;
  loop?: number;
  onUpdate?: () => void;
};

const MOTION_DURATIONS_MS = new Map<MotionSpeed, number>([
  ['FAST', 150],
  ['MEDIUM', 250],
  ['SLOW', 400]
]);

const MOTION_EASES = new Map<MotionCurve, string>([
  ['ENTER', 'Power1'],
  ['LEAVE', 'Quad.easeIn'],
  ['TRAVEL', 'Sine.easeInOut'],
  ['STRIKE', 'Cubic.easeIn']
]);

/** The milliseconds of a duration of a motion, from the scale or from the named exception. */
function durationOf(duration: MotionSpeed | number): number {
  return typeof duration === 'number' ? duration : MOTION_DURATIONS_MS.get(duration)!;
}

function easeOf(curve: MotionCurve | ExceptionEase): string {
  return typeof curve === 'string' ? MOTION_EASES.get(curve)! : curve.ease;
}

/**
 * The only function that creates a tween. It resolves when the tween ends or when the scene shuts down, which drops its tweens
 * without completing. A tween killed with `killTweensOf` never resolves, so nothing that waits is killed.
 */
function playMotion(scene: Phaser.Scene, motion: Motion): Promise<void> {
  if (!EffectSettings.plays(motion.kind)) {
    applyFinalState(motion);

    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const finish = () => {
      scene.events.off(Phaser.Scenes.Events.SHUTDOWN, finish);
      resolve();
    };
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, finish);

    scene.tweens.add({ ...toTweenConfig(motion), onComplete: finish });
  });
}

const OPTION_KEYS = ['delay', 'hold', 'completeDelay', 'yoyo', 'repeat', 'loop'] as const;

/** Only what the motion sets goes to Phaser: a key set to `undefined` would replace its default. */
function toTweenConfig(motion: Motion): Phaser.Types.Tweens.TweenBuilderConfig {
  const options: Record<string, unknown> = {};

  for (const key of OPTION_KEYS) {
    if (motion[key] !== undefined) {
      options[key] = motion[key];
    }
  }

  if (motion.onUpdate) {
    options.onUpdate = motion.onUpdate;
  }

  return {
    targets: motion.targets,
    ...motion.to,
    ...options,
    duration: durationOf(motion.duration),
    ease: easeOf(motion.curve),
    persist: false
  };
}

/** A motion that goes back to where it started, or never ends, leaves nothing to set. */
function applyFinalState(motion: Motion): void {
  const returnsToStart = motion.yoyo === true || motion.loop !== undefined;
  const targets = Array.isArray(motion.targets) ? motion.targets : [motion.targets];

  if (!returnsToStart) {
    for (const target of targets) {
      Object.assign(target, finalValues(motion.to));
    }
  }

  motion.onUpdate?.();
}

function finalValues(to: Record<string, unknown>): Record<string, unknown> {
  const values: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(to)) {
    const isFromTo = typeof value === 'object' && value !== null && 'to' in value;
    values[key] = isFromTo ? (value as { to: unknown }).to : value;
  }

  return values;
}

export type { ExceptionEase, Motion, MotionCurve, MotionSpeed };
export { durationOf, MOTION_DURATIONS_MS, MOTION_EASES, playMotion };

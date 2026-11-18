import type { Motion } from '@/core/visual_effects/Motion';

type Overlay = Phaser.GameObjects.GameObject;

type OverlayTween = 'appear' | 'disappear' | 'hover' | 'unhover' | 'heartbeat';
type OverlayTweenProvider = (overlay: Overlay) => Motion;

/** How much a target under the pointer grows, relative to its own scale. */
const TARGET_HOVER_SCALE = 1.035;

/** Alpha of the overlay once it has appeared. */
const OVERLAY_ALPHA = 0.6;

/** Duration in ms of the overlay appearing. Not in the scale of `VIEW-30`: Phase 11.4 changes it. */
const APPEAR_DURATION = 200;

/** Duration in ms of the overlay disappearing. Not in the scale of `VIEW-30`: Phase 11.4 changes it. */
const DISAPPEAR_DURATION = 500;

/** Ease of the overlay disappearing. Not one of the four curves: Phase 11.4 changes it (`VIEW-31`). */
const DISAPPEAR_EASE = { ease: 'Power1' };

/** Duration in ms of one beat of the overlay: it goes to full alpha and back. Not in the scale of `VIEW-30`. */
const HEARTBEAT_DURATION = 2000;

const NONE_EASE = { ease: 'Linear' };

function noneTween(overlay: Overlay): Motion {
  return {
    targets: overlay,
    to: { scale: 1 },
    duration: 0,
    curve: NONE_EASE,
    kind: 'ESSENTIAL'
  };
}

function appearTween(overlay: Overlay): Motion {
  return {
    targets: overlay,
    to: { alpha: { from: 0, to: OVERLAY_ALPHA } },
    duration: APPEAR_DURATION,
    curve: 'ENTER',
    kind: 'ESSENTIAL'
  };
}

function disappearTween(overlay: Overlay): Motion {
  return {
    targets: overlay,
    to: { alpha: 0 },
    duration: DISAPPEAR_DURATION,
    curve: DISAPPEAR_EASE,
    kind: 'ESSENTIAL'
  };
}

function hoverTween(overlay: Overlay): Motion {
  return {
    targets: overlay,
    to: { scale: TARGET_HOVER_SCALE },
    duration: 'FAST',
    curve: 'ENTER',
    kind: 'ESSENTIAL'
  };
}

function unhoverTween(overlay: Overlay): Motion {
  return {
    targets: overlay,
    to: { scale: 1 },
    duration: 'FAST',
    curve: 'ENTER',
    kind: 'ESSENTIAL'
  };
}

function heartbeatTween(overlay: Overlay): Motion {
  return {
    targets: overlay,
    to: { alpha: 1 },
    duration: HEARTBEAT_DURATION,
    curve: 'TRAVEL',
    kind: 'NON_ESSENTIAL',
    yoyo: true,
    loop: Number.MAX_VALUE
  };
}

const tweens = new Map<OverlayTween, OverlayTweenProvider>();
tweens.set('appear', appearTween);
tweens.set('disappear', disappearTween);
tweens.set('hover', hoverTween);
tweens.set('unhover', unhoverTween);
tweens.set('heartbeat', heartbeatTween);

const resolveTween = (overlay: Overlay, tween: OverlayTween): Motion => {
  const provider = tweens.get(tween) ?? noneTween;
  return provider(overlay);
}

export type { OverlayTween };
export { APPEAR_DURATION };
export default resolveTween;

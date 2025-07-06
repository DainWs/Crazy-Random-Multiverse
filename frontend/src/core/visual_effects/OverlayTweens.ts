type Overlay = Phaser.GameObjects.GameObject;
type TweenConfig = Phaser.Types.Tweens.TweenBuilderConfig;

type OverlayTween = 'appear' | 'disappear' | 'hover' | 'unhover' | 'heartbeat';
type OverlayTweenProvider = (overlay: Overlay) => TweenConfig;

function noneTween(overlay: Overlay) {
  return {
    targets: overlay,
    scale: 1,
    duration: 0,
    ease: 'Linear',
    persist: false
  };
};

function appearTween(overlay: Overlay): TweenConfig {
  return {
    targets: overlay,
    alpha: { from: 0, to: 0.6 },
    duration: 200,
    ease: 'Power1',
    persist: false
  };
}

function disappearTween(overlay: Overlay): TweenConfig {
  return {
    targets: overlay,
    alpha: 0,
    duration: 500,
    ease: 'Power1',
    persist: false
  }
}

function hoverTween(overlay: Overlay): TweenConfig {
  return {
    targets: overlay,
    scale: 1.035,
    duration: 150,
    ease: 'Power1',
    persist: false
  };
}

function unhoverTween(overlay: Overlay): TweenConfig {
  return {
    targets: overlay,
    scale: 1,
    duration: 150,
    ease: 'Power1',
    persist: false
  }
}

function heartbeatTween(overlay: Overlay): TweenConfig {
  return {
    targets: overlay,
    alpha: 1,
    ease: 'Sine.easeInOut',
    duration: 2000,
    yoyo: true,
    loop: Number.MAX_VALUE
  }
}

const tweens = new Map<OverlayTween, OverlayTweenProvider>();
tweens.set('appear', appearTween);
tweens.set('disappear', disappearTween);
tweens.set('hover', hoverTween);
tweens.set('unhover', unhoverTween);
tweens.set('heartbeat', heartbeatTween);

const resolveTween = (overlay: Overlay, tween: OverlayTween): TweenConfig => {
  const provider = tweens.get(tween) ?? noneTween;
  return provider(overlay);
}

export type { OverlayTween };
export default resolveTween;
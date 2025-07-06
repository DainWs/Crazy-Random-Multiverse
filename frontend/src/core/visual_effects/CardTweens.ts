import { CardView } from "@/game/cards/CardView";

type TweenConfig = Phaser.Types.Tweens.TweenBuilderConfig;

type CardTween = 'hover' | 'unhover';
type CardTweenProvider = (card: CardView) => TweenConfig;

function noneTween(card: CardView) {
  return {
    targets: card,
    scale: 1,
    duration: 0,
    ease: 'Linear',
    persist: false
  };
};

function hoverTween(card: CardView): TweenConfig {
  return {
    targets: card,
    scale: 1.035,
    duration: 150,
    ease: 'Power1',
    persist: false
  };
}

function unhoverTween(card: CardView): TweenConfig {
  return {
    targets: card,
    scale: 1,
    duration: 150,
    ease: 'Power1',
    persist: false
  }
}

const tweens = new Map<CardTween, CardTweenProvider>();
tweens.set('hover', hoverTween);
tweens.set('unhover', unhoverTween);

const resolveTween = (card: CardView, tween: CardTween): TweenConfig => {
  const provider = tweens.get(tween) ?? noneTween;
  return provider(card);
}

export type { CardTween };
export default resolveTween;
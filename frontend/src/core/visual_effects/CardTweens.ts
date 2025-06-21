import { CardView } from "@/game/cards/CardView";

type TweenConfig = Phaser.Types.Tweens.TweenBuilderConfig;

type CardTween = 'hover' | 'unhover';
type CardTweenProvider = (card: CardView) => TweenConfig;

function noneTween(card: CardView) {
  return {
    targets: card,
    scale: 1,
    duration: 0,
    ease: 'Linear'
  };
};

function hoverTween(card: CardView): TweenConfig {
  return {
    targets: card,
    scale: 1.1,
    duration: 150,
    ease: 'Power1'
  };
}

function unhoverTween(card: CardView): TweenConfig {
  return {
    targets: card,
    scale: 1,
    duration: 150,
    ease: 'Power1'
  }
}

const tweens = new Map<CardTween, CardTweenProvider>();
tweens.set('hover', hoverTween);
tweens.set('unhover', unhoverTween);

const resolveCardTween = (tween: CardTween): CardTweenProvider => {
  return tweens.get(tween) ?? noneTween;
}

export { hoverTween, unhoverTween }
export type { CardTween, CardTweenProvider };
export default resolveCardTween;
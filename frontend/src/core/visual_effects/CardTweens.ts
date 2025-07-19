import { CardView } from "@/game/cards/CardView";

type TweenConfig = Phaser.Types.Tweens.TweenBuilderConfig;

type CardTween = 'hover' | 'unhover' | 'hand_horizontal_slide' | 'move_to_hand';
type CardTweenProvider = (card: CardView, args: unknown[]) => TweenConfig;

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

function handHorizontalSlideTween(card: CardView, args: unknown[]): TweenConfig {
  const [x, y] = args as number[];

  return {
    targets: card,
    x, y,
    duration: 250,
    ease: 'Power1',
    persist: false
  };
}

function moveToHandTween(card: CardView, args: unknown[]): TweenConfig {
  const [x, y, delay] = args as number[];

  return {
    targets: card,
    x, y, delay, 
    duration: 500,
    completeDelay: 100,
    ease: 'Power1',
    persist: false
  };
}

const tweens = new Map<CardTween, CardTweenProvider>();
tweens.set('hover', hoverTween);
tweens.set('unhover', unhoverTween);
tweens.set('hand_horizontal_slide', handHorizontalSlideTween);
tweens.set('move_to_hand', moveToHandTween);

const resolveTween = (card: CardView, tween: CardTween, ...args: unknown[]): TweenConfig => {
  const provider = tweens.get(tween) ?? noneTween;
  return provider(card, args);
}

export type { CardTween };
export default resolveTween;
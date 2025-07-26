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

const SLIDE_TO_DURATION = 250;
function slideToTween(card: CardView, [x, y]: unknown[]): TweenConfig {
  return {
    targets: card,
    x, y,
    duration: SLIDE_TO_DURATION,
    ease: 'Power1',
    persist: false
  };
}

const MOVE_TO_DURATION = 500;
function moveToTween(card: CardView, [x, y, delay]: unknown[]): TweenConfig {
  return {
    targets: card,
    x, y, 
    delay: delay as number, 
    duration: MOVE_TO_DURATION,
    completeDelay: 100,
    ease: 'Power1',
    persist: false
  };
}

export { SLIDE_TO_DURATION, MOVE_TO_DURATION };
export { noneTween,  hoverTween, unhoverTween, slideToTween, moveToTween };
export type { CardTween, CardTweenProvider };
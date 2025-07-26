import CardView from "@/game/cards/CardView";
import * as Tweens from "@/game/cards/CardTweens";
import * as Animations from "@/game/cards/CardAnimations";
import { CardTween, CardTweenProvider } from "@/game/cards/CardTweens";
import { CardAnimation, CardAnimationApplier } from "@/game/cards/CardAnimations";

const cardTweens = new Map<CardTween, CardTweenProvider>();
cardTweens.set('hover', Tweens.hoverTween);
cardTweens.set('unhover', Tweens.unhoverTween);
cardTweens.set('hand_horizontal_slide', Tweens.slideToTween);
cardTweens.set('move_to_hand', Tweens.moveToTween);

const cardAnimations = new Map<CardAnimation, CardAnimationApplier>();
cardAnimations.set('startDrag', Animations.startDragAnimation);
cardAnimations.set('endDrag', Animations.endDragAnimation);

function playTween(card: CardView, tween: CardTween, ...args: unknown[]): Phaser.Tweens.Tween {
  const provider = cardTweens.get(tween) ?? Tweens.noneTween;
  const tweenConfig = provider(card, args);
  return card.scene.tweens.add(tweenConfig);
}

function playAnimation(card: CardView, animation: CardAnimation): void {
  const apply = cardAnimations.get(animation) ?? Animations.noneAnimation;
  apply(card);
}

const CardAnimator = {
  playTween,
  playAnimation,
}

export default CardAnimator;
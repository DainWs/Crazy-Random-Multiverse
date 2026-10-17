import type CardView from "@/game/cards/CardView";
import type { CardTween, CardTweenProvider } from "@/core/visual_effects/CardTweens";
import type { CardAnimation, CardAnimationApplier } from "@/core/visual_effects/CardAnimations";
import * as Tweens from "@/core/visual_effects/CardTweens";
import * as Animations from "@/core/visual_effects/CardAnimations";
import { GameScene } from "@/scenes/Game";

const cardTweens = new Map<CardTween, CardTweenProvider>();
cardTweens.set('hover', Tweens.hoverTween);
cardTweens.set('unhover', Tweens.unhoverTween);
cardTweens.set('horizontal_slide', Tweens.slideToTween);
cardTweens.set('move_to_hand', Tweens.moveToTween);
cardTweens.set('preview_in_zone_slot', Tweens.previewInZoneSlotTween);

const cardAnimations = new Map<CardAnimation, CardAnimationApplier>();
cardAnimations.set('startDrag', Animations.startDragAnimation);
cardAnimations.set('endDrag', Animations.endDragAnimation);

function playTween(card: CardView, tween: CardTween, ...args: unknown[]): Phaser.Tweens.Tween {
  const provider = cardTweens.get(tween) ?? Tweens.noneTween;
  const tweenConfig = provider(card, args);
  return card.scene.tweens.add(tweenConfig);
}

function playAnimation(scene: GameScene, card: CardView, animation: CardAnimation): void {
  const apply = cardAnimations.get(animation) ?? Animations.noneAnimation;
  apply(scene, card);
}

const CardAnimator = {
  playTween,
  playAnimation,
}

export default CardAnimator;
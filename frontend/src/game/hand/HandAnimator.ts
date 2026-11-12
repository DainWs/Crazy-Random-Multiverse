import type { Point2D } from "@/domain/Geometry";
import type CardView from "@/game/cards/CardView";
import type HandView from "@/game/hand/HandView";
import CardAnimator from "@/core/visual_effects/CardAnimator";
import { MOVE_TO_DURATION } from "@/core/visual_effects/CardTweens";

type OnCompleteCallback = () => void;
const NoneCallback = () => { };

/** Time the hand takes to rise or sink when hovered, in ms. */
const HAND_EXPANSION_DURATION = 250;
/** Time the hand takes to sink while a card is dragged, in ms. */
const HAND_HIDE_DURATION = 100;

class HandAnimator {

  /** Always starts from where the hand is, so the last request wins and a collapse is never dropped. */
  public animateHandExpansion(handView: HandView, targetHiddenRatio: number, duration: number = HAND_EXPANSION_DURATION) {
    handView.scene.tweens.killTweensOf(handView);
    handView.scene.tweens.add({
      targets: handView,
      hiddenRatio: targetHiddenRatio,
      duration,
      ease: 'Cubic.easeOut',
      persist: false
    });
  }


  public animateIncomingCards(fromPoint: Point2D, handCards: CardView[], incomingCards: CardView[], onComplete: OnCompleteCallback = NoneCallback) {
    this.setInteractiveForCardViews(handCards, false);

    const tweenDelay = 200;
    for (let i = 0; i < incomingCards.length; i++) {
      const cardView = incomingCards[i];
      const originalPosition = cardView.getOriginalPosition();
      cardView.setPosition(fromPoint.x, fromPoint.y);
      CardAnimator.playTween(cardView, 'move_to_hand', originalPosition.x, originalPosition.y, tweenDelay * i);
    }

    setTimeout(() => {
      this.setInteractiveForCardViews(handCards, true);
      onComplete();
    }, MOVE_TO_DURATION + (incomingCards.length * tweenDelay));
  }

  private setInteractiveForCardViews(cardViews: CardView[], isInteractive: boolean) {
    if (isInteractive) {
      cardViews.forEach(card => card.setInteractive());
    } else {
      cardViews.forEach(card => card.disableInteractive());
    }
  }

  public sliceCard(cardView: CardView, x: number, y: number): void {
    CardAnimator.playTween(cardView, 'horizontal_slide', x, y);
  }
}

export { HAND_HIDE_DURATION };
export default HandAnimator;
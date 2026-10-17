import type { Point2D } from "@/domain/Geometry";
import type CardView from "@/game/cards/CardView";
import type HandView from "@/game/hand/HandView";
import CardAnimator from "@/core/visual_effects/CardAnimator";
import { MOVE_TO_DURATION, SLIDE_TO_DURATION } from "@/core/visual_effects/CardTweens";

type OnCompleteCallback = () => void;
const NoneCallback = () => { };

class HandAnimator {

  private animationInProgress: boolean;

  constructor() {
    this.animationInProgress = false;
  }

  public animateHandExpansion(handView: HandView, targetY: number, duration: number = 250) {
    if (this.animationInProgress) return;
    this.animationInProgress = true;

    handView.scene.tweens.add({
      targets: handView,
      y: targetY,
      duration,
      ease: 'Cubic.easeOut',
      overwrite: true,
      persist: false
    }).on('complete', () => this.animationInProgress = false);
  }


  public animateIncomingCards(fromPoint: Point2D, handCards: CardView[], incomingCards: CardView[], onComplete: OnCompleteCallback = NoneCallback) {
    this.setInteractiveForCardViews(handCards, false);
    this.animationInProgress = true;

    const tweenDelay = 200;
    for (let i = 0; i < incomingCards.length; i++) {
      const cardView = incomingCards[i];
      const originalPosition = cardView.getOriginalPosition();
      cardView.setPosition(fromPoint.x, fromPoint.y);
      CardAnimator.playTween(cardView, 'move_to_hand', originalPosition.x, originalPosition.y, tweenDelay * i);
    }

    setTimeout(() => {
      this.setInteractiveForCardViews(handCards, true);
      this.animationInProgress = false;
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

export default HandAnimator;
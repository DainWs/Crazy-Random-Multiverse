import { Point2D } from "@/domain/Geometry";
import { MOVE_TO_DURATION } from "@/game/cards/CardTweens";
import CardView from "@/game/cards/CardView";
import HandView from "@/game/hand/HandView";

type OnCompleteCallback = () => void;
const NoneCallback = () => {};

class HandAnimator {
  public animateHandExpansion(handView: HandView, targetY: number, duration: number = 250) {
    handView.scene.tweens.add({
      targets: handView,
      y: targetY,
      duration,
      ease: 'Cubic.easeOut',
      overwrite: true,
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
      cardView.applyTween('move_to_hand', originalPosition.x, originalPosition.y, tweenDelay * i);
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
    cardView.applyTween('hand_horizontal_slide', x, y);
  }
}

export default HandAnimator;
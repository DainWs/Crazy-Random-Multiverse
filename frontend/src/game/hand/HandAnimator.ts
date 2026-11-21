import type CardView from "@/game/cards/CardView";
import type HandView from "@/game/hand/HandView";
import CardAnimator from "@/core/visual_effects/CardAnimator";
import type { MotionSpeed } from "@/core/visual_effects/Motion";
import { durationOf, playMotion } from "@/core/visual_effects/Motion";
import { HAND_ARRIVAL_STAGGER_MS, HAND_ARRIVAL_DEPTH_BOOST } from "@/core/Constants";

type OnCompleteCallback = () => void;
const NoneCallback = () => { };

/** The hand sinks below the bottom edge while a card is dragged in the fast duration of the scale (VIEW-32). */
const HAND_HIDE_DURATION: MotionSpeed = 'FAST';

class HandAnimator {

  /** Always starts from where the hand is, so the last request wins and a collapse is never dropped. */
  public animateHandExpansion(handView: HandView, targetHiddenRatio: number, duration: MotionSpeed | number = 'MEDIUM') {
    handView.scene.tweens.killTweensOf(handView);
    void playMotion(handView.scene, {
      targets: handView,
      to: { hiddenRatio: targetHiddenRatio },
      duration,
      curve: 'ENTER',
      kind: 'ESSENTIAL'
    });
  }


  /**
   * Each card slides in from `fromX`, outside the left edge of the screen, at the height of its slot and above the cards of the hand,
   * 150 ms after the previous one (VIEW-8).
   */
  public animateIncomingCards(fromX: number, handCards: CardView[], incomingCards: CardView[], onComplete: OnCompleteCallback = NoneCallback) {
    this.setInteractiveForCardViews(handCards, false);

    incomingCards.forEach((cardView, index) => {
      const originalPosition = cardView.getOriginalPosition();
      cardView.setPosition(fromX, originalPosition.y);
      cardView.setDepth(cardView.getOriginalDepth() + HAND_ARRIVAL_DEPTH_BOOST);
      void CardAnimator.playTween(cardView, 'move_to_hand', originalPosition.x, originalPosition.y, HAND_ARRIVAL_STAGGER_MS * index)
        .then(() => cardView.resetDepth());
    });

    const lastArrivalEnds = durationOf('MEDIUM') + HAND_ARRIVAL_STAGGER_MS * Math.max(incomingCards.length - 1, 0);
    setTimeout(() => {
      this.setInteractiveForCardViews(handCards, true);
      onComplete();
    }, lastArrivalEnds);
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
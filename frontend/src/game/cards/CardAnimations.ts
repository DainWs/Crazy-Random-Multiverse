import { CardView } from "@/game/cards/CardView";

type CardAnimation = 'startDrag' | 'endDrag';
type CardAnimationApplier = (card: CardView) => void;

function noneAnimation() {}

function startDragAnimation(cardView: CardView): void {
  cardView.hideTooltip();
  cardView.setScale(1);
  cardView.setDepth(9000);
  cardView.setAlpha(1);
}

function endDragAnimation(cardView: CardView): void {
  cardView.setScale(1);
  cardView.resetDepth();
  cardView.setAlpha(1);
  cardView.hideTooltip();
}

export type { CardAnimation, CardAnimationApplier };
export { noneAnimation, startDragAnimation, endDragAnimation };
import { CardView } from "@/game/cards/CardView";

type CardAnimation = 'startDrag' | 'endDrag';
type CardAnimationApplier = (card: CardView) => void;

function noneAnimation() {}

function startDragAnimation(card: CardView): void {
  card.hideTooltip();
  card.setScale(1);
  card.setDepth(12); // TODO increment default card depth
  // card.setDepth(card.getDepth() + 1); 
  card.setAlpha(1);
}

function endDragAnimation(card: CardView): void {
  card.setScale(1);
  card.resetDepth();
  card.setAlpha(1);
  card.showTooltip();
}

export type { CardAnimation, CardAnimationApplier };
export { noneAnimation, startDragAnimation, endDragAnimation };
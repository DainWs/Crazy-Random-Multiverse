import { CardView } from "@/game/cards/CardView";

type CardAnimation = 'startDrag' | 'endDrag';
type CardAnimationApplier = (card: CardView) => void;

function noneAnimation() {};

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

const animations = new Map<CardAnimation, CardAnimationApplier>();
animations.set('startDrag', startDragAnimation);
animations.set('endDrag', endDragAnimation);

const resolveCardAnimation = (animation: CardAnimation) => {
  return animations.get(animation) ?? noneAnimation;
}

export { startDragAnimation, endDragAnimation };
export type { CardAnimation, CardAnimationApplier };
export default resolveCardAnimation;
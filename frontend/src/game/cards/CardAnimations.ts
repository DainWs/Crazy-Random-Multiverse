import { CardView } from "@/game/cards/CardView";

type CardAnimation = 'startDrag' | 'endDrag';
type CardAnimationApplier = (card: CardView) => void;

type DragAnimationMemory = { parentIndex: number };
type AnimationMemories = DragAnimationMemory;

const memory: Map<string, AnimationMemories> = new Map();

function noneAnimation() {}

function startDragAnimation(cardView: CardView): void {
  cardView.hideTooltip();
  cardView.setScale(1);
  cardView.setDepth(9000);
  cardView.setAlpha(1);

  const indexBeforeAnimation = cardView.parentContainer.getIndex(cardView);
  memory.set(cardView.card.uuid, { parentIndex: indexBeforeAnimation });

  if (cardView.parentContainer) {
    cardView.parentContainer.bringToTop(cardView);
  }
}

function endDragAnimation(cardView: CardView): void {
  cardView.setScale(1);
  cardView.resetDepth();
  cardView.setAlpha(1);
  cardView.hideTooltip();

  const startMemory = memory.get(cardView.card.uuid);
  if (startMemory) {
    memory.delete(cardView.card.uuid);
    cardView.parentContainer.moveTo(cardView, startMemory.parentIndex);
  }
}

export type { CardAnimation, CardAnimationApplier };
export { noneAnimation, startDragAnimation, endDragAnimation };
import type CardView from "@/game/cards/CardView";
import CardAnimator from "@/core/visual_effects/CardAnimator";

const BEHIND_CARD_OFFSET = 20;

interface CardStackLayoutHelper {
  revealCard(combatant: CardView, stackedCard: CardView): void;
  hideCard(combatant: CardView, stackedCard: CardView): void;
  calculateOffset(angle: number): [number, number];
}

const revealCard = (combatant: CardView, stackedCard: CardView) => {
  const [xWithOffset, yWithOffset] = calculateRevealedOffset(combatant.angle, combatant.width);
  CardAnimator.playTween(stackedCard, 'horizontal_slide', xWithOffset, yWithOffset);
}

const hideCard = (combatant: CardView, stackedCard: CardView) => {
  const [xWithOffset, yWithOffset] = calculateOffset(combatant.angle);
  CardAnimator.playTween(stackedCard, 'horizontal_slide', xWithOffset, yWithOffset);
}

function calculateOffset(angle: number, index: number = 1): [number, number] {
  const offset = BEHIND_CARD_OFFSET * index;
  if (angle === 90) return [0, offset];
  if (angle === 180) return [offset, 0];
  if (angle === -90) return [0, -offset];
  return [-offset, 0];
}

function calculateRevealedOffset(angle: number, cardWidth: number, index: number = 1): [number, number] {
  const totalOffset = (BEHIND_CARD_OFFSET * index) + cardWidth;
  if (angle === 90) return [0, totalOffset];
  if (angle === 180) return [totalOffset, 0];
  if (angle === -90) return [0, -totalOffset];
  return [-totalOffset, 0];
}

const BASE_CARD_STACK_LAYOUT_HELPER: CardStackLayoutHelper = {
  revealCard,
  hideCard,
  calculateOffset
}

export { BEHIND_CARD_OFFSET, calculateOffset, calculateRevealedOffset };
export type { CardStackLayoutHelper }
export default BASE_CARD_STACK_LAYOUT_HELPER;
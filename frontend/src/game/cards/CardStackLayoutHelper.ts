import type CardView from "@/game/cards/CardView";
import CardAnimator from "@/core/visual_effects/CardAnimator";

/** How much of each piece of equipment shows behind its combatant at rest, in px of card space. */
const BEHIND_CARD_OFFSET = 20;

/**
 * The offsets are in the space of the combatant, which is rotated with its zone, so a piece slides out
 * towards the left of its card in every zone. `index` counts the pieces from 1, the nearest to the card.
 */
interface CardStackLayoutHelper {
  revealCard(combatant: CardView, stackedCard: CardView, index: number): void;
  hideCard(combatant: CardView, stackedCard: CardView, index: number): void;
  calculateOffset(index: number): [number, number];
}

const revealCard = (combatant: CardView, stackedCard: CardView, index: number) => {
  const [xWithOffset, yWithOffset] = calculateRevealedOffset(combatant.width, index);
  CardAnimator.playTween(stackedCard, 'horizontal_slide', xWithOffset, yWithOffset);
}

const hideCard = (_combatant: CardView, stackedCard: CardView, index: number) => {
  const [xWithOffset, yWithOffset] = calculateOffset(index);
  CardAnimator.playTween(stackedCard, 'horizontal_slide', xWithOffset, yWithOffset);
}

function calculateOffset(index: number): [number, number] {
  return [-(BEHIND_CARD_OFFSET * index), 0];
}

/** Each piece slides out one card width further than the previous one, so every piece shows whole. */
function calculateRevealedOffset(cardWidth: number, index: number): [number, number] {
  return [-(BEHIND_CARD_OFFSET + cardWidth * index), 0];
}

const BASE_CARD_STACK_LAYOUT_HELPER: CardStackLayoutHelper = {
  revealCard,
  hideCard,
  calculateOffset
}

export { BEHIND_CARD_OFFSET, calculateOffset, calculateRevealedOffset };
export type { CardStackLayoutHelper }
export default BASE_CARD_STACK_LAYOUT_HELPER;

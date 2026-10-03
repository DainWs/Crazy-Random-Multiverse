import { Point2D } from "@/domain/Geometry";

/**
 * A framework-independent calculator that handles exponential decay card spacing,
 * total hand width, symmetric slot centering around 0, sliced overlap offsets,
 * and hand base positioning
 */

interface SpaceBetweenCardOptions {
  min: number;
  max: number;
  decayFactor: number;
}

const DEFAULT_SPACE_BETWEEN_CARDS: SpaceBetweenCardOptions = {
  min: 20,
  max: 250,
  decayFactor: 0.2,
};

class HandLayoutCalculator {
  public readonly options: SpaceBetweenCardOptions;

  public constructor(options?: Partial<SpaceBetweenCardOptions>) {
    this.options = { ...DEFAULT_SPACE_BETWEEN_CARDS, ...options };
  }

  public calculateSpaceBetweenCards(cardLength: number): number {
    if (cardLength <= 0) return 0;
    const spacingRange = this.options.max - this.options.min;
    const decay = Math.exp(-this.options.decayFactor * (cardLength - 1));
    return this.options.min + spacingRange * decay;
  }

  public calculateTotalWidth(cardLength: number, cardWidth: number): number {
    if (cardLength <= 0) return 0;
    const spaceBetweenCards = this.calculateSpaceBetweenCards(cardLength);
    return (cardLength - 1) * spaceBetweenCards + cardWidth;
  }

  public calculateSlotPositionFromIndex(
    index: number,
    cardLength: number,
    handWidth: number,
    cardWidth: number
  ): Point2D {
    const spaceBetweenCards = this.calculateSpaceBetweenCards(cardLength);
    const xOffset = cardWidth / 2 + index * spaceBetweenCards;
    const x = xOffset - handWidth / 2;
    return { x, y: 0 };
  }

  public calculateXOffsetForSlicedCard(cardLength: number, cardWidth: number): number {
    return cardWidth - this.calculateSpaceBetweenCards(cardLength);
  }

  public calculateHandBasePosition(totalWidth: number, totalHeight: number, screenHeight: number): Point2D {
    return {
      x: totalWidth / 2,
      y: screenHeight - totalHeight / 2
    };
  }
}

export type { SpaceBetweenCardOptions };
export { DEFAULT_SPACE_BETWEEN_CARDS, HandLayoutCalculator };
export default HandLayoutCalculator;

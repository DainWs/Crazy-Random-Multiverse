import { describe, expect, it } from 'vitest';
import {
  calculateRevealedOffset as calculateRevealedCardOffset,
  calculateOffset as calculateStackedCardOffset
} from '@/game/cards/CardStackLayoutHelper';

// VIEW-14
describe('CardStackLayoutHelper', () => {
  describe('calculateStackedCardOffset', () => {
    it('shows the strip of the first piece to the left of the card', () => {
      expect(calculateStackedCardOffset(1)).toEqual([-20, 0]);
    });

    it('moves each piece one strip further behind', () => {
      expect(calculateStackedCardOffset(3)).toEqual([-60, 0]);
    });
  });

  describe('calculateRevealedCardOffset', () => {
    const cardWidth = 200;

    it('slides the first piece out by a card width plus its strip', () => {
      expect(calculateRevealedCardOffset(cardWidth, 1)).toEqual([-220, 0]);
    });

    it('slides each piece one card width further than the previous', () => {
      expect(calculateRevealedCardOffset(cardWidth, 2)).toEqual([-420, 0]);
    });
  });
});

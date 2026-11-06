import { describe, expect, it } from 'vitest';
import type CardView from '@/game/cards/CardView';
import HandView from '@/game/hand/HandView';

type FakeHand = {
  cards: CardView[];
  removeCard: (card: CardView) => void;
};

const createFakeHand = (cardCount: number): FakeHand => {
  const hand: FakeHand = {
    cards: Array.from({ length: cardCount }, () => ({}) as unknown as CardView),
    removeCard: (card) => {
      hand.cards.splice(hand.cards.indexOf(card), 1);
    }
  };

  return hand;
};

describe('HandView', () => {
  describe('clearCards', () => {
    // CON-11
    it.each([{ cardCount: 1 }, { cardCount: 4 }, { cardCount: 7 }])('removes all $cardCount cards', ({ cardCount }) => {
      const hand = createFakeHand(cardCount);

      HandView.prototype.clearCards.call(hand);

      expect(hand.cards).toHaveLength(0);
    });
  });
});

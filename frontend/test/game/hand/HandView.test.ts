import { describe, expect, it, vi } from 'vitest';
import Phaser from 'phaser';
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

type FakeCardView = {
  active: boolean;
  visible: boolean;
  parentContainer: unknown;
};

describe('HandView', () => {
  describe('listenToPreRender', () => {
    it('stops updating its bounds once destroyed', () => {
      const sceneEvents = new Phaser.Events.EventEmitter();
      const hand = Object.assign(new Phaser.Events.EventEmitter(), { scene: { events: sceneEvents }, updateBounds: vi.fn() });
      HandView.prototype['listenToPreRender'].call(hand);

      hand.emit(Phaser.GameObjects.Events.DESTROY);

      expect(sceneEvents.listenerCount('prerender')).toBe(0);
    });
  });

  describe('holds', () => {
    const hand = {};
    const createCardView = (overrides: Partial<FakeCardView>): CardView => {
      return { active: true, visible: true, parentContainer: hand, ...overrides } as unknown as CardView;
    };

    it('holds a card shown in the hand', () => {
      const card = createCardView({});

      expect(HandView.prototype.holds.call(hand, card)).toBe(true);
    });

    // HAND-2
    it.each([
      { description: 'dropped on the board', overrides: { parentContainer: {} } },
      { description: 'hidden while the server answers', overrides: { visible: false } },
      { description: 'destroyed', overrides: { active: false } }
    ])('does not hold a card $description', ({ overrides }) => {
      const card = createCardView(overrides);

      expect(HandView.prototype.holds.call(hand, card)).toBe(false);
    });
  });

  describe('clearCards', () => {
    // CON-11
    it.each([{ cardCount: 1 }, { cardCount: 4 }, { cardCount: 7 }])('removes all $cardCount cards', ({ cardCount }) => {
      const hand = createFakeHand(cardCount);

      HandView.prototype.clearCards.call(hand);

      expect(hand.cards).toHaveLength(0);
    });
  });
});

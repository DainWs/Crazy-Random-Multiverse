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

  describe('addCards', () => {
    const createIncomingCard = () => {
      const card = { originalPosition: { x: 0, y: 0 }, setOriginalPosition: vi.fn(), setOriginalDepth: vi.fn() };
      return card as unknown as CardView & { setOriginalPosition: ReturnType<typeof vi.fn> };
    };

    const createHandWithCards = (heldCards: number) => {
      return {
        cards: Array.from({ length: heldCards }, () => ({}) as unknown as CardView),
        cardsDepth: 500,
        y: 0,
        height: 0,
        layoutHelper: { calculateSlotPositionFromIndex: (index: number, length: number) => ({ x: index * 100 + length, y: 0 }) },
        interactionManager: { attachListeners: vi.fn() },
        animator: { animateIncomingCards: vi.fn() },
        addAt: vi.fn()
      };
    };

    // VIEW-8
    it('places the incoming cards after the held ones', () => {
      const hand = createHandWithCards(2);
      const [first, second] = [createIncomingCard(), createIncomingCard()];

      HandView.prototype.addCards.call(hand, first, second);

      expect([first.setOriginalPosition.mock.calls[0], second.setOriginalPosition.mock.calls[0]]).toEqual([
        [204, 0],
        [304, 0]
      ]);
    });
  });

  describe('restCards', () => {
    const createHand = (cardListenersEnabled: boolean) => {
      return {
        cardListenersEnabled,
        hoverIndex: 1,
        cards: [],
        layoutHelper: { calculateXOffsetForSlicedCard: () => 0 },
        animator: { animateHandExpansion: vi.fn() },
        sliceCardsToShowHoverIndex: vi.fn()
      };
    };

    // VIEW-16
    it('lowers the hand to its resting position', () => {
      const hand = createHand(true);

      HandView.prototype.restCards.call(hand);

      expect(hand.animator.animateHandExpansion).toHaveBeenCalledWith(hand, 0.75);
    });

    it('leaves the hand alone while a card is being dragged', () => {
      const hand = createHand(false);

      HandView.prototype.restCards.call(hand);

      expect(hand.animator.animateHandExpansion).not.toHaveBeenCalled();
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

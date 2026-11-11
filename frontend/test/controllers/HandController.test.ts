import { beforeEach, describe, expect, it, vi } from 'vitest';
import type Card from '@/domain/Card';
import type CardView from '@/game/cards/CardView';
import type { GameScene } from '@/scenes/Game';
import CardViewFactory from '@/controllers/CardViewFactory';
import HandController from '@/controllers/HandController';
import cardFactory from '@/fakes/cardFactory';
import ResourceSystem from '@/core/ResourceSystem';

vi.mock('@/controllers/CardViewFactory', () => ({
  default: { createCardView: vi.fn() }
}));

type FakeCardView = { card: Card; destroy: ReturnType<typeof vi.fn> };

const createFakeCardView = (card: Card): FakeCardView => ({ card, destroy: vi.fn() });

describe('HandController', () => {
  let views: FakeCardView[];
  let viewsOutOfHand: Set<FakeCardView>;
  let addCards: ReturnType<typeof vi.fn>;
  let restoreCards: ReturnType<typeof vi.fn>;
  let controller: HandController;

  const shownCards = () => views.map((view) => view.card);

  const showCards = (...cards: Card[]) => {
    views.push(...cards.map(createFakeCardView));
  };

  beforeEach(() => {
    vi.clearAllMocks();
    views = [];
    viewsOutOfHand = new Set();
    addCards = vi.fn((...incoming: FakeCardView[]) => views.push(...incoming));
    restoreCards = vi.fn((...incoming: FakeCardView[]) => views.push(...incoming));
    vi.mocked(CardViewFactory.createCardView).mockImplementation((_scene, card) => createFakeCardView(card) as unknown as CardView);

    const handView = {
      getCards: () => views,
      holds: (view: FakeCardView) => !viewsOutOfHand.has(view),
      addCards,
      restoreCards,
      removeCard: (view: FakeCardView) => views.splice(views.indexOf(view), 1),
      clearCards: () => views.splice(0, views.length)
    };
    const scene = { tweens: { killTweensOf: vi.fn() } } as unknown as GameScene;
    controller = new HandController(scene);
    Object.assign(controller, { handView });
  });

  describe('syncCards', () => {
    // UI-21
    it('retries the image of a card that arrived', () => {
      const retry = vi.spyOn(ResourceSystem, 'retry');
      const card = cardFactory.createWarriorCard({ code: '2' });

      controller.syncCards([card]);

      expect(retry).toHaveBeenCalledWith(card.getImage());
    });

    it('does not retry the image of a card that was already in the hand', () => {
      const retry = vi.spyOn(ResourceSystem, 'retry');
      const card = cardFactory.createWarriorCard({ code: '1' });
      showCards(card);

      controller.syncCards([card]);

      expect(retry).not.toHaveBeenCalled();
    });

    // VIEW-8
    it('animates only the cards that arrived', () => {
      const [first, second] = [cardFactory.createWarriorCard({ code: '1' }), cardFactory.createWarriorCard({ code: '2' })];
      showCards(first);

      controller.syncCards([first, second]);

      expect(addCards.mock.calls[0].map((view: FakeCardView) => view.card)).toEqual([second]);
    });

    it('keeps the views of the cards that stay', () => {
      const [first, second] = [cardFactory.createWarriorCard({ code: '1' }), cardFactory.createWarriorCard({ code: '2' })];
      showCards(first);

      controller.syncCards([first, second]);

      expect(CardViewFactory.createCardView).toHaveBeenCalledTimes(1);
    });

    // HAND-2
    it('removes the cards that left', () => {
      const [first, second] = [cardFactory.createWarriorCard({ code: '1' }), cardFactory.createWarriorCard({ code: '2' })];
      showCards(first, second);

      controller.syncCards([second]);

      expect(shownCards()).toEqual([second]);
    });

    it('destroys the view of a card that left', () => {
      const [first, second] = [cardFactory.createWarriorCard({ code: '1' }), cardFactory.createWarriorCard({ code: '2' })];
      showCards(first, second);
      const leftView = views[0];

      controller.syncCards([second]);

      expect(leftView.destroy).toHaveBeenCalledTimes(1);
    });

    // CON-13
    it('destroys the copy that left the hand', () => {
      const [first, second] = [cardFactory.createWarriorCard({ code: '1' }), cardFactory.createWarriorCard({ code: '1' })];
      showCards(first, second);
      const droppedView = views[1];
      viewsOutOfHand.add(droppedView);

      controller.syncCards([first]);

      expect(droppedView.destroy).toHaveBeenCalledTimes(1);
    });

    // CON-13
    it('keeps the copy that stays in the hand', () => {
      const [first, second] = [cardFactory.createWarriorCard({ code: '1' }), cardFactory.createWarriorCard({ code: '1' })];
      showCards(first, second);
      const stayingView = views[0];
      viewsOutOfHand.add(views[1]);

      controller.syncCards([first]);

      expect(stayingView.destroy).not.toHaveBeenCalled();
    });

    // CON-13
    it('keeps a card waiting for the server', () => {
      const card = cardFactory.createWarriorCard({ code: '1' });
      showCards(card);
      const pendingView = views[0];
      viewsOutOfHand.add(pendingView);

      controller.syncCards([card]);

      expect(pendingView.destroy).not.toHaveBeenCalled();
    });

    // HAND-4
    it('animates nothing for a renumbered copy', () => {
      const [shown, renumbered] = [cardFactory.createWarriorCard({ code: '1' }), cardFactory.createWarriorCard({ code: '1' })];
      showCards(shown);

      controller.syncCards([renumbered]);

      expect(addCards).not.toHaveBeenCalled();
    });

    it('adds nothing when no card arrived', () => {
      const card = cardFactory.createWarriorCard({ code: '1' });
      showCards(card);

      controller.syncCards([card]);

      expect(addCards).not.toHaveBeenCalled();
    });
  });

  describe('restoreCards', () => {
    // VIEW-8
    it('shows the cards without animating them', () => {
      const card = cardFactory.createWarriorCard({ code: '1' });

      controller.restoreCards([card]);

      expect(addCards).not.toHaveBeenCalled();
    });

    // CON-13
    it('replaces the cards shown', () => {
      const [shown, restored] = [cardFactory.createWarriorCard({ code: '1' }), cardFactory.createWarriorCard({ code: '2' })];
      showCards(shown);

      controller.restoreCards([restored]);

      expect(shownCards()).toEqual([restored]);
    });

    it('destroys the views it replaces', () => {
      showCards(cardFactory.createWarriorCard({ code: '1' }));
      const replacedView = views[0];

      controller.restoreCards([]);

      expect(replacedView.destroy).toHaveBeenCalledTimes(1);
    });
  });
});

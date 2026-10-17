import { beforeEach, describe, expect, it } from 'vitest';
import ActionResolver from '@/core/actions/ActionResolver';
import CardPutPattern from '@/core/actions/CardPutPattern';
import CardMovePattern from '@/core/actions/CardMovePattern';
import ActionEvent from '@/domain/ActionEvent';

const createActionEvent = (element: string, input: string): ActionEvent => {
  const event = {
    element,
    input,
    position: { row: 0, column: 0 },
    player: { code: 'player-1', name: 'Player 1' },
    card: null,
  } as unknown as ActionEvent;

  event.getTrigger = () => {
    return { element: event.element, input: event.input };
  }

  return event;
};

describe('ActionResolver', () => {
  describe('with CardPutPattern', () => {
    let resolver: ActionResolver;

    beforeEach(() => {
      resolver = new ActionResolver(new CardPutPattern());
    });

    it('starts incomplete', () => {
      expect(resolver.isComplete()).toBe(false);
    });

    it('accepts source when grab from hand card', () => {
      const event = createActionEvent('Hand.Card', 'Grab');
      expect(resolver.apply(event)).toBe(true);
      expect(resolver.isComplete()).toBe(false);
    });

    it('accepts target when drop on zone slot', () => {
      const source = createActionEvent('Hand.Card', 'Grab');
      const target = createActionEvent('ZoneSlot', 'Drop');

      resolver.apply(source);
      expect(resolver.apply(target)).toBe(true);
      expect(resolver.isComplete()).toBe(true);
    });

    it('rejects events that do not match any condition', () => {
      const event = createActionEvent('ZoneSlot', 'SimpleClick');
      expect(resolver.apply(event)).toBe(false);
      expect(resolver.isComplete()).toBe(false);
    });

    it('creates action when complete', () => {
      const source = createActionEvent('Hand.Card', 'Grab');
      const target = createActionEvent('ZoneSlot', 'Drop');
      resolver.apply(source);
      resolver.apply(target);

      const action = resolver.createAction('game-123');
      expect(action.game).toBe('game-123');
    });

    it('throws when creating action before completion', () => {
      expect(() => resolver.createAction('game-123')).toThrowError('Pattern is not completed');
    });

    it('resets to initial state', () => {
      const source = createActionEvent('Hand.Card', 'Grab');
      resolver.apply(source);
      resolver.reset();

      expect(resolver.isComplete()).toBe(false);
      // After reset, can accept a new source
      expect(resolver.apply(source)).toBe(true);
    });
  });

  describe('with CardMovePattern', () => {
    let resolver: ActionResolver;

    beforeEach(() => {
      resolver = new ActionResolver(new CardMovePattern());
    });

    it('matches grab from zone slot card as source', () => {
      const event = createActionEvent('ZoneSlot.Card', 'Grab');
      expect(resolver.apply(event)).toBe(true);
    });

    it('matches drop on zone slot as target', () => {
      const source = createActionEvent('ZoneSlot.Card', 'Grab');
      const target = createActionEvent('ZoneSlot', 'Drop');

      resolver.apply(source);
      expect(resolver.apply(target)).toBe(true);
      expect(resolver.isComplete()).toBe(true);
    });

    it('does not match hand card grab as source', () => {
      const event = createActionEvent('Hand.Card', 'Grab');
      expect(resolver.apply(event)).toBe(false);
    });
  });
});

describe('CardPutPattern', () => {
  const pattern = new CardPutPattern();

  it('matches source: Grab + Hand.Card', () => {
    expect(pattern.matchSourceCondition({ element: 'Hand.Card', input: 'Grab' })).toBe(true);
  });

  it('does not match source: Grab + ZoneSlot.Card', () => {
    expect(pattern.matchSourceCondition({ element: 'ZoneSlot.Card', input: 'Grab' })).toBe(false);
  });

  it('matches target: Drop + ZoneSlot', () => {
    expect(pattern.matchTargetCondition({ element: 'ZoneSlot', input: 'Drop' })).toBe(true);
  });

  it('does not match target: Drop + Hand.Card', () => {
    expect(pattern.matchTargetCondition({ element: 'Hand.Card', input: 'Drop' })).toBe(false);
  });
});

describe('CardMovePattern', () => {
  const pattern = new CardMovePattern();

  it('matches source: Grab + ZoneSlot.Card', () => {
    expect(pattern.matchSourceCondition({ element: 'ZoneSlot.Card', input: 'Grab' })).toBe(true);
  });

  it('does not match source: Grab + Hand.Card', () => {
    expect(pattern.matchSourceCondition({ element: 'Hand.Card', input: 'Grab' })).toBe(false);
  });

  it('matches target: Drop + ZoneSlot', () => {
    expect(pattern.matchTargetCondition({ element: 'ZoneSlot', input: 'Drop' })).toBe(true);
  });
});

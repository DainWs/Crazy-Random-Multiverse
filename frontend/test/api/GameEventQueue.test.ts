import { beforeEach, describe, expect, it } from 'vitest';
import type { EventDto } from '@/api/dtos/EventDto';
import type { GameEventCode } from '@/api/models/GameEventCode';
import GameEventQueue from '@/api/GameEventQueue';

describe('GameEventQueue', () => {
  const createEvent = (sequence: number | undefined, code: GameEventCode = 'TURN_CHANGE', gameCode = 'game-1'): EventDto => ({
    code,
    sequence,
    details: { game: { code: gameCode, zones: [] } }
  });

  let applied: EventDto[];
  let queue: GameEventQueue;

  const appliedSequences = () => applied.map((event) => event.sequence);
  const appliedGames = () => applied.map((event) => event.details.game.code);

  beforeEach(() => {
    applied = [];
    queue = new GameEventQueue((event) => applied.push(event));
  });

  describe('push', () => {
    // CON-12
    it('applies the events in the order they arrive', () => {
      queue.push(createEvent(1));
      queue.push(createEvent(2));

      expect(appliedSequences()).toEqual([1, 2]);
    });

    // CON-12
    it('applies nothing while the first event is missing', () => {
      queue.push(createEvent(2));

      expect(appliedSequences()).toEqual([]);
    });

    // CON-12
    it('applies a held event when the previous one arrives', () => {
      queue.push(createEvent(2));

      queue.push(createEvent(1));

      expect(appliedSequences()).toEqual([1, 2]);
    });

    it('applies the waiting events when a gap closes', () => {
      queue.push(createEvent(1));
      queue.push(createEvent(3));
      queue.push(createEvent(4));

      queue.push(createEvent(2));

      expect(appliedSequences()).toEqual([1, 2, 3, 4]);
    });

    it('discards an event that was already applied', () => {
      queue.push(createEvent(1));

      queue.push(createEvent(1));

      expect(appliedSequences()).toEqual([1]);
    });

    it('applies an event without sequence at once', () => {
      queue.push(createEvent(undefined));

      expect(appliedSequences()).toEqual([undefined]);
    });
  });

  describe('with snapshots', () => {
    // CON-12
    it.each<{ code: GameEventCode }>([{ code: 'GAME_SYNC' }, { code: 'GAME_LOADING' }])('applies $code when earlier events are missing', ({ code }) => {
      queue.push(createEvent(5, code));

      expect(appliedSequences()).toEqual([5]);
    });

    // CON-12
    it('discards the events not greater than the snapshot', () => {
      queue.push(createEvent(5, 'GAME_SYNC'));

      queue.push(createEvent(3));
      queue.push(createEvent(5));

      expect(appliedSequences()).toEqual([5]);
    });

    // CON-12
    it('continues from the next sequence of the snapshot', () => {
      queue.push(createEvent(5, 'GAME_SYNC'));

      queue.push(createEvent(6));

      expect(appliedSequences()).toEqual([5, 6]);
    });

    // CON-12
    it('applies the events waiting after the snapshot once it arrives', () => {
      queue.push(createEvent(1));
      queue.push(createEvent(4));

      queue.push(createEvent(3, 'GAME_SYNC'));

      expect(appliedSequences()).toEqual([1, 3, 4]);
    });

    // CON-12
    it('discards the waiting events the snapshot already reflects', () => {
      queue.push(createEvent(1));
      queue.push(createEvent(3));

      queue.push(createEvent(6, 'GAME_SYNC'));

      expect(appliedSequences()).toEqual([1, 6]);
    });

    // CON-12
    it('applies a snapshot that arrives again', () => {
      queue.push(createEvent(5, 'GAME_SYNC'));

      queue.push(createEvent(5, 'GAME_SYNC'));

      expect(appliedSequences()).toEqual([5, 5]);
    });
  });

  describe('with another game', () => {
    // CON-9
    it('starts over at sequence 1', () => {
      queue.push(createEvent(1));
      queue.push(createEvent(2));

      queue.push(createEvent(1, 'GAME_START', 'game-2'));

      expect(appliedGames()).toEqual(['game-1', 'game-1', 'game-2']);
    });

    // CON-12
    it('waits for sequence 1', () => {
      queue.push(createEvent(1));

      queue.push(createEvent(2, 'TURN_CHANGE', 'game-2'));

      expect(appliedSequences()).toEqual([1]);
    });

    it('drops the events waiting of the previous game', () => {
      queue.push(createEvent(1));
      queue.push(createEvent(3));

      queue.push(createEvent(1, 'GAME_START', 'game-2'));
      queue.push(createEvent(2, 'TURN_CHANGE', 'game-2'));

      expect(appliedGames()).toEqual(['game-1', 'game-2', 'game-2']);
    });

    it('starts over at the sequence of a snapshot', () => {
      queue.push(createEvent(4));

      queue.push(createEvent(7, 'GAME_SYNC', 'game-2'));
      queue.push(createEvent(8, 'TURN_CHANGE', 'game-2'));

      expect(appliedSequences()).toEqual([7, 8]);
    });
  });

  describe('reset', () => {
    it('drops the events waiting', () => {
      queue.push(createEvent(2));

      queue.reset();
      queue.push(createEvent(1));

      expect(appliedSequences()).toEqual([1]);
    });

    it('waits for sequence 1 again', () => {
      queue.push(createEvent(1));
      queue.push(createEvent(2));

      queue.reset();
      queue.push(createEvent(1));

      expect(appliedSequences()).toEqual([1, 2, 1]);
    });
  });
});

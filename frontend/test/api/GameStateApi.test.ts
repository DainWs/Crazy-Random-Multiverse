import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { EventDto } from '@/api/dtos/EventDto';
import type { GameEventListener } from '@/api/models/Listeners';
import { bind, reset } from '@/api/GameStateApi';
import socketEventHandler from '@/api/SocketEventHandler';
import StoreSystem from '@/core/StoreSystem';

vi.mock('@/api/LocalStorageApi', () => ({
  loadUser: vi.fn(() => ({ code: 'p1', name: 'One' })),
  saveUser: vi.fn()
}));

describe('GameStateApi', () => {
  const player = { code: 'p1', name: 'One', isSpectator: false, isAlive: true, handSize: 0 };
  const createEvent = (sequence: number): EventDto => ({
    code: 'ROUND_CHANGE',
    sequence,
    details: { game: { code: 'game-1', round: sequence, zones: [{ owner: player, type: 'BASE', combatants: [[{ allowedCombatant: 'LEADER' }]] }] } }
  });

  let listener: GameEventListener;

  beforeEach(() => {
    vi.restoreAllMocks();
    StoreSystem.clearGame();
    reset();
    vi.spyOn(socketEventHandler, 'onAnyGameEvent').mockImplementation((registered) => {
      listener = registered;
      return () => undefined;
    });
  });

  describe('bind', () => {
    // CON-10
    it('stores the game of an event', () => {
      bind();

      listener(createEvent(1));

      expect(StoreSystem.getGameConfiguration().gameCode).toBe('game-1');
    });

    // CON-10
    it('replaces the game with the one of the next event', () => {
      bind();
      listener(createEvent(1));

      listener(createEvent(2));

      expect(StoreSystem.getRound()).toBe(2);
    });

    // CON-12
    it('waits for the previous event before storing one', () => {
      bind();

      listener(createEvent(2));

      expect(() => StoreSystem.getGameConfiguration()).toThrowError('Game not initialized');
    });
  });

  describe('reset', () => {
    // CON-12
    it('drops the events waiting', () => {
      bind();
      listener(createEvent(1));
      listener(createEvent(3));

      reset();
      listener(createEvent(1));
      listener(createEvent(2));

      expect(StoreSystem.getRound()).toBe(2);
    });
  });
});

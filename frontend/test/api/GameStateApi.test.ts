import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { EventDto } from '@/api/dtos/EventDto';
import type { GameEventListener } from '@/api/models/Listeners';
import { bind } from '@/api/GameStateApi';
import socketEventHandler from '@/api/SocketEventHandler';
import StoreSystem from '@/core/StoreSystem';

vi.mock('@/api/LocalStorageApi', () => ({
  loadUser: vi.fn(() => ({ code: 'p1', name: 'One' })),
  saveUser: vi.fn()
}));

describe('GameStateApi', () => {
  const player = { code: 'p1', name: 'One', isSpectator: false, isAlive: true, handSize: 0 };
  const createEvent = (round: number): EventDto => ({
    code: 'ROUND_CHANGE',
    sequence: round,
    details: { game: { code: 'game-1', round, zones: [{ owner: player, type: 'BASE', combatants: [[{ allowedCombatant: 'LEADER' }]] }] } }
  });

  let listener: GameEventListener;

  beforeEach(() => {
    vi.restoreAllMocks();
    StoreSystem.clearGame();
    vi.spyOn(socketEventHandler, 'onAnyGameEvent').mockImplementation((registered) => {
      listener = registered;
      return () => undefined;
    });
  });

  describe('bind', () => {
    // CON-10
    it('stores the game of an event', () => {
      bind();

      listener(createEvent(2));

      expect(StoreSystem.getGameConfiguration().gameCode).toBe('game-1');
    });

    // CON-10
    it('replaces the game with the one of the next event', () => {
      bind();
      listener(createEvent(1));

      listener(createEvent(2));

      expect(StoreSystem.getRound()).toBe(2);
    });
  });
});

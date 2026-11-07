import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CardDto } from '@/api/dtos/CardDto';
import type { EventDetailsDto, EventDto } from '@/api/dtos/EventDto';
import type { PlayerDto } from '@/api/dtos/PlayerDto';
import type { GameEventCode } from '@/api/models/GameEventCode';
import type { GameEventListener } from '@/api/models/Listeners';
import { bind, reset } from '@/api/GameStateApi';
import socketEventHandler from '@/api/SocketEventHandler';
import StoreSystem from '@/core/StoreSystem';

vi.mock('@/api/LocalStorageApi', () => ({
  loadUser: vi.fn(() => ({ code: 'p1', name: 'One' })),
  saveUser: vi.fn()
}));

describe('GameStateApi', () => {
  const createPlayer = (code: string, handSize = 0): PlayerDto => ({ code, name: code, isSpectator: false, isAlive: true, handSize });
  const createCard = (code: string): CardDto => ({
    catalogCode: { code, type: 'WARRIOR' },
    name: `card.warrior.${code}.name`,
    description: `card.warrior.${code}.description`,
    type: 'WARRIOR',
    rarity: 'COMMON'
  });
  const createEvent = (sequence: number, code: GameEventCode = 'ROUND_CHANGE', details: Partial<EventDetailsDto> = {}): EventDto => ({
    code,
    sequence,
    details: {
      game: {
        code: 'game-1',
        round: sequence,
        zones: [
          { owner: createPlayer('p1'), type: 'BASE', combatants: [[{ allowedCombatant: 'LEADER' }]] },
          { owner: createPlayer('p2', 3), type: 'BASE', combatants: [[{ allowedCombatant: 'LEADER' }]] }
        ]
      },
      ...details
    }
  });

  let listener: GameEventListener;

  const handCodes = () => StoreSystem.getPlayerHand().map((card) => card.code.code);

  beforeEach(() => {
    vi.restoreAllMocks();
    StoreSystem.clearGame();
    reset();
    vi.spyOn(socketEventHandler, 'onAnyGameEvent').mockImplementation((registered) => {
      listener = registered;
      return () => undefined;
    });
    bind();
  });

  describe('bind', () => {
    // CON-10
    it('stores the game of an event', () => {
      listener(createEvent(1));

      expect(StoreSystem.getGameConfiguration().gameCode).toBe('game-1');
    });

    // CON-10
    it('replaces the game with the one of the next event', () => {
      listener(createEvent(1));

      listener(createEvent(2));

      expect(StoreSystem.getRound()).toBe(2);
    });

    // CON-12
    it('waits for the previous event before storing one', () => {
      listener(createEvent(2));

      expect(() => StoreSystem.getGameConfiguration()).toThrowError('Game not initialized');
    });
  });

  // WIN-3
  describe('combat', () => {
    const attackDetails = (): Partial<EventDetailsDto> => ({
      sourcePlayer: createPlayer('p1'),
      sourcePosition: { row: 0, column: 0 },
      targetPlayer: createPlayer('p2'),
      targetPosition: { row: 0, column: 0 },
      armorDamage: 1,
      healthDamage: 4,
      targetDead: false
    });

    // CON-21
    it('sends the attack of PLAYER_ATTACK_CARD with the game it leads to', () => {
      const received = vi.fn();
      const stopListening = StoreSystem.onChange(received);

      listener(createEvent(1, 'PLAYER_ATTACK_CARD', attackDetails()));
      stopListening();

      expect(received).toHaveBeenCalledWith(
        expect.objectContaining({ change: 'GAME_UPDATED', combat: expect.objectContaining({ attackerPlayer: 'p1', healthDamage: 4 }) })
      );
    });

    it('sends no attack with an event that is not an attack', () => {
      const received = vi.fn();
      const stopListening = StoreSystem.onChange(received);

      listener(createEvent(1, 'TURN_CHANGE', attackDetails()));
      stopListening();

      expect(received).toHaveBeenCalledWith(expect.objectContaining({ combat: undefined }));
    });
  });

  describe('game end', () => {
    it('ends the game with GAME_END', () => {
      listener(createEvent(1, 'GAME_END'));

      expect(StoreSystem.getResult()).toEqual({});
    });

    it('stores the winner of GAME_END_WITH_WINNER', () => {
      listener(createEvent(1, 'GAME_END'));

      listener(createEvent(2, 'GAME_END_WITH_WINNER', { targetPlayer: createPlayer('p2') }));

      expect(StoreSystem.getResult()?.winner?.code).toBe('p2');
    });

    it('ends no game before GAME_END', () => {
      listener(createEvent(1, 'PLAYER_DIE', { targetPlayer: createPlayer('p2') }));

      expect(StoreSystem.getResult()).toBeUndefined();
    });
  });

  describe('reset', () => {
    // CON-12
    it('drops the events waiting', () => {
      listener(createEvent(1));
      listener(createEvent(3));

      reset();
      listener(createEvent(1));
      listener(createEvent(2));

      expect(StoreSystem.getRound()).toBe(2);
    });
  });

  describe('hand', () => {
    beforeEach(() => {
      listener(createEvent(1));
    });

    // CON-13
    it('restores the hand from GAME_SYNC', () => {
      listener(createEvent(2, 'GAME_SYNC', { hand: [createCard('1'), createCard('2')] }));

      expect(handCodes()).toEqual(['1', '2']);
    });

    // CON-13
    it('replaces the hand with the one of GAME_SYNC', () => {
      listener(createEvent(2, 'PLAYER_RECEIVE_CARD', { targetPlayer: createPlayer('p1'), targetCard: createCard('1') }));

      listener(createEvent(3, 'GAME_SYNC', { hand: [createCard('2')] }));

      expect(handCodes()).toEqual(['2']);
    });

    // CON-8
    it('empties the hand when GAME_SYNC carries none', () => {
      listener(createEvent(2, 'PLAYER_RECEIVE_CARD', { targetPlayer: createPlayer('p1'), targetCard: createCard('1') }));

      listener(createEvent(3, 'GAME_SYNC'));

      expect(handCodes()).toEqual([]);
    });

    // CON-13
    it('adds the card of PLAYER_RECEIVE_CARD', () => {
      listener(createEvent(2, 'PLAYER_RECEIVE_CARD', { targetPlayer: createPlayer('p1'), targetCard: createCard('1') }));

      expect(handCodes()).toEqual(['1']);
    });

    // CON-13, HAND-3
    it('adds nothing when PLAYER_RECEIVE_CARD carries no card', () => {
      listener(createEvent(2, 'PLAYER_RECEIVE_CARD', { targetPlayer: createPlayer('p2', 4) }));

      expect(handCodes()).toEqual([]);
    });

    // UI-7
    it('shows how many cards a rival holds after PLAYER_RECEIVE_CARD', () => {
      const game = createEvent(2).details.game;
      game.zones[1].owner.handSize = 4;

      listener(createEvent(2, 'PLAYER_RECEIVE_CARD', { game, targetPlayer: createPlayer('p2', 4) }));

      expect(StoreSystem.getZones()[1].owner.handSize).toBe(4);
    });

    // HAND-2, CON-13
    it('removes one copy of the card of its own PLAYER_PUT_CARD', () => {
      listener(createEvent(2, 'GAME_SYNC', { hand: [createCard('1'), createCard('2'), createCard('1')] }));

      listener(createEvent(3, 'PLAYER_PUT_CARD', { sourcePlayer: createPlayer('p1'), sourceCard: createCard('1') }));

      expect(handCodes()).toEqual(['2', '1']);
    });

    // HAND-2, CON-13
    it('removes the card of its own PLAYER_EQUIP_CARD', () => {
      listener(createEvent(2, 'GAME_SYNC', { hand: [createCard('1'), createCard('2')] }));

      listener(createEvent(3, 'PLAYER_EQUIP_CARD', { sourcePlayer: createPlayer('p1'), sourceCard: createCard('2') }));

      expect(handCodes()).toEqual(['1']);
    });

    // CON-13
    it('keeps the hand on the PLAYER_PUT_CARD of another player', () => {
      listener(createEvent(2, 'GAME_SYNC', { hand: [createCard('1')] }));

      listener(createEvent(3, 'PLAYER_PUT_CARD', { sourcePlayer: createPlayer('p2'), sourceCard: createCard('1') }));

      expect(handCodes()).toEqual(['1']);
    });

    // ELIM-3, CON-13
    it('empties the hand on its own PLAYER_DIE', () => {
      listener(createEvent(2, 'GAME_SYNC', { hand: [createCard('1'), createCard('2')] }));

      listener(createEvent(3, 'PLAYER_DIE', { targetPlayer: createPlayer('p1') }));

      expect(handCodes()).toEqual([]);
    });

    // ELIM-3
    it('keeps the hand on the PLAYER_DIE of another player', () => {
      listener(createEvent(2, 'GAME_SYNC', { hand: [createCard('1')] }));

      listener(createEvent(3, 'PLAYER_DIE', { targetPlayer: createPlayer('p2') }));

      expect(handCodes()).toEqual(['1']);
    });

    // CON-11
    it('keeps the hand on an event that does not change it', () => {
      listener(createEvent(2, 'GAME_SYNC', { hand: [createCard('1')] }));

      listener(createEvent(3, 'TURN_CHANGE'));

      expect(handCodes()).toEqual(['1']);
    });
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';
import socketEventHandler from '@/api/SocketEventHandler';
import StoreSystem from '@/core/StoreSystem';
import EventSystem from '@/core/EventSystem';
import { GameEventCode, cardFromDto } from '@/api/dtos/EventDto';
import { Socket } from 'socket.io-client';

type Function = (...args: unknown[]) => unknown;

vi.mock('@/core/StoreSystem', () => ({
  default: {
    setPlayerHand: vi.fn()
  }
}));

vi.mock('@/core/EventSystem', () => ({
  default: {
    rawEmit: vi.fn()
  }
}));

vi.mock('@/api/dtos/EventDto', async () => {
  const actual = await vi.importActual<typeof import('@/api/dtos/EventDto')>('@/api/dtos/EventDto');

  return {
    ...actual,
    cardFromDto: vi.fn((card) => ({ mappedCard: card }))
  };
});

describe('SocketEventHandler', () => {
  const createSocket = () => {
    const socketHandlers = new Map<string, Function[]>();

    const socket = {
      on: vi.fn((event: string, handler: Function) => {
        const handlers = socketHandlers.get(event) ?? [];

        handlers.push(handler);
        socketHandlers.set(event, handlers);
      }),

      emit: vi.fn((event: string, ...args: unknown[]) => {
        socketHandlers.get(event)?.forEach((handler) => handler(...args));
      })
    } as unknown as Socket;

    return {
      socket,
      socketHandlers,

      emit(event: string, ...args: unknown[]) {
        socketHandlers.get(event)?.forEach((handler) => handler(...args));
      }
    };
  };

  const createEvent = (code: string = 'GAME_STARTED', details: Record<string, unknown> = {}) => ({
    code,
    details
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('bind', () => {
    it('registers all generic event channels', () => {
      const { socket } = createSocket();
    
      socketEventHandler.bind(socket, vi.fn());

      expect(socket.on).toHaveBeenCalledWith('event', expect.any(Function));
      expect(socket.on).toHaveBeenCalledWith('game:event', expect.any(Function));
      expect(socket.on).toHaveBeenCalledWith('game_event', expect.any(Function));
    });

    it('registers all game event codes', () => {
      const { socket } = createSocket();

      socketEventHandler.bind(socket, vi.fn());

      Object.values(GameEventCode).forEach((eventCode) => {
        expect(socket.on).toHaveBeenCalledWith(eventCode, expect.any(Function));
      });
    });

    it('registers all error channels', () => {
      const { socket } = createSocket();

      socketEventHandler.bind(socket, vi.fn());

      expect(socket.on).toHaveBeenCalledWith('error', expect.any(Function));
      expect(socket.on).toHaveBeenCalledWith('game:error', expect.any(Function));
      expect(socket.on).toHaveBeenCalledWith('exception', expect.any(Function));
    });
  });

  describe('onGameEvent', () => {
    it('registers a listener for an event code', () => {
      const { socket } = createSocket();
      const listener = vi.fn();
      socketEventHandler.onGameEvent('GAME_STARTED', listener);
      socketEventHandler.bind(socket, vi.fn());
      const event = createEvent('GAME_STARTED');

      socket.emit('event', event);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(event);
    });

    it('supports multiple listeners for the same event', () => {
      const { socket } = createSocket();
      const firstListener = vi.fn();
      const secondListener = vi.fn();
      socketEventHandler.onGameEvent('GAME_STARTED', firstListener);
      socketEventHandler.onGameEvent('GAME_STARTED', secondListener);
      socketEventHandler.bind(socket, vi.fn());
      const event = createEvent('GAME_STARTED');

      socket.emit('event', event);

      expect(firstListener).toHaveBeenCalledWith(event);
      expect(secondListener).toHaveBeenCalledWith(event);
    });

    it('does not register the same listener twice', () => {
      const { socket } = createSocket();
      const listener = vi.fn();
      socketEventHandler.onGameEvent('GAME_STARTED', listener);
      socketEventHandler.onGameEvent('GAME_STARTED', listener);
      socketEventHandler.bind(socket, vi.fn());

      socket.emit('event', createEvent('GAME_STARTED'));

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('returns an unsubscribe function', () => {
      const { socket } = createSocket();
      const listener = vi.fn();
      const unsubscribe = socketEventHandler.onGameEvent('GAME_STARTED', listener);
      socketEventHandler.bind(socket, vi.fn());
      socket.emit('event', createEvent('GAME_STARTED'));
      unsubscribe();

      socket.emit('event', createEvent('GAME_STARTED'));

      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('offGameEvent', () => {
    it('removes a registered listener', () => {
      const { socket } = createSocket();
      const listener = vi.fn();
      socketEventHandler.onGameEvent('GAME_STARTED', listener);
      socketEventHandler.offGameEvent('GAME_STARTED', listener);
      socketEventHandler.bind(socket, vi.fn());

      socket.emit('event', createEvent('GAME_STARTED'));

      expect(listener).not.toHaveBeenCalled();
    });

    it('does nothing when the event has no listeners', () => {
      expect(() => {
        socketEventHandler.offGameEvent('GAME_STARTED', vi.fn());
      }).not.toThrow();
    });

    it('does nothing when the listener is not registered', () => {
      const registeredListener = vi.fn();
      const unknownListener = vi.fn();
      socketEventHandler.onGameEvent('GAME_STARTED', registeredListener);
      socketEventHandler.offGameEvent('GAME_STARTED', unknownListener);
      const { socket } = createSocket();
      socketEventHandler.bind(socket, vi.fn());

      socket.emit('event', createEvent('GAME_STARTED'));

      expect(registeredListener).toHaveBeenCalledTimes(1);
    });
  });

  describe('onAnyGameEvent', () => {
    it('receives every incoming event', () => {
      const { socket } = createSocket();
      const listener = vi.fn();
      socketEventHandler.onAnyGameEvent(listener);
      socketEventHandler.bind(socket, vi.fn());
      const firstEvent = createEvent('GAME_STARTED');
      const secondEvent = createEvent('GAME_FINISHED');

      socket.emit('event', firstEvent);
      socket.emit('game:event', secondEvent);

      expect(listener).toHaveBeenCalledTimes(2);
      expect(listener).toHaveBeenNthCalledWith(1, firstEvent);
      expect(listener).toHaveBeenNthCalledWith(2, secondEvent);
    });

    it('does not register the same listener twice', () => {
      const { socket } = createSocket();
      const listener = vi.fn();
      socketEventHandler.onAnyGameEvent(listener);
      socketEventHandler.onAnyGameEvent(listener);
      socketEventHandler.bind(socket, vi.fn());

      socket.emit('event', createEvent());

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('returns an unsubscribe function', () => {
      const { socket } = createSocket();
      const listener = vi.fn();
      const unsubscribe = socketEventHandler.onAnyGameEvent(listener);
      socketEventHandler.bind(socket, vi.fn());
      socket.emit('event', createEvent());
      unsubscribe();

      socket.emit('event', createEvent());

      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('offAnyGameEvent', () => {
    it('removes an any-event listener', () => {
      const { socket } = createSocket();
      const listener = vi.fn();
      socketEventHandler.onAnyGameEvent(listener);
      socketEventHandler.offAnyGameEvent(listener);
      socketEventHandler.bind(socket, vi.fn());

      socket.emit('event', createEvent());

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('incoming events', () => {
    it('handles events received through the event channel', () => {
      const { socket } = createSocket();
      const listener = vi.fn();
      socketEventHandler.onGameEvent('GAME_STARTED', listener);
      socketEventHandler.bind(socket, vi.fn());
      const event = createEvent('GAME_STARTED', {
        value: 42
      });

      socket.emit('event', event);

      expect(listener).toHaveBeenCalledWith(event);
      expect(EventSystem.rawEmit).toHaveBeenCalledWith('socket.event', event);
      expect(EventSystem.rawEmit).toHaveBeenCalledWith('game.game_started', event);
    });

    it('handles events received through game:event', () => {
      const { socket } = createSocket();
      const listener = vi.fn();
      socketEventHandler.onGameEvent('GAME_STARTED', listener);
      socketEventHandler.bind(socket, vi.fn());
      const event = createEvent('GAME_STARTED');

      socket.emit('game:event', event);

      expect(listener).toHaveBeenCalledWith(event);
    });

    it('handles events received through game_event', () => {
      const { socket } = createSocket();
      const listener = vi.fn();
      socketEventHandler.onGameEvent('GAME_STARTED', listener);
      socketEventHandler.bind(socket, vi.fn());
      const event = createEvent('GAME_STARTED');

      socket.emit('game_event', event);

      expect(listener).toHaveBeenCalledWith(event);
    });

    it('parses JSON string events', () => {
      const { socket } = createSocket();
      const listener = vi.fn();
      socketEventHandler.onGameEvent('GAME_STARTED', listener);
      socketEventHandler.bind(socket, vi.fn());
      const event = createEvent('GAME_STARTED', {
        value: 42
      });

      socket.emit('event', JSON.stringify(event));

      expect(listener).toHaveBeenCalledWith(event);
    });

    it('ignores empty events', () => {
      const { socket } = createSocket();
      const listener = vi.fn();
      const anyListener = vi.fn();
      socketEventHandler.onGameEvent('GAME_STARTED', listener);
      socketEventHandler.onAnyGameEvent(anyListener);
      socketEventHandler.bind(socket, vi.fn());

      socket.emit('event', null);

      expect(listener).not.toHaveBeenCalled();
      expect(anyListener).not.toHaveBeenCalled();
      expect(EventSystem.rawEmit).not.toHaveBeenCalled();
    });

    it('notifies only listeners matching the event code', () => {
      const { socket } = createSocket();
      const startedListener = vi.fn();
      const finishedListener = vi.fn();
      socketEventHandler.onGameEvent('GAME_STARTED', startedListener);
      socketEventHandler.onGameEvent('GAME_FINISHED', finishedListener);
      socketEventHandler.bind(socket, vi.fn());

      const event = createEvent('GAME_STARTED');

      socket.emit('event', event);

      expect(startedListener).toHaveBeenCalledWith(event);
      expect(finishedListener).not.toHaveBeenCalled();
    });
  });

  describe('game event channels', () => {
    it('wraps object payloads without a code', () => {
      const { socket } = createSocket();
      const listener = vi.fn();
      const eventCode = Object.values(GameEventCode)[0];
      socketEventHandler.onGameEvent(eventCode, listener);
      socketEventHandler.bind(socket, vi.fn());
      const details = {
        value: 42
      };

      socket.emit(eventCode, details);

      expect(listener).toHaveBeenCalledWith({
        code: eventCode,
        details
      });
    });

    it('uses an already wrapped event when data has a code', () => {
      const { socket } = createSocket();
      const listener = vi.fn();
      const eventCode = Object.values(GameEventCode)[0];
      socketEventHandler.onGameEvent(eventCode, listener);
      socketEventHandler.bind(socket, vi.fn());
      const event = {
        code: eventCode,
        details: {
          value: 42
        }
      };

      socket.emit(eventCode, event);

      expect(listener).toHaveBeenCalledWith(event);
    });
  });

  describe('player hand synchronization', () => {
    it('maps and stores the player hand', () => {
      const { socket } = createSocket();
      socketEventHandler.bind(socket, vi.fn());
      const cards = [
        { id: 'card-1' },
        { id: 'card-2' }
      ];

      socket.emit(
        'event',
        createEvent('GAME_STARTED', {
          playerHand: cards
        })
      );

      expect(cardFromDto).toHaveBeenCalledTimes(2);
      expect(cardFromDto).toHaveBeenNthCalledWith(1, cards[0], 0, cards);
      expect(cardFromDto).toHaveBeenNthCalledWith(2, cards[1], 1, cards);
      expect(StoreSystem.setPlayerHand).toHaveBeenCalledWith([
        {
          mappedCard: cards[0]
        },
        {
          mappedCard: cards[1]
        }
      ]);
    });

    it('does not update the player hand when playerHand is missing', () => {
      const { socket } = createSocket();
      socketEventHandler.bind(socket, vi.fn());

      socket.emit(
        'event',
        createEvent('GAME_STARTED', {
          value: 42
        })
      );

      expect(cardFromDto).not.toHaveBeenCalled();
      expect(StoreSystem.setPlayerHand).not.toHaveBeenCalled();
    });

    it('does not update the player hand when playerHand is not an array', () => {
      const { socket } = createSocket();
      socketEventHandler.bind(socket, vi.fn());

      socket.emit(
        'event',
        createEvent('GAME_STARTED', {
          playerHand: {
            card: 'card-1'
          }
        })
      );

      expect(cardFromDto).not.toHaveBeenCalled();
      expect(StoreSystem.setPlayerHand).not.toHaveBeenCalled();
    });

    it('continues processing the event when card mapping fails', () => {
      const { socket } = createSocket();
      const listener = vi.fn();
      vi.mocked(cardFromDto).mockImplementationOnce(() => {
        throw new Error('Invalid card');
      });
      socketEventHandler.onGameEvent('GAME_STARTED', listener);
      socketEventHandler.bind(socket, vi.fn());
      const event = createEvent('GAME_STARTED', {
        playerHand: [
          {
            id: 'card-1'
          }
        ]
      });
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

      socket.emit('event', event);

      expect(warnSpy).toHaveBeenCalledWith('[SocketService] Failed to map and set player hand from event:', expect.any(Error));
      expect(listener).toHaveBeenCalledWith(event);
      expect(EventSystem.rawEmit).toHaveBeenCalledWith('socket.event', event);
      warnSpy.mockRestore();
    });
  });

  describe('errors', () => {
    it('calls onError for error events', () => {
      const { socket } = createSocket();
      const onError = vi.fn();
      socketEventHandler.bind(socket, onError);
      const error = {
        code: 'GAME_NOT_FOUND',
        message: 'Game not found'
      };

      socket.emit('error', error);

      expect(onError).toHaveBeenCalledWith(error);
    });

    it('emits socket.error for error events', () => {
      const { socket } = createSocket();
      const onError = vi.fn();
      socketEventHandler.bind(socket, onError);
      const error = {
        code: 'GAME_NOT_FOUND',
        message: 'Game not found'
      };

      socket.emit('error', error);

      expect(EventSystem.rawEmit).toHaveBeenCalledWith('socket.error', error);
    });

    it('handles errors from all error channels', () => {
      const { socket } = createSocket();
      const onError = vi.fn();
      socketEventHandler.bind(socket, onError);
      const error = {
        code: 'GAME_NOT_FOUND'
      };

      socket.emit('error', error);
      socket.emit('game:error', error);
      socket.emit('exception', error);

      expect(onError).toHaveBeenCalledTimes(3);
      expect(EventSystem.rawEmit).toHaveBeenCalledTimes(3);
    });
  });
});

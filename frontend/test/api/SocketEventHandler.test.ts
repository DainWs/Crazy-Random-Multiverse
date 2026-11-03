import { beforeEach, describe, expect, it, vi } from 'vitest';
import socketEventHandler from '@/api/SocketEventHandler';
import EventSystem from '@/core/EventSystem';
import { GAME_EVENT_CODES, GameEventCode } from '@/api/models/GameEventCode';
import User from '@/domain/User';
import { Socket } from 'socket.io-client';

type Function = (...args: unknown[]) => unknown;

vi.mock('@/core/EventSystem', () => ({
  default: {
    rawEmit: vi.fn()
  }
}));

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

  const createEvent = (code: GameEventCode = 'GAME_START', details: Record<string, unknown> = {}) => ({
    code,
    details,
    sequence: 1
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('bind', () => {
    it('registers all generic event channels', () => {
      const { socket } = createSocket();

      socketEventHandler.bind(socket);

      expect(socket.on).toHaveBeenCalledWith('event', expect.any(Function));
      expect(socket.on).toHaveBeenCalledWith('game:event', expect.any(Function));
      expect(socket.on).toHaveBeenCalledWith('game_event', expect.any(Function));
    });

    it('registers all game event codes', () => {
      const { socket } = createSocket();

      socketEventHandler.bind(socket);

      GAME_EVENT_CODES.forEach((eventCode) => {
        expect(socket.on).toHaveBeenCalledWith(eventCode, expect.any(Function));
      });
    });

  });

  describe('onGameEvent', () => {
    it('registers a listener for an event code', () => {
      const { socket } = createSocket();
      const listener = vi.fn();
      socketEventHandler.onGameEvent('GAME_START', listener);
      socketEventHandler.bind(socket);
      const event = createEvent('GAME_START');

      socket.emit('event', event);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(event);
    });

    it('supports multiple listeners for the same event', () => {
      const { socket } = createSocket();
      const firstListener = vi.fn();
      const secondListener = vi.fn();
      socketEventHandler.onGameEvent('GAME_START', firstListener);
      socketEventHandler.onGameEvent('GAME_START', secondListener);
      socketEventHandler.bind(socket);
      const event = createEvent('GAME_START');

      socket.emit('event', event);

      expect(firstListener).toHaveBeenCalledWith(event);
      expect(secondListener).toHaveBeenCalledWith(event);
    });

    it('does not register the same listener twice', () => {
      const { socket } = createSocket();
      const listener = vi.fn();
      socketEventHandler.onGameEvent('GAME_START', listener);
      socketEventHandler.onGameEvent('GAME_START', listener);
      socketEventHandler.bind(socket);

      socket.emit('event', createEvent('GAME_START'));

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('returns an unsubscribe function', () => {
      const { socket } = createSocket();
      const listener = vi.fn();
      const unsubscribe = socketEventHandler.onGameEvent('GAME_START', listener);
      socketEventHandler.bind(socket);
      socket.emit('event', createEvent('GAME_START'));
      unsubscribe();

      socket.emit('event', createEvent('GAME_START'));

      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('offGameEvent', () => {
    it('removes a registered listener', () => {
      const { socket } = createSocket();
      const listener = vi.fn();
      socketEventHandler.onGameEvent('GAME_START', listener);
      socketEventHandler.offGameEvent('GAME_START', listener);
      socketEventHandler.bind(socket);

      socket.emit('event', createEvent('GAME_START'));

      expect(listener).not.toHaveBeenCalled();
    });

    it('does nothing when the event has no listeners', () => {
      expect(() => {
        socketEventHandler.offGameEvent('GAME_START', vi.fn());
      }).not.toThrow();
    });

    it('does nothing when the listener is not registered', () => {
      const registeredListener = vi.fn();
      const unknownListener = vi.fn();
      socketEventHandler.onGameEvent('GAME_START', registeredListener);
      socketEventHandler.offGameEvent('GAME_START', unknownListener);
      const { socket } = createSocket();
      socketEventHandler.bind(socket);

      socket.emit('event', createEvent('GAME_START'));

      expect(registeredListener).toHaveBeenCalledTimes(1);
    });
  });

  describe('onAnyGameEvent', () => {
    it('receives every incoming event', () => {
      const { socket } = createSocket();
      const listener = vi.fn();
      socketEventHandler.onAnyGameEvent(listener);
      socketEventHandler.bind(socket);
      const firstEvent = createEvent('GAME_START');
      const secondEvent = createEvent('GAME_END');

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
      socketEventHandler.bind(socket);

      socket.emit('event', createEvent());

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('returns an unsubscribe function', () => {
      const { socket } = createSocket();
      const listener = vi.fn();
      const unsubscribe = socketEventHandler.onAnyGameEvent(listener);
      socketEventHandler.bind(socket);
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
      socketEventHandler.bind(socket);

      socket.emit('event', createEvent());

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('incoming events', () => {
    it('handles events received through the event channel', () => {
      const { socket } = createSocket();
      const listener = vi.fn();
      socketEventHandler.onGameEvent('GAME_START', listener);
      socketEventHandler.bind(socket);
      const event = createEvent('GAME_START', {
        value: 42
      });

      socket.emit('event', event);

      expect(listener).toHaveBeenCalledWith(event);
      expect(EventSystem.rawEmit).toHaveBeenCalledWith('socket.event', event);
      expect(EventSystem.rawEmit).toHaveBeenCalledWith('game.game_start', event);
    });

    it('handles events received through game:event', () => {
      const { socket } = createSocket();
      const listener = vi.fn();
      socketEventHandler.onGameEvent('GAME_START', listener);
      socketEventHandler.bind(socket);
      const event = createEvent('GAME_START');

      socket.emit('game:event', event);

      expect(listener).toHaveBeenCalledWith(event);
    });

    it('handles events received through game_event', () => {
      const { socket } = createSocket();
      const listener = vi.fn();
      socketEventHandler.onGameEvent('GAME_START', listener);
      socketEventHandler.bind(socket);
      const event = createEvent('GAME_START');

      socket.emit('game_event', event);

      expect(listener).toHaveBeenCalledWith(event);
    });

    it('parses JSON string events', () => {
      const { socket } = createSocket();
      const listener = vi.fn();
      socketEventHandler.onGameEvent('GAME_START', listener);
      socketEventHandler.bind(socket);
      const event = createEvent('GAME_START', {
        value: 42
      });

      socket.emit('event', JSON.stringify(event));

      expect(listener).toHaveBeenCalledWith(event);
    });

    it('ignores empty events', () => {
      const { socket } = createSocket();
      const listener = vi.fn();
      const anyListener = vi.fn();
      socketEventHandler.onGameEvent('GAME_START', listener);
      socketEventHandler.onAnyGameEvent(anyListener);
      socketEventHandler.bind(socket);

      socket.emit('event', null);

      expect(listener).not.toHaveBeenCalled();
      expect(anyListener).not.toHaveBeenCalled();
      expect(EventSystem.rawEmit).not.toHaveBeenCalled();
    });

    it('notifies only listeners matching the event code', () => {
      const { socket } = createSocket();
      const startedListener = vi.fn();
      const finishedListener = vi.fn();
      socketEventHandler.onGameEvent('GAME_START', startedListener);
      socketEventHandler.onGameEvent('GAME_END', finishedListener);
      socketEventHandler.bind(socket);

      const event = createEvent('GAME_START');

      socket.emit('event', event);

      expect(startedListener).toHaveBeenCalledWith(event);
      expect(finishedListener).not.toHaveBeenCalled();
    });
  });

  describe('game event channels', () => {
    it('wraps object payloads without a code', () => {
      const { socket } = createSocket();
      const listener = vi.fn();
      const eventCode = GAME_EVENT_CODES[0];
      socketEventHandler.onGameEvent(eventCode, listener);
      socketEventHandler.bind(socket);
      const details = {
        value: 42
      };

      socket.emit(eventCode, details);

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          code: eventCode,
          details
        })
      );
    });

    it('uses an already wrapped event when data has a code', () => {
      const { socket } = createSocket();
      const listener = vi.fn();
      const eventCode = GAME_EVENT_CODES[0];
      socketEventHandler.onGameEvent(eventCode, listener);
      socketEventHandler.bind(socket);
      const event = {
        code: eventCode,
        details: {
          value: 42
        },
        sequence: 1
      };

      socket.emit(eventCode, event);

      expect(listener).toHaveBeenCalledWith(event);
    });
  });

  describe('party:info', () => {
    const createPartyDto = () => {
      const owner = { id: 'usr-1', username: 'One' };
      return { code: 'party-1', name: 'Party', gameMode: 'CLASSIC', userCount: 1, maxUsers: 4, owner, users: [owner], locked: false };
    };

    it('notifies listeners with the mapped party', () => {
      const { socket } = createSocket();
      const listener = vi.fn();
      socketEventHandler.onPartyInfo(listener);
      socketEventHandler.bind(socket);

      socket.emit('party:info', createPartyDto());

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener.mock.calls[0][0].code).toBe('party-1');
      expect(listener.mock.calls[0][0].owner).toEqual(new User('usr-1', 'One'));
    });

    it('stops notifying after unsubscribing', () => {
      const { socket } = createSocket();
      const listener = vi.fn();
      const unsubscribe = socketEventHandler.onPartyInfo(listener);
      socketEventHandler.bind(socket);
      unsubscribe();

      socket.emit('party:info', createPartyDto());

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('user:synced', () => {
    it('notifies listeners', () => {
      const { socket } = createSocket();
      const listener = vi.fn();
      socketEventHandler.onUserSynced(listener);
      socketEventHandler.bind(socket);

      socket.emit('user:synced');

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('stops notifying after unsubscribing', () => {
      const { socket } = createSocket();
      const listener = vi.fn();
      const unsubscribe = socketEventHandler.onUserSynced(listener);
      socketEventHandler.bind(socket);
      unsubscribe();

      socket.emit('user:synced');

      expect(listener).not.toHaveBeenCalled();
    });
  });

  // CON-20
  describe('error channels', () => {
    it.each([{ channel: 'error' }, { channel: 'game:error' }, { channel: 'exception' }])('does not listen to $channel', ({ channel }) => {
      const { socket } = createSocket();

      socketEventHandler.bind(socket);

      expect(socket.on).not.toHaveBeenCalledWith(channel, expect.any(Function));
    });
  });
});

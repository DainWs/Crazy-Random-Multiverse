import { beforeEach, describe, expect, it, vi } from 'vitest';
import socketReconnectHandler from '@/api/SocketReconnectHandler';
import { Socket } from 'socket.io-client';

type Function = (...args: unknown[]) => unknown;

describe('SocketReconnectHandler', () => {
  const createSocket = () => {
    const socketHandlers = new Map<string, Function>();
    const managerHandlers = new Map<string, Function>();

    const socket = {
      id: 'socket-id',

      on: vi.fn((event: string, handler: Function) => {
        socketHandlers.set(event, handler);
      }),

      io: {
        on: vi.fn((event: string, handler: Function) => {
          managerHandlers.set(event, handler);
        })
      }
    } as unknown as Socket;

    return {
      socket,
      socketHandlers,
      managerHandlers
    };
  };

  const createCallbacks = () => ({
    setStatus: vi.fn(),
    onReconnect: vi.fn(),
    onError: vi.fn(),
    emit: vi.fn()
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('bind', () => {
    it('registers all socket lifecycle handlers', () => {
      const { socket } = createSocket();
      const callbacks = createCallbacks();

      socketReconnectHandler.bind(socket, callbacks);

      expect(socket.on).toHaveBeenCalledTimes(3);
      expect(socket.on).toHaveBeenCalledWith('connect', expect.any(Function));
      expect(socket.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
      expect(socket.on).toHaveBeenCalledWith('connect_error', expect.any(Function));
    });

    it('registers all reconnection handlers', () => {
      const { socket } = createSocket();
      const callbacks = createCallbacks();

      socketReconnectHandler.bind(socket, callbacks);

      expect(socket.io.on).toHaveBeenCalledTimes(4);
      expect(socket.io.on).toHaveBeenCalledWith('reconnect_attempt', expect.any(Function));
      expect(socket.io.on).toHaveBeenCalledWith('reconnect', expect.any(Function));
      expect(socket.io.on).toHaveBeenCalledWith('reconnect_error', expect.any(Function));
      expect(socket.io.on).toHaveBeenCalledWith('reconnect_failed', expect.any(Function));
    });
  });

  describe('connect', () => {
    it('sets status to connected', () => {
      const { socket, socketHandlers } = createSocket();
      const callbacks = createCallbacks();
      socketReconnectHandler.bind(socket, callbacks);

      socketHandlers.get('connect')!();

      expect(callbacks.setStatus).toHaveBeenCalledWith('connected');
    });
  });

  describe('disconnect', () => {
    it('sets disconnected status for server disconnects', () => {
      const { socket, socketHandlers } = createSocket();
      const callbacks = createCallbacks();
      socketReconnectHandler.bind(socket, callbacks);

      socketHandlers.get('disconnect')!('io server disconnect');

      expect(callbacks.setStatus).toHaveBeenCalledWith('disconnected');
    });

    it('sets reconnecting status for other disconnects', () => {
      const { socket, socketHandlers } = createSocket();
      const callbacks = createCallbacks();
      socketReconnectHandler.bind(socket, callbacks);

      socketHandlers.get('disconnect')!('transport close');

      expect(callbacks.setStatus).toHaveBeenCalledWith('reconnecting');
    });
  });

  describe('connect_error', () => {
    it('sets error status', () => {
      const { socket, socketHandlers } = createSocket();
      const callbacks = createCallbacks();
      const error = new Error('Connection failed');
      socketReconnectHandler.bind(socket, callbacks);

      socketHandlers.get('connect_error')!(error);

      expect(callbacks.setStatus).toHaveBeenCalledWith('error');
    });

    it('calls onError with the received error', () => {
      const { socket, socketHandlers } = createSocket();
      const callbacks = createCallbacks();
      const error = new Error('Connection failed');
      socketReconnectHandler.bind(socket, callbacks);

      socketHandlers.get('connect_error')!(error);

      expect(callbacks.onError).toHaveBeenCalledWith(error);
    });
  });

  describe('reconnect_attempt', () => {
    it('sets reconnecting status', () => {
      const { socket, managerHandlers } = createSocket();
      const callbacks = createCallbacks();
      socketReconnectHandler.bind(socket, callbacks);

      managerHandlers.get('reconnect_attempt')!(3);

      expect(callbacks.setStatus).toHaveBeenCalledWith('reconnecting');
    });
  });

  describe('reconnect', () => {
    it('sets connected status', () => {
      const { socket, managerHandlers } = createSocket();
      const callbacks = createCallbacks();
      socketReconnectHandler.bind(socket, callbacks);

      managerHandlers.get('reconnect')!(2);

      expect(callbacks.setStatus).toHaveBeenCalledWith('connected');
    });

    it('notifies the reconnect listener', () => {
      const { socket, managerHandlers } = createSocket();
      const callbacks = createCallbacks();
      socketReconnectHandler.bind(socket, callbacks);

      managerHandlers.get('reconnect')!(5);

      expect(callbacks.onReconnect).toHaveBeenCalledWith(5);
    });
  });

  describe('reconnect_error', () => {
    it('sets reconnecting status', () => {
      const { socket, managerHandlers } = createSocket();
      const callbacks = createCallbacks();
      const error = new Error('Reconnect failed');
      socketReconnectHandler.bind(socket, callbacks);

      managerHandlers.get('reconnect_error')!(error);

      expect(callbacks.setStatus).toHaveBeenCalledWith('reconnecting');
    });
  });

  describe('reconnect_failed', () => {
    it('sets reconnect_failed status', () => {
      const { socket, managerHandlers } = createSocket();
      const callbacks = createCallbacks();
      socketReconnectHandler.bind(socket, callbacks);

      managerHandlers.get('reconnect_failed')!();

      expect(callbacks.setStatus).toHaveBeenCalledWith('reconnect_failed');
    });
  });
});

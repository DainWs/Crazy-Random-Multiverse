import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SocketService } from '@/api/SocketService';
import { Socket } from 'socket.io-client';

describe('SocketService', () => {
  let mockSocket: Socket;
  let mockReconnectHandler: { bind: ReturnType<typeof vi.fn> };
  let mockEventHandler: { bind: ReturnType<typeof vi.fn> };
  let mockSocketFactory: ReturnType<typeof vi.fn>;
  let service: SocketService;

  beforeEach(() => {
    vi.clearAllMocks();

    mockSocket = {
      connected: true,
      disconnect: vi.fn(),
      connect: vi.fn(),
      emit: vi.fn(),
    } as unknown as Socket;

    mockReconnectHandler = {
      bind: vi.fn(),
    };

    mockEventHandler = {
      bind: vi.fn(),
    };

    mockSocketFactory = vi.fn(() => mockSocket);

    service = new SocketService({
      reconnectHandler: mockReconnectHandler as any,
      eventHandler: mockEventHandler as any,
      socketFactory: mockSocketFactory as any,
    });
  });

  describe('connect', () => {
    it('creates socket and binds reconnect and event handlers', () => {
      service.connect();

      expect(mockSocketFactory).toHaveBeenCalledTimes(1);
      expect(mockReconnectHandler.bind).toHaveBeenCalledWith(mockSocket, expect.objectContaining({
        setStatus: expect.any(Function),
        onReconnect: expect.any(Function),
        onError: expect.any(Function),
        emit: expect.any(Function),
      }));
      expect(mockEventHandler.bind).toHaveBeenCalledWith(mockSocket, expect.any(Function));
    });

    it('does not recreate socket if already connected', () => {
      service.connect();
      service.connect();

      expect(mockSocketFactory).toHaveBeenCalledTimes(1);
    });
  });

  describe('disconnect', () => {
    it('disconnects active socket and sets status to disconnected', () => {
      service.connect();
      service.disconnect();

      expect(mockSocket.disconnect).toHaveBeenCalledTimes(1);
      expect(service.getStatus()).toBe('disconnected');
      expect(service.isConnected()).toBe(false);
    });
  });

  describe('emit', () => {
    it('emits event when connected', () => {
      service.connect();
      service.emit('game:action', { test: 123 });

      expect(mockSocket.emit).toHaveBeenCalledWith('game:action', { test: 123 });
    });

    it('does not emit when disconnected and logs a warning', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      service.emit('game:action', { test: 123 });

      expect(mockSocket.emit).not.toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Cannot emit'));

      warnSpy.mockRestore();
    });
  });

  describe('listeners', () => {
    it('notifies status listeners on status change', () => {
      const statusListener = vi.fn();
      const unsubscribe = service.onStatusChange(statusListener);

      expect(statusListener).toHaveBeenCalledWith('disconnected');

      service.connect();
      expect(statusListener).toHaveBeenCalledWith('connecting');

      unsubscribe();
    });

    it('notifies reconnect listeners through handler callbacks', () => {
      const reconnectListener = vi.fn();
      service.onReconnect(reconnectListener);
      service.connect();

      const callbacks = mockReconnectHandler.bind.mock.calls[0][1];
      callbacks.onReconnect(3);

      expect(reconnectListener).toHaveBeenCalledWith(3);
    });

    it('notifies error listeners through handler callbacks', () => {
      const errorListener = vi.fn();
      service.onError(errorListener);
      service.connect();

      const callbacks = mockReconnectHandler.bind.mock.calls[0][1];
      const error = new Error('Socket failed');
      callbacks.onError(error);

      expect(errorListener).toHaveBeenCalledWith(error);
    });
  });
});

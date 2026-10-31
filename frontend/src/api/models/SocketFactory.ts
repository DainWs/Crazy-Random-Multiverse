import { io, Socket } from 'socket.io-client';

interface SocketConnectionOptions {
  url?: string;
  path?: string;
  auth?: Record<string, any>;
  query?: Record<string, any>;
  reconnection?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
  reconnectionDelayMax?: number;
  timeout?: number;
}

type SocketFactory = (options?: Partial<SocketConnectionOptions>) => Socket;

const DEFAULT_OPTIONS: SocketConnectionOptions = {
  path: (import.meta as any).env?.VITE_SOCKET_URL ?? '/socket.io',
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 10000,
}

function createIOSocket(options?: Partial<SocketConnectionOptions>): Socket {
  const mergedOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
  }

  const targetUrl = mergedOptions.url || (typeof window !== 'undefined' ? window.location.origin : '');

  return io(targetUrl, {
    path: mergedOptions.path,
    transports: ['websocket', 'polling'],
    autoConnect: true,
    withCredentials: true,
    reconnection: mergedOptions.reconnection,
    reconnectionAttempts: mergedOptions.reconnectionAttempts,
    reconnectionDelay: mergedOptions.reconnectionDelay,
    reconnectionDelayMax: mergedOptions.reconnectionDelayMax,
    timeout: mergedOptions.timeout,
    auth: mergedOptions.auth,
    query: mergedOptions.query,
  });
}

export type { SocketFactory, SocketConnectionOptions }
export { createIOSocket }
import type { ConnectionStatus } from '@/api/models/ConnectionStatus';
import { Socket } from 'socket.io-client';

interface LifecycleCallbacks {
  setStatus: (status: ConnectionStatus) => void;
  onReconnect: (attempt: number) => void;
  onError: (error: Error) => void;
  emit: (event: string, ...args: unknown[]) => void;
}

type SocketReconnectHandler = {
  bind: (socket: Socket, callbacks: LifecycleCallbacks) => void;
}

const bindReconnectHandlers = (socket: Socket, callbacks: LifecycleCallbacks) => {
  socket.on('connect', createOnConnect(socket, callbacks));
  socket.on('disconnect', createOnDisconnect(socket, callbacks));
  socket.on('connect_error', createOnError(callbacks));

  const manager = socket.io;
  manager.on('reconnect_attempt', createOnReconnectAttempt(callbacks));
  manager.on('reconnect', createOnReconnect(callbacks));
  manager.on('reconnect_error', createOnReconnectError(callbacks));
}

function createOnConnect(socket: Socket, callbacks: LifecycleCallbacks) {
  return () => {
    console.log('[SocketService] Connected to Socket.IO server. Socket ID:', socket.id);
    callbacks.setStatus('connected');
  }
}

/** The client does not retry on its own after the server closes the socket, so it connects again (UI-9). */
function createOnDisconnect(socket: Socket, callbacks: LifecycleCallbacks) {
  return (reason: string) => {
    console.warn('[SocketService] Disconnected:', reason);
    callbacks.setStatus('reconnecting');
    if (reason === 'io server disconnect') {
      socket.connect();
    }
  }
}

function createOnError(callbacks: LifecycleCallbacks) {
  return (error: Error) => {
    console.error('[SocketService] Connection error:', error.message);
    callbacks.setStatus('error');
    callbacks.onError(error);
  }
}

/// Reconnection

function createOnReconnectAttempt(callbacks: LifecycleCallbacks) {
  return (attempt: number) => {
    console.log(`[SocketService] Reconnection attempt #${attempt}...`);
    callbacks.setStatus('reconnecting');
  }
}

function createOnReconnect(callbacks: LifecycleCallbacks) {
  return (attempt: number) => {
    console.log(`[SocketService] Successfully reconnected after ${attempt} attempts.`);
    callbacks.setStatus('connected');
    callbacks.onReconnect(attempt);
  }
}

function createOnReconnectError(callbacks: LifecycleCallbacks) {
  return (error: Error) => {
    console.warn('[SocketService] Reconnect error:', error.message);
    callbacks.setStatus('reconnecting');
  }
}

/// Utils 

const socketReconnectHandler: SocketReconnectHandler = {
  bind: bindReconnectHandlers,
}

export type { SocketReconnectHandler }
export default socketReconnectHandler;
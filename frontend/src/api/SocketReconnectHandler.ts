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
  socket.on('disconnect', createOnDisconnect(callbacks));
  socket.on('connect_error', createOnError(callbacks));

  const manager = socket.io;
  manager.on('reconnect_attempt', createOnReconnectAttempt(callbacks));
  manager.on('reconnect', createOnReconnect(callbacks));
  manager.on('reconnect_error', createOnReconnectError(callbacks));
  manager.on('reconnect_failed', createOnReconnectFailed(callbacks));
}

function createOnConnect(socket: Socket, callbacks: LifecycleCallbacks) {
  return () => {
    console.log('[SocketService] Connected to Socket.IO server. Socket ID:', socket.id);
    callbacks.setStatus('connected');
  }
}

function createOnDisconnect(callbacks: LifecycleCallbacks) {
  return (reason: string) => {
    console.warn('[SocketService] Disconnected:', reason);
    if (reason === 'io server disconnect') {
      callbacks.setStatus('disconnected');
    } else {
      callbacks.setStatus('reconnecting');
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

function createOnReconnectFailed(callbacks: LifecycleCallbacks) {
  return () => {
    console.error('[SocketService] Reconnection failed: maximum attempts reached.');
    callbacks.setStatus('reconnect_failed');
  }
}

/// Utils 

const socketReconnectHandler: SocketReconnectHandler = {
  bind: bindReconnectHandlers,
}

export type { SocketReconnectHandler }
export default socketReconnectHandler;
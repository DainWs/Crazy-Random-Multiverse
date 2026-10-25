import { Socket } from 'socket.io-client';
import EventSystem from '@/core/EventSystem';
import type { ConnectionStatus } from '@/api/models/ConnectionStatus';
import type { SocketFactory, SocketConnectionOptions } from '@/api/models/SocketFactory';
import type { SocketReconnectHandler } from '@/api/SocketReconnectHandler';
import type { SocketEventHandler } from '@/api/SocketEventHandler';
import type { SocketActionService } from '@/api/SocketActionService';
import type { StatusChangeListener, ReconnectListener, ErrorListener, GameEventListener } from '@/api/models/Listeners';
import type { ExceptionCodeDto } from '@/api/dtos/ExceptionDto';
import type { GameCode } from '@/domain/GameConfiguration';
import type { PlayerCode } from '@/domain/Player';
import { notifyListeners } from '@/api/models/Listeners';
import { createIOSocket } from '@/api/models/SocketFactory';
import socketReconnectHandler from '@/api/SocketReconnectHandler';
import socketEventHandler from '@/api/SocketEventHandler';
import socketActionService from '@/api/SocketActionService';
import { GameEventCode } from '@/api/models/GameEventCode';

type SocketOptions = {
  reconnectHandler: SocketReconnectHandler;
  eventHandler: SocketEventHandler;
  actionService: SocketActionService;

  socketFactory: SocketFactory;
}

class SocketService {
  private socket: Socket | null = null;
  private status: ConnectionStatus = 'disconnected';

  private statusListeners: Set<StatusChangeListener> = new Set();
  private reconnectListeners: Set<ReconnectListener> = new Set();
  private errorListeners: Set<ErrorListener> = new Set();

  private reconnectHandler: SocketReconnectHandler;
  private eventHandler: SocketEventHandler;
  private actionService: SocketActionService;
  private createSocket: SocketFactory;

  public constructor(options: SocketOptions) {
    this.reconnectHandler = options.reconnectHandler;
    this.eventHandler = options.eventHandler;
    this.actionService = options.actionService;
    this.createSocket = options.socketFactory;
  }

  public connect(options?: Partial<SocketConnectionOptions>): void {
    if (this.socket?.connected) return;

    this.setStatus('connecting');
    this.socket = this.createSocket(options);

    this.reconnectHandler.bind(this.socket, {
      setStatus: (status) => this.setStatus(status),
      onReconnect: (attempt) => notifyListeners(this.reconnectListeners, 'reconnect listener', attempt),
      onError: (err) => this.notifyErrors(err),
      emit: (event, ...args) => this.emit(event, ...args),
    });

    this.eventHandler.bind(this.socket, (err) => this.notifyErrors(err));
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.setStatus('disconnected');
  }

  public reconnect(): void {
    if (this.socket) {
      this.setStatus('reconnecting');
      this.socket.connect();
    } else {
      this.connect();
    }
  }

  public getStatus(): ConnectionStatus {
    return this.status;
  }

  public isConnected(): boolean {
    return this.status === 'connected' && !!this.socket?.connected;
  }

  public emit(event: string, ...args: unknown[]): void {
    if (this.socket?.connected) {
      this.socket.emit(event, ...args);
    } else {
      console.warn(`[SocketService] Cannot emit '${event}': Socket not connected.`);
    }
  }

  public joinGame(gameCode: GameCode, playerCode: PlayerCode): void {
    this.actionService.joinGame(gameCode, playerCode);
  }

  public leaveGame(gameCode: GameCode): void {
    this.actionService.leaveGame(gameCode);
  }

  public onGameEvent(eventCode: GameEventCode | string, listener: GameEventListener): () => void {
    return this.eventHandler.onGameEvent(eventCode, listener);
  }

  public offGameEvent(eventCode: GameEventCode | string, listener: GameEventListener): void {
    this.eventHandler.offGameEvent(eventCode, listener);
  }

  public onAnyGameEvent(listener: GameEventListener): () => void {
    return this.eventHandler.onAnyGameEvent(listener);
  }

  public offAnyGameEvent(listener: GameEventListener): void {
    this.eventHandler.offAnyGameEvent(listener);
  }

  public onStatusChange(listener: StatusChangeListener): () => void {
    this.statusListeners.add(listener);
    listener(this.status);
    return () => this.statusListeners.delete(listener);
  }

  public onReconnect(listener: ReconnectListener): () => void {
    this.reconnectListeners.add(listener);
    return () => this.reconnectListeners.delete(listener);
  }

  public onError(listener: ErrorListener): () => void {
    this.errorListeners.add(listener);
    return () => this.errorListeners.delete(listener);
  }

  private setStatus(newStatus: ConnectionStatus): void {
    if (this.status === newStatus) return;
    this.status = newStatus;
    notifyListeners(this.statusListeners, 'statusChangeListener', newStatus);
    EventSystem.rawEmit('socket.status', newStatus);
  }

  private notifyErrors(error: ExceptionCodeDto | Error): void {
    notifyListeners(this.errorListeners, 'errorListener', error);
  }
}

const socketService = new SocketService({
  reconnectHandler: socketReconnectHandler,
  eventHandler: socketEventHandler,
  actionService: socketActionService,
  socketFactory: createIOSocket,
});
export type { SocketOptions }
export default socketService;
export { SocketService };

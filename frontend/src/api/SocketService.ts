import type { ConnectionStatus } from '@/api/models/ConnectionStatus';
import type { SocketFactory, SocketConnectionOptions } from '@/api/models/SocketFactory';
import type { SocketReconnectHandler } from '@/api/SocketReconnectHandler';
import type { SocketEventHandler } from '@/api/SocketEventHandler';
import type { StatusChangeListener, ReconnectListener, ErrorListener } from '@/api/models/Listeners';
import type { ExceptionCodeDto } from '@/api/dtos/ExceptionDto';
import socketReconnectHandler from '@/api/SocketReconnectHandler';
import socketEventHandler from '@/api/SocketEventHandler';
import { Socket } from 'socket.io-client';
import { notifyListeners } from '@/api/models/Listeners';
import { createIOSocket } from '@/api/models/SocketFactory';

type SocketOptions = {
  reconnectHandler: SocketReconnectHandler;
  eventHandler: SocketEventHandler;

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
  private createSocket: SocketFactory;

  public constructor(options: SocketOptions) {
    this.reconnectHandler = options.reconnectHandler;
    this.eventHandler = options.eventHandler;
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
  }

  private notifyErrors(error: ExceptionCodeDto | Error): void {
    notifyListeners(this.errorListeners, 'errorListener', error);
  }
}

const socketService = new SocketService({
  reconnectHandler: socketReconnectHandler,
  eventHandler: socketEventHandler,
  socketFactory: createIOSocket,
});

export type { SocketOptions }
export default socketService;
export { SocketService };

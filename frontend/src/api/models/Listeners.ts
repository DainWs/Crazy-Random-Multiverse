import type { ConnectionStatus } from "@/api/models/ConnectionStatus";
import type { EventDto } from '@/api/dtos/EventDto';

type Listener<T> = (arg: T) => void;
type ListenerList<T> = Iterable<Listener<T>> | undefined;

type GameEventListener = Listener<EventDto>;
type StatusChangeListener = Listener<ConnectionStatus>;
type ReconnectListener = Listener<number>;
type ErrorListener = Listener<any>;

function notifyListeners<T>(listeners: ListenerList<T>, context: string, arg: T): void {
  if (!listeners) return;

  for (const listener of listeners) {
    try {
      listener(arg);
    } catch (err) {
      console.error(`[SocketService] Error in ${context}:`, err);
    }
  }
}

export type { Listener, GameEventListener, StatusChangeListener, ReconnectListener, ErrorListener };
export { notifyListeners };
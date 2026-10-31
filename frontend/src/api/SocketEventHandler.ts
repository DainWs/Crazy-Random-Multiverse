import type { EventDto } from '@/api/dtos/EventDto';
import type { ExceptionCodeDto } from '@/api/dtos/ExceptionDto';
import type { GameEventCode } from '@/api/models/GameEventCode';
import type { GameEventListener, CancelListenerCallback } from '@/api/models/Listeners';
import { GAME_EVENT_CODES } from '@/api/models/GameEventCode';
import { notifyListeners } from '@/api/models/Listeners';
import { Socket } from 'socket.io-client';
import EventSystem from '@/core/EventSystem';

type ErrorCallback = (error: ExceptionCodeDto) => void;
type RawEvent = string | EventDto;

interface SocketEventHandler {
  bind: (socket: Socket, onError: ErrorCallback) => void;
  onGameEvent: (eventCode: GameEventCode, listener: GameEventListener) => CancelListenerCallback;
  offGameEvent: (eventCode: GameEventCode, listener: GameEventListener) => void;
  onAnyGameEvent: (listener: GameEventListener) => CancelListenerCallback;
  offAnyGameEvent: (listener: GameEventListener) => void;
}

const anyEventListeners: Set<GameEventListener> = new Set();
const eventListeners: Map<string, Set<GameEventListener>> = new Map();

const bindEventHandlers = (socket: Socket, onError: ErrorCallback): void => {
  const eventChannels = ['event', 'game:event', 'game_event'];
  for (const channel of eventChannels) {
    socket.on(channel, handleIncomingEvent);
  }

  GAME_EVENT_CODES.forEach((eventCode) => {
    socket.on(eventCode, (data) => onEventCode(eventCode, data));
  });

  const errorChannels = ['error', 'game:error', 'exception'];
  for (const channel of errorChannels) {
    socket.on(channel, (error: ExceptionCodeDto) => {
      console.error(`[SocketService] Received error on '${channel}':`, error);
      onError(error);
      EventSystem.rawEmit('socket.error', error);
    });
  }
}

function onEventCode(eventCode: GameEventCode, data: any): void {
  if (data && typeof data === 'object' && !data.code) {
    handleIncomingEvent({ code: eventCode, details: data });
  } else {
    handleIncomingEvent(data);
  }
}

const onGameEvent = (eventCode: GameEventCode, listener: GameEventListener): CancelListenerCallback => {
  if (!eventListeners.has(eventCode)) {
    eventListeners.set(eventCode, new Set());
  }

  eventListeners.get(eventCode)!.add(listener);
  return () => offGameEvent(eventCode, listener);
}

const offGameEvent = (eventCode: GameEventCode, listener: GameEventListener): void => {
  const listeners = eventListeners.get(eventCode);
  if (listeners) listeners.delete(listener);
  if (listeners && listeners.size === 0) eventListeners.delete(eventCode);
}

const onAnyGameEvent = (listener: GameEventListener): CancelListenerCallback => {
  anyEventListeners.add(listener);
  return () => offAnyGameEvent(listener);
}

const offAnyGameEvent = (listener: GameEventListener): void => {
  anyEventListeners.delete(listener);
}

function handleIncomingEvent(rawEvent: RawEvent): void {
  if (!rawEvent) return;
  const event: EventDto = parseRawEvent(rawEvent);

  console.log('[SocketService] Received game event:', event.code, event);
  // TODO maybe its a good idea to syncronize the game here? syncGameStateFromEvent(event);

  notifyListeners(anyEventListeners, 'any event listener', event);
  if (event.code) {
    notifyListeners(eventListeners.get(event.code), `event listener for ${event.code}`, event);
  }

  EventSystem.rawEmit('socket.event', event);
  if (event.code) {
    EventSystem.rawEmit(`game.${String(event.code).toLowerCase()}`, event);
  }
}

function parseRawEvent(rawEvent: RawEvent): EventDto {
  if (typeof rawEvent === 'string') {
    return JSON.parse(rawEvent);
  }
  return rawEvent;
}

const socketEventHandler: SocketEventHandler = {
  bind: bindEventHandlers,
  onGameEvent,
  offGameEvent,
  onAnyGameEvent,
  offAnyGameEvent,
}

export type { SocketEventHandler }
export default socketEventHandler;

import { Socket } from 'socket.io-client';
import StoreSystem from '@/core/StoreSystem';
import EventSystem from '@/core/EventSystem';
import {
  EventDto,
  GameEventCode,
  cardFromDto,
  ExceptionCodeDto
} from '@/api/dtos/EventDto';
import { GameEventListener, notifyListeners } from '@/api/models/Listeners';

type ErrorCallback = (error: ExceptionCodeDto) => void;
type RawEvent = string | EventDto;

interface SocketEventHandler {
  bind: (socket: Socket, onError: ErrorCallback) => void;
  onGameEvent: (eventCode: GameEventCode | string, listener: GameEventListener) => () => void;
  offGameEvent: (eventCode: GameEventCode | string, listener: GameEventListener) => void;
  onAnyGameEvent: (listener: GameEventListener) => () => void;
  offAnyGameEvent: (listener: GameEventListener) => void;
}

const anyEventListeners: Set<GameEventListener> = new Set();
const eventListeners: Map<string, Set<GameEventListener>> = new Map();

const bindEventHandlers = (socket: Socket, onError: ErrorCallback): void => {
  const eventChannels = ['event', 'game:event', 'game_event'];
  for (const channel of eventChannels) {
    socket.on(channel, handleIncomingEvent);
  }

  Object.values(GameEventCode).forEach((eventCode) => {
    socket.on(eventCode, (data) => {
      if (data && typeof data === 'object' && !data.code) {
        handleIncomingEvent({ code: eventCode, details: data });
      } else {
        handleIncomingEvent(data);
      }
    });
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

const onGameEvent = (eventCode: GameEventCode | string, listener: GameEventListener): () => void => {
  if (!eventListeners.has(eventCode)) {
    eventListeners.set(eventCode, new Set());
  }

  eventListeners.get(eventCode)!.add(listener);
  return () => offGameEvent(eventCode, listener);
}

const offGameEvent = (eventCode: GameEventCode | string, listener: GameEventListener): void => {
  const listeners = eventListeners.get(eventCode);
  if (listeners) listeners.delete(listener);
  if (listeners && listeners.size === 0) eventListeners.delete(eventCode);
}

const onAnyGameEvent = (listener: GameEventListener): () => void => {
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
  syncGameStateFromEvent(event);

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

function syncGameStateFromEvent(event: EventDto): void {
  try {
    const details = event.details;
    if (details?.playerHand && Array.isArray(details.playerHand)) {
      const hand = details.playerHand.map(cardFromDto);
      StoreSystem.setPlayerHand(hand);
    }
  } catch (err) {
    console.warn('[SocketService] Failed to map and set player hand from event:', err);
  }
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

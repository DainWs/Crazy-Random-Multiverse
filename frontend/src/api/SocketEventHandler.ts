import type { EventDto } from '@/api/dtos/EventDto';
import type { PartyDto } from '@/api/dtos/PartyDto';
import type Party from '@/domain/Party';
import type { GameEventCode } from '@/api/models/GameEventCode';
import type { GameEventListener, CancelListenerCallback, Listener } from '@/api/models/Listeners';
import { GAME_EVENT_CODES } from '@/api/models/GameEventCode';
import { notifyListeners } from '@/api/models/Listeners';
import { toParty } from '@/api/dtos/PartyDto';
import { Socket } from 'socket.io-client';

const PARTY_INFO_CHANNEL = 'party:info';
const USER_SYNCED_CHANNEL = 'user:synced';

type RawEvent = string | EventDto;

interface SocketEventHandler {
  bind: (socket: Socket) => void;
  onGameEvent: (eventCode: GameEventCode, listener: GameEventListener) => CancelListenerCallback;
  offGameEvent: (eventCode: GameEventCode, listener: GameEventListener) => void;
  onAnyGameEvent: (listener: GameEventListener) => CancelListenerCallback;
  offAnyGameEvent: (listener: GameEventListener) => void;
  onPartyInfo: (listener: Listener<Party>) => CancelListenerCallback;
  onUserSynced: (listener: Listener<void>) => CancelListenerCallback;
}

const anyEventListeners: Set<GameEventListener> = new Set();
const eventListeners: Map<string, Set<GameEventListener>> = new Map();
const partyInfoListeners: Set<Listener<Party>> = new Set();
const userSyncedListeners: Set<Listener<void>> = new Set();

const bindEventHandlers = (socket: Socket): void => {
  const eventChannels = ['event', 'game:event', 'game_event'];
  for (const channel of eventChannels) {
    socket.on(channel, handleIncomingEvent);
  }

  GAME_EVENT_CODES.forEach((eventCode) => {
    socket.on(eventCode, (data) => onEventCode(eventCode, data));
  });

  socket.on(PARTY_INFO_CHANNEL, (dto: PartyDto) => notifyListeners(partyInfoListeners, 'party info listener', toParty(dto)));
  socket.on(USER_SYNCED_CHANNEL, () => notifyListeners(userSyncedListeners, 'user synced listener', undefined));
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

const onPartyInfo = (listener: Listener<Party>): CancelListenerCallback => {
  partyInfoListeners.add(listener);
  return () => partyInfoListeners.delete(listener);
}

const onUserSynced = (listener: Listener<void>): CancelListenerCallback => {
  userSyncedListeners.add(listener);
  return () => userSyncedListeners.delete(listener);
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
  onPartyInfo,
  onUserSynced,
}

export type { SocketEventHandler }
export default socketEventHandler;

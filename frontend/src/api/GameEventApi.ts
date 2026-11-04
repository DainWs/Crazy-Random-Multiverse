import type { GameEventListener, Listener } from "@/api/models/Listeners";
import type { ActiveGame } from "@/domain/ActiveGame";
import type { GameEventCode } from "@/api/models/GameEventCode";
import { toActiveGame } from "@/api/dtos/GameDto";
import socketEventHandler from "@/api/SocketEventHandler";

const onGameApiEvent = (eventCode: GameEventCode, listener: GameEventListener) => {
  return socketEventHandler.onGameEvent(eventCode, listener);
}

const onGameLoading = (listener: Listener<ActiveGame>) => {
  return socketEventHandler.onGameEvent('GAME_LOADING', (event) => listener(toActiveGame(event.details.game)));
}

const onGameSync = (listener: Listener<ActiveGame>) => {
  return socketEventHandler.onGameEvent('GAME_SYNC', (event) => listener(toActiveGame(event.details.game)));
}

const onAnyGameApiEvent = (listener: GameEventListener) => {
  return socketEventHandler.onAnyGameEvent(listener);
}

export {
  onGameApiEvent,
  onGameLoading,
  onGameSync,
  onAnyGameApiEvent
}
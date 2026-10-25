import type { GameEventListener } from "@/api/models/Listeners";
import type { GameEventCode } from "@/api/models/GameEventCode";
import socketEventHandler from "@/api/SocketEventHandler";

const onGameApiEvent = (eventCode: GameEventCode, listener: GameEventListener) => {
  return socketEventHandler.onGameEvent(eventCode, listener);
}

const onAnyGameApiEvent = (listener: GameEventListener) => {
  return socketEventHandler.onAnyGameEvent(listener);
}

export {
  onGameApiEvent,
  onAnyGameApiEvent
}
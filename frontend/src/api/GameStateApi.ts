import type { EventDto } from '@/api/dtos/EventDto';
import type { CancelListenerCallback } from '@/api/models/Listeners';
import { toGameSnapshot } from '@/api/dtos/GameDto';
import socketEventHandler from '@/api/SocketEventHandler';
import StoreSystem from '@/core/StoreSystem';

/** Keeps the game state of the store equal to the one the server sends in every event (CON-10). */
const bind = (): CancelListenerCallback => {
  return socketEventHandler.onAnyGameEvent(applyEvent);
}

function applyEvent(event: EventDto) {
  StoreSystem.applyGame(toGameSnapshot(event.details.game, StoreSystem.getUser().code));
}

export { bind };

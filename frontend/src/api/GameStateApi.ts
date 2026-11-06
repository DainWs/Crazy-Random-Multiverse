import type { EventDto } from '@/api/dtos/EventDto';
import type { CancelListenerCallback } from '@/api/models/Listeners';
import { toGameSnapshot } from '@/api/dtos/GameDto';
import GameEventQueue from '@/api/GameEventQueue';
import socketEventHandler from '@/api/SocketEventHandler';
import StoreSystem from '@/core/StoreSystem';

const queue = new GameEventQueue(applyEvent);

/** Keeps the game state of the store equal to the one the server sends in every event, in order (CON-10, CON-12). */
const bind = (): CancelListenerCallback => {
  return socketEventHandler.onAnyGameEvent((event) => queue.push(event));
}

/** The events waiting for a missing one belong to a game the user no longer has. */
const reset = (): void => {
  queue.reset();
}

function applyEvent(event: EventDto) {
  StoreSystem.applyGame(toGameSnapshot(event.details.game, StoreSystem.getUser().code));
}

export { bind, reset };

import type { EventDto } from '@/api/dtos/EventDto';
import type { CancelListenerCallback } from '@/api/models/Listeners';
import type { GameEventCode } from '@/api/models/GameEventCode';
import type { PlayerCode } from '@/domain/Player';
import { toCard, toCardCode } from '@/api/dtos/CardDto';
import { toGameSnapshot } from '@/api/dtos/GameDto';
import { toPlayer } from '@/api/dtos/PlayerDto';
import GameEventQueue from '@/api/GameEventQueue';
import socketEventHandler from '@/api/SocketEventHandler';
import StoreSystem from '@/core/StoreSystem';

/** The events whose source card leaves the hand of its owner (CON-13). */
const PLAYED_CARD_EVENT_CODES: readonly GameEventCode[] = ['PLAYER_PUT_CARD', 'PLAYER_EQUIP_CARD'];

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
  const localPlayerCode = StoreSystem.getUser().code;
  StoreSystem.applyGame(toGameSnapshot(event.details.game, localPlayerCode));
  applyHand(event, localPlayerCode);
  applyResult(event);
}

/** Only the events of the local player change their hand: the others never carry a card they could see (CON-13, HAND-3). */
function applyHand(event: EventDto, localPlayerCode: PlayerCode) {
  const { sourcePlayer, sourceCard, targetPlayer, targetCard, hand } = event.details;

  if (event.code === 'GAME_SYNC') {
    StoreSystem.setPlayerHand((hand ?? []).map(toCard));
  } else if (event.code === 'PLAYER_RECEIVE_CARD' && targetCard) {
    StoreSystem.addCardToHand(toCard(targetCard));
  } else if (PLAYED_CARD_EVENT_CODES.includes(event.code) && sourceCard && sourcePlayer?.code === localPlayerCode) {
    StoreSystem.removeCardFromHand(toCardCode(sourceCard.catalogCode));
  } else if (event.code === 'PLAYER_DIE' && targetPlayer?.code === localPlayerCode) {
    StoreSystem.setPlayerHand([]);
  }
}

/** The server decides when the game ends and who wins (WIN-3). */
function applyResult(event: EventDto) {
  const { targetPlayer } = event.details;

  if (event.code === 'GAME_END') {
    StoreSystem.endGame();
  } else if (event.code === 'GAME_END_WITH_WINNER' && targetPlayer) {
    StoreSystem.setWinner(toPlayer(targetPlayer));
  }
}

export { bind, reset };

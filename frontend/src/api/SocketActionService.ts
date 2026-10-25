import type { GameCode } from "@/domain/GameConfiguration";
import type { PlayerCode } from "@/domain/Player";
import socketService from "@/api/SocketService";
import socketMemory from "@/api/SocketMemory";
import StoreSystem from "@/core/StoreSystem";

interface SocketActionService {
  joinGame(gameCode: GameCode, playerCode: PlayerCode): void;
  leaveGame(gameCode: GameCode): void;
}

/**
 * Join a game room
 */
function joinGame(gameCode: GameCode, playerCode: PlayerCode): void {
  socketMemory.activeGameCode = gameCode;
  if (playerCode) {
    socketMemory.activePlayerCode = playerCode;
  }

  if (socketService.isConnected()) {
    socketService.emit('game:join', { gameCode, playerCode: socketMemory.activePlayerCode });
  }
}

/**
 * Leave a game room
 */
function leaveGame(gameCode: GameCode): void {
  const code = gameCode || socketMemory.activeGameCode;
  if (code && socketService.isConnected()) {
    socketService.emit('game:leave', { gameCode: code, playerCode: socketMemory.activePlayerCode });
  }
  socketMemory.clearMemory();
}


const socketActionService: SocketActionService = {
  joinGame,
  leaveGame
}

export type { SocketActionService }
export default socketActionService
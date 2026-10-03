import socketMemory from "@/api/SocketMemory";
import socketService from "@/api/SocketService";

interface SocketActionService {
  joinGame(gameCode: string, playerCode?: string): void;
  leaveGame(gameCode?: string): void;
}

/**
 * Join a game room
 */
function joinGame(gameCode: string, playerCode?: string): void {
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
function leaveGame(gameCode?: string): void {
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
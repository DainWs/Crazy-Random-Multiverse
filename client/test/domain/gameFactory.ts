import Game from "@/domain/models/Game";
import GameCode from "@/domain/models/GameCode";
import Player from "@/domain/models/Player";
import Zone from "@/domain/models/Zone";
import playerFactory from "@test/domain/playerFactory";

const createGameCode = (codeValue?: string): GameCode => {
  return codeValue ?? `game-${Math.floor(Math.random() * 10000)}`;
}

const createGame = (code?: GameCode, playerWithTurn?: Player, zones?: Zone[]): Game => {
  if (!code) code = createGameCode();
  if (!playerWithTurn) playerWithTurn = playerFactory.createPlayer();
  const game = new Game(code, playerWithTurn);
  game.zones = (zones == undefined) ? [] : zones;
  return game;
}

export default {
  createGameCode,
  createGame
}
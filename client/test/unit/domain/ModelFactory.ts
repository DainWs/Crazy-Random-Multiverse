import { CardCode, CardType } from "@/domain/models/Card";
import Game from "@/domain/models/Game";
import GameCode from "@/domain/models/GameCode";
import Player, { PlayerCode } from "@/domain/models/Player";
import Position from "@/domain/models/Position";
import Zone from "@/domain/models/Zone";

const createGameCode = (codeValue?: string): GameCode => {
  return codeValue ?? `game-${Math.floor(Math.random() * 10000)}`;
}

const createCardCode = (value?: number, type?: CardType): CardCode => {
  if (!value) value = Math.floor(Math.random() * 10000);
  if (!type) type = getRandomCardType();
  return new CardCode(value, type);
}

const createPlayerCode = (codeValue?: string): PlayerCode => {
  return codeValue ?? `player-${Math.floor(Math.random() * 10000)}`;
}

const createGame = (code?: GameCode, playerWithTurn?: Player, zones?: Zone[]): Game => {
  if (!code) code = createGameCode();
  if (!playerWithTurn) playerWithTurn = createPlayer();
  const game = new Game(code, playerWithTurn);
  game.zones = (zones == undefined) ? [] : zones;
  return game;
}

const createPlayer = (code?: string, name?: string, isSpectator?: boolean, isAlive?: boolean): Player => {
  if (!code) code = createPlayerCode();
  if (!name) name =  `playername-${Math.floor(Math.random() * 10000)}`;
  const player = new Player(code, name);
  player.isSpectator = (isSpectator == undefined) ? false : isSpectator;
  player.isAlive = (isAlive == undefined) ? true : isAlive;
  return player;
}

const createPosition = (row?: number, column?: number): Position => {
  if (!row) row = Math.floor(Math.random() * 3) + 1;
  if (!column) column = Math.floor(Math.random() * 3) + 1;
  return new Position(row, column);
}

const getRandomCardType = (): CardType => {
  const cardTypes: CardType[] = ["EQUIPMENT", "LEADER", "SPELL", "WARRIOR"];
  return cardTypes[Math.floor(Math.random()*cardTypes.length)];
}


export {
  createGameCode,
  createCardCode,
  createPlayerCode,
  createGame,
  createPlayer,
  createPosition,
  getRandomCardType
}
import Player, { PlayerCode } from "@/domain/models/Player";

const createPlayerCode = (codeValue?: string): PlayerCode => {
  return codeValue ?? `player-${Math.floor(Math.random() * 10000)}`;
}

const createPlayer = (code?: string, name?: string, isSpectator?: boolean, isAlive?: boolean): Player => {
  if (!code) code = createPlayerCode();
  if (!name) name =  `playername-${Math.floor(Math.random() * 10000)}`;
  const player = new Player(code, name);
  player.isSpectator = (isSpectator == undefined) ? false : isSpectator;
  player.isAlive = (isAlive == undefined) ? true : isAlive;
  return player;
}

export default {
  createPlayerCode,
  createPlayer
}
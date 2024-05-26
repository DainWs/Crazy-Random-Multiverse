import Game from "@/domain/models/Game";
import Hand from "@/domain/models/Hand";
import Player from "@/domain/models/Player";

let game: Game;
let player: Player;
let hand: Hand;

const setGame = (newGame: Game) => {
  game = newGame;
}

const getGame = (): Game | null => {
  return game;
}

const setPlayer = (newPlayer: Player) => {
  player = newPlayer;
}

const getPlayer = (): Player => {
  return player;
}

const setHand = (newHand: Hand) => {
  hand = newHand;
}

const getHand = (): Hand => {
  return hand;
}

const Context = {
  setGame,
  getGame,
  setPlayer,
  getPlayer,
  setHand,
  getHand
};

export default Context;
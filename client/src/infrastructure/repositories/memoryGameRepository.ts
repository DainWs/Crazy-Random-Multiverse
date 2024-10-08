import Game from '@/domain/models/Game';

let currentGame: Game | undefined;

const existCurrentGame = (): boolean => {
  return currentGame !== undefined;
};

const findCurrentGame = (): Game | undefined => {
  return currentGame;
};

const updateCurrentGame = (game: Game): void => {
  currentGame = game;
};

export default {
  existCurrentGame,
  findCurrentGame,
  updateCurrentGame
};

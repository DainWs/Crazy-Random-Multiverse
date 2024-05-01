import EventProcessorProvider from '@/application/events/eventHandlerProvider';
import {makeReactive} from '@/infrastructure/view';

console.log(makeReactive);

const userInfo = {};

const gameInfo = {
  playerWithTurn: undefined,
  zones: []
};

const playerInfo = {
  code: undefined,
  name: undefined,
  isSpectator: false,
  isAlive: true
};

const handInfo = {
  cards: new Array()
};

const errorInfo = {
  key: undefined,
  value: undefined,
  language: undefined
};

const processGameEvent = async (event) => {
  try {
    const currentContext = {
      user: userInfo.value,
      game: gameInfo.value,
      player: playerInfo.value,
      hand: handInfo.value
    };

    const eventProcessor = EventProcessorProvider.getEventProcessor(event.code);
    await eventProcessor.process(event, currentContext);

    gameInfo.value = currentContext.game;
    playerInfo.value = currentContext.player;
    handInfo.value = currentContext.hand;
  } catch (error) {
    console.error(error);
    errorInfo.value = error.message;
  }
};

const processGameError = (error) => {
  errorInfo.value = error;
};

function getGameInfo() {
  return gameInfo;
}

function getPlayerInfo() {
  return playerInfo;
}

function getHandInfo() {
  return handInfo;
}

export default {
  processGameEvent,
  processGameError,

  getGameInfo,
  getPlayerInfo,
  getHandInfo
};

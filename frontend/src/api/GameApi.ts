import Action from "@/domain/Action";
import { GameCode } from "@/domain/GameConfiguration";

const sendAction = async (action: Action) => {
  console.log(`Sending action: ${action}`);
}

const sendPassTurnAction = async (gameCode: GameCode) => {
  console.log(`Sending pass turn action: ${gameCode}`);
}

const sendReady = async (gameCode: GameCode) => {
  await fetch(`/game/${gameCode}/ready`, {
    method: 'POST'
  });
}

export {
  sendAction,
  sendPassTurnAction,
  sendReady
};
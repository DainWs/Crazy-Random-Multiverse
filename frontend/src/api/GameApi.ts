import Action from "@/domain/Action";
import GameCode from "@/domain/GameCode";

const sendAction = async (action: Action) => {
  console.log(`Sending action: ${action}`);
}

const sendPassTurnAction = async (gameCode: GameCode) => {
  console.log(`Sending pass turn action: ${gameCode}`);
}

export {
  sendAction,
  sendPassTurnAction
};
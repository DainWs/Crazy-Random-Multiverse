import Player from '@/domain/models/Player';
import ActionTarget from '@/domain/actions/ActionTarget';
import ActionSource from '@/domain/actions/ActionSource';
import ActionBuilder from '@/domain/actions/ActionBuilder';

let currentActionBuilder: ActionBuilder;

const hasAlreadyStartedAnAction = () => {
  return currentActionBuilder != undefined && !currentActionBuilder.hasFinish();
}

const startAction = (playerThatStartAction: Player) => {
  if (currentActionBuilder == undefined || currentActionBuilder.hasFinish()) {
    currentActionBuilder = new ActionBuilder(onActionSourceComplete, onActionTargetComplete);
  }

  return currentActionBuilder.sourceActionBuilder(playerThatStartAction);
}

const endAction = () => {
  if (currentActionBuilder == undefined || currentActionBuilder.hasFinish()) {
    throw new Error("You should call first 'startAction'");
  }

  return currentActionBuilder.targetActionBuilder();
}

const cancelAction = () => {
  currentActionBuilder.cancel();
}

function onActionSourceComplete(source: ActionSource) {
  console.log(`Player action [01/02] complete: source${JSON.stringify(source)}`);
}

function onActionTargetComplete(target: ActionTarget) {
  console.log(`Player action [02/02] complete: target${JSON.stringify(target)}`);
  //currentActionBuilder.build();
  /*
  const game = gameRepository.findCurrentGame();
  if (game == undefined) {
    throw new Error("You are not in a game");
  }

  console.debug("Sending action to server");
  const action = currentActionBuilder.build(game);
  sendAction(game.code, action);
  */
}

export { hasAlreadyStartedAnAction, startAction, endAction, cancelAction };

import Action from '@/domain/actions/Action';
import ActionTarget from '@/domain/actions/ActionSource';
import ActionSource from '@/domain/actions/ActionTarget';
import { sendAction } from '@/infrastructure/api/v1';
import { gameRepository } from '@/infrastructure/repositories';

const triggerAction = async (actionSource: ActionSource, actionTarget: ActionTarget) => {
  const game = gameRepository.findCurrentGame();
  if (game) {
    const action = new Action(game, actionSource, actionTarget);
    await sendAction(game.code, action);
  }
};

export { triggerAction };

import { createAction } from '@/domain/actions/actionFactory';
import { sendAction } from '@/infrastructure/api/v1';
import { gameRepository } from '@/infrastructure/repositories';

/**
 * @param {import('@/domain/actions/Action').ActionSource} actionSource
 * @param {import('@/domain/actions/Action').ActionTarget} actionTarget
 */
const triggerAction = async (actionSource, actionTarget) => {
  const game = gameRepository.findCurrentGame();
  const action = createAction(game, actionSource, actionTarget);
  await sendAction(game.code, action);
};

export { triggerAction };

import { createAction } from "@/domain/game/action";
import { sendAction } from "@/infrastructure/api/v1";
import { gameRepository } from "@/infrastructure/repositories";


/**
 * @typedef {import('@/domain/game/action').ActionSource} ActionSource
 * @typedef {import('@/domain/game/action').ActionTarget} ActionTarget
 */

/**
 * @param {ActionSource} actionSource
 * @param {ActionTarget} actionTarget
 */
const triggerAction = async (actionSource, actionTarget) => {
    const game = gameRepository.findCurrentGame();
    const action = createAction(game, actionSource, actionTarget);
    await sendAction(game.code, action);
}

export { triggerAction }
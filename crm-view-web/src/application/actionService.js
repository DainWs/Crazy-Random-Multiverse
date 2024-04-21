import { createAction } from "@/domain/action";
import { sendAction } from "@/infrastructure/api/v1";
import gameProvider from "@/application/providers/gameProvider";

/**
 * @typedef {import('@/domain/action').ActionSource} ActionSource
 * @typedef {import('@/domain/action').ActionTarget} ActionTarget
 */

/**
 * @param {ActionSource} actionSource
 * @param {ActionTarget} actionTarget
 */
const triggerAction = async (actionSource, actionTarget) => {
    const game = gameProvider.provide();
    const action = createAction(game, actionSource, actionTarget);
    await sendAction(game.code, action);
}

export { triggerAction }
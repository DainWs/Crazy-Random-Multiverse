import actionResolver from '@/domain/game/actionResolver';

/**
 * @typedef {import('@/domain/game').Game} Game
 * @typedef {import('@/domain/game/action').Action} Action
 * @typedef {import('@/domain/game/action').ActionSource} ActionSource
 * @typedef {import('@/domain/game/action').ActionTarget} ActionTarget
 */

/**
 * @param {Game} game 
 * @param {ActionSource} source 
 * @param {ActionTarget} target 
 */
const createAction = (game, source, target) => {
    /** @type {Action} */
    const action = {};
    action.game = game.code;
    action.type = actionResolver.resolveType(source.sourceTrigger, target.targetTrigger);
    action.sourcePosition = source.sourcePosition;
    action.sourcePlayer = source.sourcePlayer;
    action.sourceCard = source.sourceCard;
    action.targetPosition = target.targetPosition;
    action.targetPlayer = target.targetPlayer;
    action.targetCard = target.targetCard;
    return action;
}

export {
    createAction
}
/**
 * @typedef {import('@/domain/action').ViewElement} ViewElement
 * @typedef {import('@/domain/action').ViewAction} ViewAction
 * @typedef {import('@/domain/action').ActionTrigger} ActionTrigger
 * @typedef {import('@/domain/action').ActionType} ActionType
 */

/**
 * Format: `ViewElement@ViewAction_to_ViewElement@ViewAction`
 * Example: `Hand@Grab_to_ZoneSlot@Drop`
 * @typedef {String} ActionTriggerKey
 */

/**
 * @type {Map<ActionTriggerKey, ActionType>}
 */
const ACTION_TYPES = new Map();
ACTION_TYPES.set(createKey('Hand', 'Grab', 'ZoneSlot', 'Drop'), 'PUT_CARD');
ACTION_TYPES.set(createKey('ZoneSlot', 'Grab', 'ZoneSlot', 'Drop'), 'MOVE_CARD');
ACTION_TYPES.set(createKey('ZoneSlot.Card', 'Click', 'ZoneSlot.Card', 'Click'), 'ATTACK_CARD');

/**
 * @param {ActionTrigger} sourceTrigger 
 * @param {ActionTrigger} targetTrigger
 */
const resolveType = (sourceTrigger, targetTrigger) => {
    const key = getKeyFromTriggers(sourceTrigger, targetTrigger);

    if (ACTION_TYPES.has(key)) {
        return ACTION_TYPES.get(key);
    }

    throw new Error('Invalid action');
}

/**
 * @param {ActionTrigger} sourceTrigger 
 * @param {ActionTrigger} targetTrigger 
 * @returns {ActionTriggerKey}
 */
function getKeyFromTriggers(sourceTrigger, targetTrigger) {
    return createKey(sourceTrigger.element, sourceTrigger.action, targetTrigger.element, targetTrigger.action);
}

/**
 * 
 * @param {ViewElement} sourceViewElement 
 * @param {ViewAction} sourceViewAction 
 * @param {ViewElement} targetViewElement 
 * @param {ViewAction} targetViewAction 
 * @returns {ActionTriggerKey}
 */
function createKey(sourceViewElement, sourceViewAction, targetViewElement, targetViewAction) {
    return `${sourceViewElement}@${sourceViewAction}_to_${targetViewElement}@${targetViewAction}`;
}

export default { resolveType }
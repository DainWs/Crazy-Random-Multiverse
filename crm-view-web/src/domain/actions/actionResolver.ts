import ActionTrigger from "@/domain/actions/ActionTrigger";
import ActionType from "@/domain/actions/ActionType";
import ViewElement from "@/domain/actions/ViewElements";
import ViewAction from "@/domain/actions/ViewAction";

type ActionTriggerKey = string;

const ACTION_TYPES = new Map<ActionTriggerKey, ActionType>();
ACTION_TYPES.set(createKey('Hand', 'Grab', 'ZoneSlot', 'Drop'), 'PUT_CARD');
ACTION_TYPES.set(createKey('ZoneSlot', 'Grab', 'ZoneSlot', 'Drop'), 'MOVE_CARD');
ACTION_TYPES.set(createKey('ZoneSlot.Card', 'Click', 'ZoneSlot.Card', 'Click'), 'ATTACK_CARD');

const resolveType = (sourceTrigger: ActionTrigger, targetTrigger: ActionTrigger): ActionType => {
    const key = getKeyFromTriggers(sourceTrigger, targetTrigger);

    const resolvedType = ACTION_TYPES.get(key);
    if (resolvedType) {
        return resolvedType;
    }
    
    throw new Error('Invalid action');
}

function getKeyFromTriggers(sourceTrigger: ActionTrigger, targetTrigger: ActionTrigger): ActionTriggerKey {
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
function createKey(sourceViewElement: ViewElement, sourceViewAction: ViewAction, targetViewElement: ViewElement, targetViewAction: ViewAction) {
    return `${sourceViewElement}@${sourceViewAction}_to_${targetViewElement}@${targetViewAction}`;
}

export default { resolveType }
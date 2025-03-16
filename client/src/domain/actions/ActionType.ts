import ActionTrigger from '@/domain/actions/ActionTrigger';
import ViewElement from '@/domain/actions/ViewElements';
import ViewAction from '@/domain/actions/ViewAction';

type ActionType = 'PUT_CARD' | 'MOVE_CARD' | 'ATTACK_CARD';

type ActionTriggerKey = string;
const ACTION_TYPES = new Map<ActionTriggerKey, ActionType>();
ACTION_TYPES.set(createKey('Hand', 'Grab', 'ZoneSlot', 'Drop'), 'PUT_CARD');
ACTION_TYPES.set(createKey('ZoneSlot', 'Grab', 'ZoneSlot', 'Drop'), 'MOVE_CARD');
ACTION_TYPES.set(createKey('ZoneSlot.Card', 'SimpleClick', 'ZoneSlot.Card', 'SimpleClick'), 'ATTACK_CARD');

const resolveActionType = (sourceTrigger: ActionTrigger, targetTrigger: ActionTrigger): ActionType => {
  const key = getKeyFromTriggers(sourceTrigger, targetTrigger);

  const resolvedType = ACTION_TYPES.get(key);
  if (resolvedType) {
    return resolvedType;
  }

  throw new Error('Cant resolve ActionType from specified triggers');
};

function getKeyFromTriggers(sourceTrigger: ActionTrigger, targetTrigger: ActionTrigger): ActionTriggerKey {
  return createKey(sourceTrigger.element, sourceTrigger.action, targetTrigger.element, targetTrigger.action);
}

function createKey(sourceViewElement: ViewElement, sourceViewAction: ViewAction, targetViewElement: ViewElement, targetViewAction: ViewAction) {
  return `${sourceViewElement}@${sourceViewAction}_to_${targetViewElement}@${targetViewAction}`;
}

export { resolveActionType };
export default ActionType;

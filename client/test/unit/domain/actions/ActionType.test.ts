import { resolveActionType } from '@/domain/actions/ActionType';
import ActionTrigger from '@/domain/actions/ActionTrigger';

describe('ActionType - Unit tests', () =>{

  test('Should resolve as action type PUT_CARD', () => {
    const sourceTrigger: ActionTrigger = { action: 'Grab' , element: 'Hand' };
    const targetTrigger: ActionTrigger = { action: 'Drop' , element: 'ZoneSlot' };

    const actionType = resolveActionType(sourceTrigger, targetTrigger);

    expect(actionType).toBe('PUT_CARD');
  });

  test('Should resolve as action type ATTACK_CARD', () => {
    const sourceTrigger: ActionTrigger = { action: 'Click' , element: 'ZoneSlot.Card' };
    const targetTrigger: ActionTrigger = { action: 'Click' , element: 'ZoneSlot.Card' };

    const actionType = resolveActionType(sourceTrigger, targetTrigger);

    expect(actionType).toBe('ATTACK_CARD');
  });

  test('Should resolve as action type MOVE_CARD', () => {
    const sourceTrigger: ActionTrigger = { action: 'Grab' , element: 'ZoneSlot' };
    const targetTrigger: ActionTrigger = { action: 'Drop' , element: 'ZoneSlot' };

    const actionType = resolveActionType(sourceTrigger, targetTrigger);

    expect(actionType).toBe('MOVE_CARD');
  });

  test('Should resolve as action type NONE', () => {
    const sourceTrigger: ActionTrigger = { action: 'Drop' , element: 'ZoneSlot.Card' };
    const targetTrigger: ActionTrigger = { action: 'Click' , element: 'Hand' };

    const actionType = resolveActionType(sourceTrigger, targetTrigger);

    expect(actionType).toBe('NONE');
  });
})
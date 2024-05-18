import { createCardCode, createGame, createPlayerCode, createPosition } from '@test/unit/domain/ModelFactory';

import Action from '@/domain/actions/Action';
import ActionType from '@/domain/actions/ActionType';
import ActionTarget from '@/domain/actions/ActionSource';
import ActionSource from '@/domain/actions/ActionTarget';
import ActionTrigger from '@/domain/actions/ActionTrigger';

describe('Action - Unit tests', () =>{
  const game = createGame();
  const actionSource = createActionSourceWithTrigger({ action: 'Grab' , element: 'ZoneSlot' });
  const actionTarget = createActionTargetWithTrigger({ action: 'Drop' , element: 'ZoneSlot' });

  test('Should be action of same type', () => {
    const action = new Action(game, actionSource, actionTarget);

    const expectedType: ActionType = 'MOVE_CARD';
    expect(action.isType(expectedType)).toBe(true);
  });

  test('Should be action of different type', () => {
    const action = new Action(game, actionSource, actionTarget);

    const unExpectedType: ActionType = 'ATTACK_CARD';
    expect(action.isType(unExpectedType)).toBe(false);
  });
})

function createActionSourceWithTrigger(actionTrigger: ActionTrigger): ActionSource {
  return {
    sourceTrigger: actionTrigger,
    sourceCard: createCardCode(),
    sourcePlayer: createPlayerCode(),
    sourcePosition: createPosition()
  };
}

function createActionTargetWithTrigger(actionTrigger: ActionTrigger): ActionTarget {
  return {
    targetTrigger: actionTrigger,
    targetCard: createCardCode(),
    targetPlayer: createPlayerCode(),
    targetPosition: createPosition()
  };
}
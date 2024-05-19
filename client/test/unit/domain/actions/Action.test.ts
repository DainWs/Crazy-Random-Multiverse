import gameFactory from '@test/domain/gameFactory';
import actionFactory from '@test/domain/actionFactory';

import Action from '@/domain/actions/Action';
import ActionType from '@/domain/actions/ActionType';

describe('Action - Unit tests', () =>{
  const game = gameFactory.createGame();
  const actionSource = actionFactory.createActionSource({ action: 'Grab' , element: 'ZoneSlot' });
  const actionTarget = actionFactory.createActionTarget({ action: 'Drop' , element: 'ZoneSlot' });

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
import cardFactory from '@test/domain/cardFactory';
import playerFactory from '@test/domain/playerFactory';
import positionFactory from '@test/domain/positionFactory';

import ActionTarget from '@/domain/actions/ActionTarget';
import ActionSource from '@/domain/actions/ActionSource';
import ActionTrigger from '@/domain/actions/ActionTrigger';

const createActionSource = (actionTrigger: ActionTrigger): ActionSource => {
  return {
    sourceTrigger: actionTrigger,
    sourceCard: cardFactory.createCardCode(),
    sourcePlayer: playerFactory.createPlayerCode(),
    sourcePosition: positionFactory.createPosition()
  };
}

const createActionTarget = (actionTrigger: ActionTrigger): ActionTarget => {
  return {
    targetTrigger: actionTrigger,
    targetCard: cardFactory.createCardCode(),
    targetPlayer: playerFactory.createPlayerCode(),
    targetPosition: positionFactory.createPosition()
  };
}

export default {
  createActionSource,
  createActionTarget
}
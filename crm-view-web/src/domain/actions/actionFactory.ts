import Game from '@/domain/models/Game';
import Action from '@/domain/actions/Action';
import ActionSource from '@/domain/actions/ActionTarget';
import ActionTarget from '@/domain/actions/ActionSource';
import actionResolver from '@/domain/actions/actionResolver';

function createAction(
  game: Game,
  source: ActionSource,
  target: ActionTarget
): Action {
  return {
    game: game.code,
    type: actionResolver.resolveType(
      source.sourceTrigger,
      target.targetTrigger
    ),
    sourcePosition: source.sourcePosition,
    sourcePlayer: source.sourcePlayer,
    sourceCard: source.sourceCard,
    targetPosition: target.targetPosition,
    targetPlayer: target.targetPlayer,
    targetCard: target.targetCard
  };
}

export {createAction};

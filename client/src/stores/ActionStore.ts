import { ref, watch } from 'vue';
import { defineStore } from 'pinia'
import ActionSource from '@/domain/actions/ActionSource';
import ActionTarget from '@/domain/actions/ActionTarget';
import Game from '@/domain/models/Game';
import { resolveActionType } from '@/domain/actions/ActionType';
import { sendAction } from '@api/v1';
import * as Requests from "@api/requests";
import useGameStore from '@/stores/GameStore';
import Player from '@/domain/models/Player';
import ActionTargetBuilder from '@/domain/actions/ActionTargetBuilder';
import ActionSourceBuilder from '@/domain/actions/ActionSourceBuilder';

const useActionStore = defineStore('action', initialize);

function initialize() {
  const gameStore = useGameStore();
  const actionInProgress = ref<boolean>(false);
  const currentActionSource = ref<ActionSource | null>(null);
  const currentActionTarget = ref<ActionTarget | null>(null);

  const cancelAction = () => {
    currentActionSource.value = null;
    currentActionTarget.value = null;
  }

  const startAction = (player = gameStore.playerInfo as Player) => {
    return new ActionSourceBuilder(
      (source: ActionSource) => {
        currentActionSource.value = source;
        console.log(`Player action [01/02] complete: source${JSON.stringify(source)}`);
      },
      cancelAction,
      player
    );
  }

  const endAction = () => {
    return new ActionTargetBuilder(
      (target: ActionTarget) => {
        currentActionTarget.value = target;
        console.log(`Player action [02/02] complete: target${JSON.stringify(target)}`);
      },
      cancelAction
    );
  }

  const executePassTurnAction = async () => {
    const game = (gameStore.currentGame as Game);
    const player = (gameStore.playerInfo as Player);

    await performAction({
      game: game.code,
      type: 'PASS_TURN',
      sourcePlayer: player.code
    });
  }

  const executeAction = async (source: ActionSource | null, target: ActionTarget | null) => {
    if (source && target) {
      const game = gameStore.currentGame;
      if (!game) throw new Error("A game is required to do an Action");

      await performAction(mapToRequest(game as Game, source, target));
    }
  }

  async function performAction(request: Requests.ActionRequest) {
    try {
      actionInProgress.value = true;
      await sendAction(request);
    } catch (e) {
      console.error(e);
    } finally {
      currentActionSource.value = null;
      currentActionTarget.value = null;
      actionInProgress.value = false;
    }
  }

  watch([currentActionSource, currentActionTarget], async ([source, target]) =>  executeAction(source, target));

  return {
    actionInProgress,
    currentActionSource,
    currentActionTarget,
    startAction,
    endAction,
    cancelAction,
    executeAction,
    executePassTurnAction
  };
}

function mapToRequest(game: Game, source: ActionSource, target: ActionTarget) {
  return {
    game: game.code,
    type: resolveActionType(source.sourceTrigger, target.targetTrigger),
    sourcePlayer: source.sourcePlayer,
    sourceCard: source.sourceCard,
    sourcePosition: (typeof source.sourcePosition == 'number') ? undefined : source.sourcePosition,
    targetPlayer: target.targetPlayer,
    targetCard: target.targetCard,
    targetPosition: (typeof target.targetPosition == 'number') ? undefined : target.targetPosition
  }
}

export default useActionStore;
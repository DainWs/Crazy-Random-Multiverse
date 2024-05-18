import Game from '@/domain/models/Game';
import GameCode from '@/domain/models/GameCode';
import { CardCode } from '@/domain/models/Card';
import { PlayerCode } from '@/domain/models/Player';
import Position from '@/domain/models/Position';
import ActionType, { resolveActionType } from '@/domain/actions/ActionType';
import ActionSource from '@/domain/actions/ActionTarget';
import ActionTarget from '@/domain/actions/ActionSource';

class Action {
  public game: GameCode;
  public type: ActionType;
  public sourcePlayer: PlayerCode;
  public sourceCard: CardCode;
  public sourcePosition: Position;
  public targetPlayer: PlayerCode;
  public targetCard: CardCode;
  public targetPosition: Position;

  public constructor(game: Game, source: ActionSource, target: ActionTarget) {
    this.game = game.code;
    this.type = resolveActionType(source.sourceTrigger, target.targetTrigger);
    this.sourcePosition = source.sourcePosition;
    this.sourcePlayer = source.sourcePlayer;
    this.sourceCard = source.sourceCard;
    this.targetPosition = target.targetPosition;
    this.targetPlayer = target.targetPlayer;
    this.targetCard = target.targetCard;
  }

  public isType(type: ActionType): boolean {
    return this.type === type;
  }
}

export default Action;

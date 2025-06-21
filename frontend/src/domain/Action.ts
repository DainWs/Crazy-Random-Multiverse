import GameCode from '@/domain/GameCode';
import Card from '@/domain/Card';
import Player from '@/domain/Player';
import Position from '@/domain/Position';
import ActionEvent from '@/domain/ActionEvent';

type NoneCard = null;

class Action {
  public game: GameCode;
  public sourcePlayer: Player;
  public sourceCard: Card | NoneCard;
  public sourcePosition: Position;
  public targetPlayer: Player;
  public targetCard?: Card | NoneCard;
  public targetPosition: Position;

  public constructor(gameCode: GameCode, source: ActionEvent, target: ActionEvent) {
    this.game = gameCode;
    this.sourcePosition = source.position;
    this.sourcePlayer = source.player;
    this.sourceCard = source.card;
    this.targetPosition = target.position;
    this.targetPlayer = target.player;
    this.targetCard = target.card;
  }
}

export default Action;

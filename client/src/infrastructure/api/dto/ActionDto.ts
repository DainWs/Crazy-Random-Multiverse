import GameCodeDto from '@api/dto/GameCodeDto';
import ActionTypeDto from '@api/dto/ActionTypeDto';
import PlayerCodeDto from '@api/dto/PlayerCodeDto';
import CardCodeDto from '@api/dto/CardCodeDto';
import PositionDto from '@api/dto/PositionDto';

class ActionDto {
  public game: GameCodeDto;
  public type: ActionTypeDto;
  public sourcePlayer?: PlayerCodeDto;
  public sourceCard?: CardCodeDto;
  public sourcePosition?: PositionDto;
  public targetPlayer?: PlayerCodeDto;
  public targetCard?: CardCodeDto;
  public targetPosition?: PositionDto;

  public constructor(game: GameCodeDto, type: ActionTypeDto) {
    this.game = game;
    this.type = type;
  }
}

export default ActionDto;

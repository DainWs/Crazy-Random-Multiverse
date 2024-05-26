import CardDto from '@/infrastructure/stomp/dto/CardDto';
import GameDto from '@/infrastructure/stomp/dto/GameDto';
import PlayerDto from '@/infrastructure/stomp/dto/PlayerDto';
import PositionDto from '@/infrastructure/stomp/dto/PositionDto';

type GameEventCodeDto =
  | 'GAME_CREATED'
  | 'GAME_START'
  | 'GAME_END_WITH_WINNER'
  | 'GAME_END_WITH_TIE'
  | 'TURN_CHANGE'
  | 'ROUND_CHANGE'
  | 'PLAYER_DIE'
  | 'PLAYER_RECEIVE_CARD'
  | 'PLAYER_PUT_CARD'
  | 'PLAYER_MOVE_CARD'
  | 'PLAYER_ATTACK_CARD'
  | 'PLAYER_EQUIP_CARD'
  | 'PLAYER_USE_SPELL'
  | 'PLAYER_PASS_TURN';

type GameEventDto = {
  code: GameEventCodeDto;
  details: {
    game: GameDto;
    sourcePlayer?: PlayerDto;
    sourceCard?: CardDto;
    sourcePosition?: PositionDto;
    targetPlayer?: PlayerDto;
    targetCard?: CardDto;
    targetPosition?: PositionDto;
  };
};

export default GameEventDto;

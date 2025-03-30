import Card from '@/domain/models/Card';
import Game from '@/domain/models/Game';
import Player from '@/domain/models/Player';
import Position from '@/domain/models/Position';

type EventCode = 
  'GAME_RESTART' |
  'GAME_CREATED' |
  'GAME_LOADING' |
  'GAME_START' |
  'GAME_END' |
  'GAME_END_WITH_WINNER' |
  'GAME_END_WITH_TIE' |
  'TURN_CHANGE' |
  'ROUND_CHANGE' |
  'PLAYER_DIE' |
  'PLAYER_SURRENDER' |
  'PLAYER_RECEIVE_CARD' |
  'PLAYER_PUT_CARD' |
  'PLAYER_MOVE_CARD' |
  'PLAYER_ATTACK_CARD' |
  'PLAYER_EQUIP_CARD' |
  'PLAYER_USE_CARD' |
  'PLAYER_PASS_TURN';

type EventDetails = {
  game: Game;
  sourcePlayer?: Player;
  sourceCard?: Card;
  sourcePosition?: Position;
  targetPlayer?: Player;
  targetCard?: Card;
  targetPosition?: Position;
};

class Event {
  public readonly code: EventCode;
  public readonly details: EventDetails;

  public constructor(code: EventCode, details: EventDetails) {
    this.code = code;
    this.details = details;
  }
}

export { EventCode, EventDetails };
export default Event;

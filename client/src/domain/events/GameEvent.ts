import Event from '@/domain/events/Event';
import Card from '@/domain/models/Card';
import Game from '@/domain/models/Game';
import Player from '@/domain/models/Player';
import Position from '@/domain/models/Position';

type GameEventCode =
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

type GameEventDetails = {
  game: Game;
  sourcePlayer?: Player;
  sourceCard?: Card;
  sourcePosition?: Position;
  targetPlayer?: Player;
  targetCard?: Card;
  targetPosition?: Position;
};

class GameEvent extends Event<GameEventDetails> {
  public constructor(code: GameEventCode, details: GameEventDetails) {
    super(code, details);
  }

  public getCode(): GameEventCode {
    return  (super.getCode() as GameEventCode);
  }
}

export { GameEventCode, GameEventDetails };
export default GameEvent;

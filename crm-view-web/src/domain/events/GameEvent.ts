import Card from "@/domain/models/Card";
import Game from "@/domain/models/Game";
import Player from "@/domain/models/Player";
import Position from "@/domain/models/Position";

type GameEventCode = 'GAME_CREATED' | 'GAME_START' | 'GAME_END' | 'PLAYER_WIN' | 'PLAYER_LOSE' |
    'PLAYER_SURRENDER' | 'PLAYER_GET_TURN' | 'PLAYER_GET_CARD' | 'PLAYER_PUT_CARD' | 'PLAYER_MOVE_CARD' |
    'PLAYER_ATTACK_CARD' | 'PLAYER_EQUIP_CARD' | 'PLAYER_USE_SPELL' | 'PLAYER_PASS_TURN';

type GameEventDetails = {
    game: Game;
    sourcePlayer?: Player;
    sourceCard?: Card;
    sourcePosition?: Position;
    targetPlayer?: Player;
    targetCard?: Card;
    targetPosition?: Position;
};

class GameEvent {
    public code: GameEventCode;
    public details: GameEventDetails;

    public constructor(code: GameEventCode, details: GameEventDetails) {
        this.code = code;
        this.details = details;
    }
};

export { GameEventCode, GameEventDetails };
export default GameEvent;

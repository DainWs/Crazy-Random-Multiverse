import GameCode from '@/domain/models/GameCode';
import { CardCode } from '@/domain/models/Card';
import { PlayerCode } from '@/domain/models/Player';
import Position from '@/domain/models/Position';
import ActionType from '@/domain/actions/ActionType';

type Action = {
    game: GameCode,
    type: ActionType,
    sourcePlayer: PlayerCode,
    sourceCard: CardCode,
    sourcePosition: Position,
    targetPlayer: PlayerCode,
    targetCard: CardCode,
    targetPosition: Position
};

export default Action;
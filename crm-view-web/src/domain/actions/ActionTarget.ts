import {CardCode} from '@/domain/models/Card';
import {PlayerCode} from '@/domain/models/Player';
import Position from '@/domain/models/Position';
import ActionTrigger from '@/domain/actions/ActionTrigger';

type ActionSource = {
  sourceTrigger: ActionTrigger;
  sourcePlayer: PlayerCode;
  sourceCard: CardCode;
  sourcePosition: Position;
};

export default ActionSource;

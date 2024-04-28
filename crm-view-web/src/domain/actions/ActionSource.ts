import { CardCode } from "@/domain/models/Card";
import { PlayerCode } from "@/domain/models/Player";
import Position from "@/domain/models/Position";
import ActionTrigger from "@/domain/actions/ActionTrigger";

type ActionTarget = {
    targetTrigger: ActionTrigger,
    targetPlayer: PlayerCode,
    targetCard: CardCode,
    targetPosition: Position,
};

export default ActionTarget;
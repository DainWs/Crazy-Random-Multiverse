import { GameCode } from '@/domain/game';
import { CardCode } from '@/domain/card';
import { PlayerCode } from '@/domain/player';
import { Position } from '@/domain/position';

export type ViewElement = "Hand" | "ZoneSlot" | "ZoneSlot.Card";
export type ViewAction = "Grab" | "Drop" | "Click";

export type ActionTrigger = {
    element: ViewElement,
    action: ViewAction
};

export type ActionType = "PUT_CARD" | "MOVE_CARD" | "ATTACK_CARD";

export type Action = {
    game: GameCode,
    type: ActionType,
    sourcePlayer: PlayerCode,
    sourceCard: CardCode,
    sourcePosition: Position,
    targetPlayer: PlayerCode,
    targetCard: CardCode,
    targetPosition: Position
};

export type ActionSource = {
    sourceTrigger: ActionTrigger,
    sourcePlayer: PlayerCode,
    sourceCard: CardCode,
    sourcePosition: Position,
};

export type ActionTarget = {
    targetTrigger: ActionTrigger,
    targetPlayer: PlayerCode,
    targetCard: CardCode,
    targetPosition: Position,
};

export type ActionParts = {
    source: ActionSource,
    target: ActionTarget
}

export declare function createAction(game: Game, actionSource: ActionSource, actionTarget: ActionTarget) : Action; 
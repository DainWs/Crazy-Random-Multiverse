import { ActionTrigger, ActionType } from '@/domain/game/action';

export declare function resolveType(sourceTrigger: ActionTrigger, targetTrigger: ActionTrigger): ActionType;
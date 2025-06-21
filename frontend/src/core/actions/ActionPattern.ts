import ActionTrigger from "@/domain/ActionTrigger";

interface ActionPattern {
  matchSourceCondition(trigger: ActionTrigger): boolean;
  matchTargetCondition(trigger: ActionTrigger): boolean;
}

export default ActionPattern;
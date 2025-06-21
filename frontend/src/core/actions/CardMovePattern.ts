import ActionPattern from "@/core/actions/ActionPattern";
import ActionTrigger from "@/domain/ActionTrigger";

class CardMovePattern implements ActionPattern {

  public matchSourceCondition(trigger: ActionTrigger): boolean {
    return trigger.input == 'Grab' && trigger.element == 'ZoneSlot.Card'
  }

  public matchTargetCondition(trigger: ActionTrigger): boolean {
    return trigger.input == 'Drop' && trigger.element == 'ZoneSlot'
  }

}

export default CardMovePattern;
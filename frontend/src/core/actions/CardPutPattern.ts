import ActionPattern from "@/core/actions/ActionPattern";
import ActionTrigger from "@/domain/ActionTrigger";

class CardPutPattern implements ActionPattern {

  public matchSourceCondition(trigger: ActionTrigger): boolean {
    return trigger.input == 'Grab' && trigger.element == 'Hand.Card'
  }

  public matchTargetCondition(trigger: ActionTrigger): boolean {
    return trigger.input == 'Drop' && trigger.element == 'ZoneSlot'
  }

}

export default CardPutPattern;
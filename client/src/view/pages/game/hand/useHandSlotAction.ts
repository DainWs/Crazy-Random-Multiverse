import ViewAction from "@/domain/actions/ViewAction";
import ViewElement from "@/domain/actions/ViewElements";
import Position, { HandPosition } from "@/domain/models/Position";
import Card from "@/domain/models/Card";
import Hand from "@/domain/models/Hand";
import * as actionService from '@/application/actionService';
import grabAndDropApi from "@/services/dom/GrabAndDropController";

const useHandSlotAction = (hand: Hand) => {
  const elementType: ViewElement = "Hand";

  function grabCard(event: DragEvent, index: number, card: Card) {
    const actionType: ViewAction = "Grab";
    const position: HandPosition = index;

    actionService.startAction(hand.owner)
      .whereTriggerIs(elementType, actionType)
      .withCard(card)
      .fromPosition(position)
      .completeActionSource();

    grabAndDropApi.grab(event.currentTarget as HTMLElement);
    grabAndDropApi.moveElementToStartingPosition(event.clientX, event.clientY);
  }

  function dropCard(event: MouseEvent, position: Position, card: Card) {
    const actionType: ViewAction = "Grab";

    actionService.endAction()
      .whereTriggerIs(elementType, actionType)
      .toPlayer(hand.owner)
      .toCard(card)
      .atPosition(position)
      .completeActionTarget();
  }

  return {
    grabCard,
    dropCard
  };
}

export { useHandSlotAction };
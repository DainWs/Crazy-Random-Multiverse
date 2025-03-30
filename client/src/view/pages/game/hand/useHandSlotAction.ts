import ViewAction from "@/domain/actions/ViewAction";
import ViewElement from "@/domain/actions/ViewElements";
import Position, { HandPosition } from "@/domain/models/Position";
import Card from "@/domain/models/Card";
import Hand from "@/domain/models/Hand";
import * as actionService from '@/application/actionService';
import grabAndDropApi from "@/services/dom/GrabAndDropController";

const useHandSlotAction = (hand: Hand | null) => {
  const elementType: ViewElement = "Hand";

  function grabCard(event: DragEvent, index: number, card: Card) {
    if (!hand) throw new Error("You cant grab a card from a null hand");

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
    if (!hand) throw new Error("You cant drop a card on a null hand");
  
    const actionType: ViewAction = "Drop";

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
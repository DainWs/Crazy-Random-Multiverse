import ViewAction from "@/domain/actions/ViewAction";
import ViewElement from "@/domain/actions/ViewElements";
import Position from "@/domain/models/Position";
import Card from "@/domain/models/Card";
import Zone from "@/domain/models/Zone";
import * as actionService from '@/application/actionService';
import grabAndDropApi from "@view/pages/game/hooks/GrabAndDropApi";

const useZoneSlotAction = (zone: Zone) => {
  const elementType: ViewElement = "ZoneSlot";

  function grabCard(event: DragEvent, row: number, column: number, card: Card) {
    const actionType: ViewAction = "Grab";
    const slot: Position = { row, column };

    actionService.startAction(zone.owner)
      .whereTriggerIs(elementType, actionType)
      .withCard(card)
      .fromPosition(slot)
      .completeActionSource();

    grabAndDropApi.grab(event.currentTarget as HTMLElement);
    grabAndDropApi.moveElementToStartingPosition(event.clientX, event.clientY);
  }

  function dropCard(event: MouseEvent, row: number, column: number, card: Card) {
    const actionType: ViewAction = "Grab";
    const slot: Position = { row, column };

    actionService.endAction()
      .whereTriggerIs(elementType, actionType)
      .toPlayer(zone.owner)
      .toCard(card)
      .atPosition(slot)
      .completeActionTarget();
  }

  return {
    grabCard,
    dropCard
  };
}

export { useZoneSlotAction };
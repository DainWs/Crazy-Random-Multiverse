import ViewAction from "@/domain/actions/ViewAction";
import ViewElement from "@/domain/actions/ViewElements";
import Card from "@/domain/models/Card";
import Zone from "@/domain/models/Zone";
import * as actionService from '@/application/actionService';
import Position from "@/domain/models/Position";
import { useAction } from "@vue-pages/game/actions/useAction";
import { useCardDrag } from "@vue-pages/game/actions/useCardDrag";

const useZoneSlotAction = (zone: Zone) => {
  const elementType: ViewElement = "ZoneSlot";


  const parent = useCardDrag();

  function grabCard(event: DragEvent, row: number, column: number, card: Card) {
    const actionType: ViewAction = "Grab";
    const slot: Position = { row, column };

    actionService.startAction(zone.owner)
      .whereTriggerIs(elementType, actionType)
      .withCard(card)
      .fromPosition(slot)
      .completeActionSource();

    parent.startDrag(event);
  }

  function dropCard(event: MouseEvent, row: number, column: number, card: Card) {
    const actionType: ViewAction = "Grab";
    const slot: Position = { row, column };

    /*
    actionService.endAction()
      .whereTriggerIs(elementType, actionType)
      .toPlayer(zone.owner)
      .toCard(card)
      .atPosition(slot)
      .completeActionTarget();
*/
    parent.onDrop(event);
  }

  return {
    grabCard,
    dropCard
  };
}

export { useZoneSlotAction };
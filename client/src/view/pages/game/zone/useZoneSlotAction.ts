import ViewAction from "@/domain/actions/ViewAction";
import ViewElement from "@/domain/actions/ViewElements";
import Position from "@/domain/models/Position";
import Card from "@/domain/models/Card";
import Zone from "@/domain/models/Zone";
import grabAndDropController from "@/services/dom/GrabAndDropController";
import mouseTrailController from "@/services/dom/MouseTrailController";
import VisualEffects from "@/services/dom/VisualEffects";
import useActionStore from "@/stores/ActionStore";

const useZoneSlotAction = (zone: Zone) => {
  const actionStore = useActionStore();

  const elementType: ViewElement = "ZoneSlot";

  function clickCard(event: MouseEvent, row: number, column: number, card: Card) {
    const actionType: ViewAction = "SimpleClick";
    const slot: Position = { row, column };

    if (actionStore.actionInProgress) {
      actionStore.endAction()
        .whereTriggerIs(elementType, actionType)
        .toPlayer(zone.owner)
        .toCard(card)
        .atPosition(slot)
        .completeActionTarget();
    } else {
      actionStore.startAction(zone.owner)
        .whereTriggerIs(elementType, actionType)
        .withCard(card)
        .fromPosition(slot)
        .completeActionSource();
    }

    const element = event.currentTarget as HTMLElement;
    mouseTrailController.addElement(element, VisualEffects.trailAttack);
  }

  function grabCard(event: DragEvent, row: number, column: number, card: Card) {
    const actionType: ViewAction = "Grab";
    const slot: Position = { row, column };

    actionStore.startAction(zone.owner)
      .whereTriggerIs(elementType, actionType)
      .withCard(card)
      .fromPosition(slot)
      .completeActionSource();

    grabAndDropController.grab(event.currentTarget as HTMLElement);
    grabAndDropController.moveElementToStartingPosition(event.clientX, event.clientY);
  }

  function dropCard(event: MouseEvent, row: number, column: number, card: Card) {
    const actionType: ViewAction = "Drop";
    const slot: Position = { row, column };

    actionStore.endAction()
      .whereTriggerIs(elementType, actionType)
      .toPlayer(zone.owner)
      .toCard(card)
      .atPosition(slot)
      .completeActionTarget();
  }

  return {
    clickCard,
    grabCard,
    dropCard
  };
}

export { useZoneSlotAction };
import type { GameCode } from "@/domain/GameConfiguration";
import { gameApi } from "@/api";
import { ApiException } from "@/api/models/ApiException";
import StoreSystem from "@/core/StoreSystem";
import Action from "@/domain/Action";
import ActionEvent from "@/domain/ActionEvent";
import CombatantView from "@/game/cards/CombatantView";
import EquipmentView from "@/game/cards/EquipmentView";
import HandView from "@/game/hand/HandView";
import ZoneSlotView from "@/game/zone/ZoneSlotView";

const UNEXPECTED_ERROR_KEY = "exception.unexpected";

class CardController {
  private actionPending = false;
  private readonly onRejected: (key: string) => void;

  /** `onRejected` receives the key of the error when the server rejects an action (UI-6). */
  public constructor(onRejected: (key: string) => void) {
    this.onRejected = onRejected;
  }

  public isActionPending(): boolean {
    return this.actionPending;
  }

  /** The card stays in the slot as a preview until the server answers; the state changes with the events (ARCH-2, CON-19). */
  public putCardOnZoneSlot(cardView: CombatantView, handView: HandView, zoneSlotView: ZoneSlotView) {
    if (this.actionPending || !zoneSlotView.canReceive(cardView.card)) {
      return false;
    }

    zoneSlotView.holdCard(cardView);
    void this.sendPut(cardView, handView, zoneSlotView);
    return true;
  }

  private async sendPut(cardView: CombatantView, handView: HandView, zoneSlotView: ZoneSlotView) {
    this.actionPending = true;
    try {
      const rowCount = StoreSystem.getPlayerZone().slots.length;
      await gameApi.sendPlayerAction("PUT_ACTION", this.createPutAction(cardView, zoneSlotView), rowCount);
    } catch (error) {
      this.returnCardToHand(cardView, handView, zoneSlotView);
      this.onRejected(error instanceof ApiException ? error.key : UNEXPECTED_ERROR_KEY);
    } finally {
      this.actionPending = false;
    }
  }

  private createPutAction(cardView: CombatantView, zoneSlotView: ZoneSlotView): Action {
    const gameCode: GameCode = StoreSystem.getGameConfiguration().gameCode;
    const player = StoreSystem.getPlayer();
    const source = new ActionEvent({ element: "Hand.Card", input: "Grab", position: null, player, card: cardView.card });
    const target = new ActionEvent({ element: "ZoneSlot", input: "Drop", position: zoneSlotView.zoneSlot.position, player, card: null });
    return new Action(gameCode, source, target);
  }

  private returnCardToHand(cardView: CombatantView, handView: HandView, zoneSlotView: ZoneSlotView) {
    zoneSlotView.releaseCard();
    handView.addAt(cardView, handView.getCards().indexOf(cardView));
    cardView.reset();
  }

  public moveCardOnZoneSlot(combatantView: CombatantView, fromZoneSlot: ZoneSlotView, toZoneSlot: ZoneSlotView) {
    if (fromZoneSlot.getCombatant() === null) {
      console.warn("Source zone slot does not have a card.");
      return false;
    }

    if (fromZoneSlot.getCombatant() !== combatantView) {
      console.warn("Source zone slot does not have the card to move.");
      return false;
    }

    if (toZoneSlot.getCombatant() !== null) {
      console.warn("Target zone slot already has a card, cannot place another one.");
      return false;
    }

    if (!toZoneSlot.zoneSlot.canPlaceCard(combatantView.combatant)) {
      console.warn("Target zone slot does not allow this type of card.");
      return false;
    }

    fromZoneSlot.removeCard();
    toZoneSlot.setCard(combatantView);
    // TODO propagar evento al backend
    return true;
  }

  public equipCardToCombatant(equipmentView: EquipmentView, combatantView: CombatantView, sourceHandView: HandView, targetSlotView: ZoneSlotView) {
    if (targetSlotView.getCard() === null) {
      console.warn("Target zone slot does not have a card.");
      return false;
    }

    if (combatantView.combatant.isType('EQUIPMENT')) {
      console.warn("Target card is an equipment card, cannot equip another equipment card to it.");
      return false;
    }

    sourceHandView.removeCard(equipmentView);
    combatantView.stack(equipmentView);

    combatantView.combatant.equipment = equipmentView.equipment;
    // TODO propagar evento al backend
    return true;
  }
}

export default CardController;
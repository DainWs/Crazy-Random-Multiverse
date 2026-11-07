import type { GameCode } from "@/domain/GameConfiguration";
import { gameApi } from "@/api";
import { ApiException } from "@/api/models/ApiException";
import StoreSystem from "@/core/StoreSystem";
import type { ActionType } from "@/domain/Action";
import Action from "@/domain/Action";
import ActionEvent from "@/domain/ActionEvent";
import CombatantView from "@/game/cards/CombatantView";
import EquipmentView from "@/game/cards/EquipmentView";
import HandView from "@/game/hand/HandView";
import ZoneSlotView from "@/game/zone/ZoneSlotView";

const UNEXPECTED_ERROR_KEY = "exception.unexpected";

type UndoPreviewCallback = () => void;

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
    const action = this.createPutAction(cardView, zoneSlotView);
    const undoPreview = () => this.returnCardToHand(cardView, handView, zoneSlotView);
    void this.send("PUT_ACTION", action, undoPreview);
    return true;
  }

  /** Sends the action and undoes its preview if the server rejects it. */
  private async send(type: ActionType, action: Action, undoPreview: UndoPreviewCallback = () => {}) {
    this.actionPending = true;
    try {
      const playerZone = StoreSystem.getPlayerZone();
      const rowCount = playerZone.slots.length;
      await gameApi.sendPlayerAction(type, action, rowCount);
    } catch (error) {
      undoPreview();
      const key = error instanceof ApiException ? error.key : UNEXPECTED_ERROR_KEY;
      this.onRejected(key);
    } finally {
      this.actionPending = false;
    }
  }

  private createPutAction(cardView: CombatantView, zoneSlotView: ZoneSlotView): Action {
    const gameCode: GameCode = StoreSystem.getGameConfiguration().gameCode;
    const player = StoreSystem.getPlayer();
    const targetPosition = zoneSlotView.zoneSlot.position;
    const source = new ActionEvent({ element: "Hand.Card", input: "Grab", position: null, player, card: cardView.card });
    const target = new ActionEvent({ element: "ZoneSlot", input: "Drop", position: targetPosition, player, card: null });
    return new Action(gameCode, source, target);
  }

  private returnCardToHand(cardView: CombatantView, handView: HandView, zoneSlotView: ZoneSlotView) {
    zoneSlotView.releaseCard();
    const handCards = handView.getCards();
    const handIndex = handCards.indexOf(cardView);
    handView.addAt(cardView, handIndex);
    cardView.reset();
  }

  /** The cards show their new places as a preview until the server answers; the state changes with the events (ARCH-2, CON-19). */
  public moveCardOnZoneSlot(combatantView: CombatantView, fromZoneSlot: ZoneSlotView, toZoneSlot: ZoneSlotView) {
    if (this.actionPending || !this.isMovable(combatantView, fromZoneSlot, toZoneSlot)) {
      return false;
    }

    const undoPreview = this.previewMove(combatantView, fromZoneSlot, toZoneSlot);
    const action = this.createMoveAction(fromZoneSlot, toZoneSlot);
    void this.send("MOVE_ACTION", action, undoPreview);
    return true;
  }

  private isMovable(combatantView: CombatantView, fromZoneSlot: ZoneSlotView, toZoneSlot: ZoneSlotView): boolean {
    return fromZoneSlot.getCombatant() === combatantView && toZoneSlot.canReceiveFrom(fromZoneSlot);
  }

  /** Shows the moved card in the target slot and the card that was there, if any, in the source slot. Returns the function that undoes it. */
  private previewMove(combatantView: CombatantView, fromZoneSlot: ZoneSlotView, toZoneSlot: ZoneSlotView): UndoPreviewCallback {
    fromZoneSlot.releaseCard();
    const swappedView = toZoneSlot.releaseCard();
    toZoneSlot.holdCard(combatantView);
    if (swappedView) {
      fromZoneSlot.holdCard(swappedView);
    }

    return () => {
      fromZoneSlot.releaseCard();
      toZoneSlot.releaseCard();
      fromZoneSlot.holdCard(combatantView);
      if (swappedView) {
        toZoneSlot.holdCard(swappedView);
      }
    };
  }

  private createMoveAction(fromZoneSlot: ZoneSlotView, toZoneSlot: ZoneSlotView): Action {
    const gameCode: GameCode = StoreSystem.getGameConfiguration().gameCode;
    const player = StoreSystem.getPlayer();
    const sourcePosition = fromZoneSlot.zoneSlot.position;
    const targetPosition = toZoneSlot.zoneSlot.position;
    const source = new ActionEvent({ element: "ZoneSlot.Card", input: "Grab", position: sourcePosition, player, card: null });
    const target = new ActionEvent({ element: "ZoneSlot", input: "Drop", position: targetPosition, player, card: null });
    return new Action(gameCode, source, target);
  }

  /** Nothing changes on screen until the server answers; the state changes with the events (ARCH-2, CON-19). */
  public attackCardOnZoneSlot(fromZoneSlot: ZoneSlotView, toZoneSlot: ZoneSlotView) {
    if (this.actionPending || !fromZoneSlot.canAttack(toZoneSlot)) {
      return false;
    }

    const action = this.createAttackAction(fromZoneSlot, toZoneSlot);
    void this.send("ATTACK_ACTION", action);
    return true;
  }

  private createAttackAction(fromZoneSlot: ZoneSlotView, toZoneSlot: ZoneSlotView): Action {
    const gameCode: GameCode = StoreSystem.getGameConfiguration().gameCode;
    const player = StoreSystem.getPlayer();
    const sourcePosition = fromZoneSlot.zoneSlot.position;
    const targetPosition = toZoneSlot.zoneSlot.position;
    const source = new ActionEvent({ element: "ZoneSlot.Card", input: "Grab", position: sourcePosition, player, card: null });
    const target = new ActionEvent({ element: "ZoneSlot", input: "Drop", position: targetPosition, player: toZoneSlot.zone.owner, card: null });
    return new Action(gameCode, source, target);
  }

  /** The equipment disappears from the screen until the server answers; the state changes with the events (ARCH-2, CON-19). */
  public equipCardOnZoneSlot(equipmentView: EquipmentView, handView: HandView, zoneSlotView: ZoneSlotView) {
    if (this.actionPending || !zoneSlotView.canReceive(equipmentView.card)) {
      return false;
    }

    equipmentView.setVisible(false);
    const action = this.createEquipAction(equipmentView, zoneSlotView);
    const undoPreview = () => this.showEquipmentInHand(equipmentView, handView);
    void this.send("EQUIP_ACTION", action, undoPreview);
    return true;
  }

  private createEquipAction(equipmentView: EquipmentView, zoneSlotView: ZoneSlotView): Action {
    const gameCode: GameCode = StoreSystem.getGameConfiguration().gameCode;
    const player = StoreSystem.getPlayer();
    const targetPosition = zoneSlotView.zoneSlot.position;
    const source = new ActionEvent({ element: "Hand.Card", input: "Grab", position: null, player, card: equipmentView.card });
    const target = new ActionEvent({ element: "ZoneSlot", input: "Drop", position: targetPosition, player, card: null });
    return new Action(gameCode, source, target);
  }

  private showEquipmentInHand(equipmentView: EquipmentView, handView: HandView) {
    equipmentView.setVisible(true);
    const handCards = handView.getCards();
    const handIndex = handCards.indexOf(equipmentView);
    handView.addAt(equipmentView, handIndex);
    equipmentView.reset();
  }
}

export default CardController;
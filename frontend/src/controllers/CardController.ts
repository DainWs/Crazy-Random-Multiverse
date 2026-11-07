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
    void this.send("PUT_ACTION", this.createPutAction(cardView, zoneSlotView), () => this.returnCardToHand(cardView, handView, zoneSlotView));
    return true;
  }

  /** Sends the action and undoes its preview if the server rejects it. */
  private async send(type: ActionType, action: Action, undoPreview: () => void) {
    this.actionPending = true;
    try {
      const rowCount = StoreSystem.getPlayerZone().slots.length;
      await gameApi.sendPlayerAction(type, action, rowCount);
    } catch (error) {
      undoPreview();
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

  /** The cards show their new places as a preview until the server answers; the state changes with the events (ARCH-2, CON-19). */
  public moveCardOnZoneSlot(combatantView: CombatantView, fromZoneSlot: ZoneSlotView, toZoneSlot: ZoneSlotView) {
    if (this.actionPending || !this.isMovable(combatantView, fromZoneSlot, toZoneSlot)) {
      return false;
    }

    const swappedView = this.previewMove(combatantView, fromZoneSlot, toZoneSlot);
    void this.send("MOVE_ACTION", this.createMoveAction(fromZoneSlot, toZoneSlot), () => this.undoMovePreview(combatantView, swappedView, fromZoneSlot, toZoneSlot));
    return true;
  }

  private isMovable(combatantView: CombatantView, fromZoneSlot: ZoneSlotView, toZoneSlot: ZoneSlotView): boolean {
    return fromZoneSlot.getCombatant() === combatantView && toZoneSlot.canReceiveFrom(fromZoneSlot);
  }

  /** Returns the card that was in the target slot, which takes the place of the moved one. */
  private previewMove(combatantView: CombatantView, fromZoneSlot: ZoneSlotView, toZoneSlot: ZoneSlotView): CombatantView | null {
    fromZoneSlot.releaseCard();
    const swappedView = toZoneSlot.releaseCard();
    toZoneSlot.holdCard(combatantView);
    if (swappedView) {
      fromZoneSlot.holdCard(swappedView);
    }

    return swappedView;
  }

  private undoMovePreview(combatantView: CombatantView, swappedView: CombatantView | null, fromZoneSlot: ZoneSlotView, toZoneSlot: ZoneSlotView) {
    fromZoneSlot.releaseCard();
    toZoneSlot.releaseCard();
    fromZoneSlot.holdCard(combatantView);
    if (swappedView) {
      toZoneSlot.holdCard(swappedView);
    }
  }

  private createMoveAction(fromZoneSlot: ZoneSlotView, toZoneSlot: ZoneSlotView): Action {
    const gameCode: GameCode = StoreSystem.getGameConfiguration().gameCode;
    const player = StoreSystem.getPlayer();
    const source = new ActionEvent({ element: "ZoneSlot.Card", input: "Grab", position: fromZoneSlot.zoneSlot.position, player, card: null });
    const target = new ActionEvent({ element: "ZoneSlot", input: "Drop", position: toZoneSlot.zoneSlot.position, player, card: null });
    return new Action(gameCode, source, target);
  }

  /** The equipment disappears from the screen until the server answers; the state changes with the events (ARCH-2, CON-19). */
  public equipCardOnZoneSlot(equipmentView: EquipmentView, handView: HandView, zoneSlotView: ZoneSlotView) {
    if (this.actionPending || !zoneSlotView.canReceive(equipmentView.card)) {
      return false;
    }

    equipmentView.setVisible(false);
    void this.send("EQUIP_ACTION", this.createEquipAction(equipmentView, zoneSlotView), () => this.showEquipmentInHand(equipmentView, handView));
    return true;
  }

  private createEquipAction(equipmentView: EquipmentView, zoneSlotView: ZoneSlotView): Action {
    const gameCode: GameCode = StoreSystem.getGameConfiguration().gameCode;
    const player = StoreSystem.getPlayer();
    const source = new ActionEvent({ element: "Hand.Card", input: "Grab", position: null, player, card: equipmentView.card });
    const target = new ActionEvent({ element: "ZoneSlot", input: "Drop", position: zoneSlotView.zoneSlot.position, player, card: null });
    return new Action(gameCode, source, target);
  }

  private showEquipmentInHand(equipmentView: EquipmentView, handView: HandView) {
    equipmentView.setVisible(true);
    handView.addAt(equipmentView, handView.getCards().indexOf(equipmentView));
    equipmentView.reset();
  }
}

export default CardController;
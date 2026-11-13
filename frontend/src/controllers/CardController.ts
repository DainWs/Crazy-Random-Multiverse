import type { GameCode } from "@/domain/GameConfiguration";
import { gameApi } from "@/api";
import { ApiException } from "@/api/models/ApiException";
import AnimationSystem from "@/core/AnimationSystem";
import StoreSystem from "@/core/StoreSystem";
import type { ActionType } from "@/domain/Action";
import Action from "@/domain/Action";
import ActionEvent from "@/domain/ActionEvent";
import CombatantView from "@/game/cards/CombatantView";
import EquipmentView from "@/game/cards/EquipmentView";
import HandView from "@/game/hand/HandView";
import ZoneSlotView from "@/game/zone/ZoneSlotView";

const UNEXPECTED_ERROR_KEY = "exception.unexpected";
const NOT_YOUR_TURN_KEY = "exception.player-action.allowed_only_on_turn";
const INVALID_SLOT_KEY = "ui.feedback.invalid_slot";
const NO_SLOT_AVAILABLE_KEY = "ui.feedback.no_slot_available";
const INVALID_TARGET_KEY = "ui.feedback.invalid_target";
const CANNOT_MOVE_KEY = "ui.feedback.cannot_move";

type UndoPreviewCallback = () => void;

class CardController {
  private actionPending = false;
  private readonly onRejected: (key: string) => void;

  /** `onRejected` receives the key of the error when the server rejects an action (UI-6) or the drop of a card is refused before sending it (UI-25). */
  public constructor(onRejected: (key: string) => void) {
    this.onRejected = onRejected;
  }

  public isActionPending(): boolean {
    return this.actionPending;
  }

  /** Gameplay is open only on the player's turn, while no action waits for its answer and no animation plays (UI-4, CON-19). */
  public canAct(): boolean {
    return !this.actionPending && !AnimationSystem.isPlaying() && StoreSystem.canPlayerAct();
  }

  public passTurn(): boolean {
    return this.sendCommand("PASS_TURN");
  }

  public surrender(): boolean {
    return this.sendCommand("SURRENDER_ACTION");
  }

  /**
   * Whether a drop is refused before sending anything. Gameplay closed by a pending action or an animation says nothing (UI-4);
   * otherwise the first reason found is reported (UI-25).
   */
  private refuseDrop(invalidReason: () => string | undefined): boolean {
    if (!StoreSystem.canPlayerAct()) {
      this.onRejected(NOT_YOUR_TURN_KEY);
      return true;
    }

    if (!this.canAct()) {
      return true;
    }

    const reason = invalidReason();
    if (reason) {
      this.onRejected(reason);
      return true;
    }

    return false;
  }

  private sendCommand(type: ActionType): boolean {
    if (!this.canAct()) {
      return false;
    }

    void this.send(type, this.createCommandAction());
    return true;
  }

  private createCommandAction(): Action {
    const gameCode: GameCode = StoreSystem.getGameConfiguration().gameCode;
    const player = StoreSystem.getPlayer();
    const event = new ActionEvent({ element: "Button", input: "SimpleClick", position: null, player, card: null });
    return new Action(gameCode, event, event);
  }

  /** The card stays in the slot as a preview until the server answers; the state changes with the events (ARCH-2, CON-19). */
  public putCardOnZoneSlot(cardView: CombatantView, handView: HandView, zoneSlotView: ZoneSlotView) {
    if (this.refuseDrop(() => this.whyCannotPlace(cardView, zoneSlotView))) {
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

  private whyCannotPlace(cardView: CombatantView, zoneSlotView: ZoneSlotView): string | undefined {
    if (zoneSlotView.canReceive(cardView.card)) {
      return undefined;
    }

    return zoneSlotView.zone.hasSlotFor(cardView.card, StoreSystem.getPlayer()) ? INVALID_SLOT_KEY : NO_SLOT_AVAILABLE_KEY;
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
    if (this.refuseDrop(() => this.whyCannotMove(combatantView, fromZoneSlot, toZoneSlot))) {
      return false;
    }

    const undoPreview = this.previewMove(combatantView, fromZoneSlot, toZoneSlot);
    const action = this.createMoveAction(fromZoneSlot, toZoneSlot);
    void this.send("MOVE_ACTION", action, undoPreview);
    return true;
  }

  private whyCannotMove(combatantView: CombatantView, fromZoneSlot: ZoneSlotView, toZoneSlot: ZoneSlotView): string | undefined {
    if (fromZoneSlot.getCombatant() !== combatantView || combatantView.card.isType('LEADER')) {
      return CANNOT_MOVE_KEY;
    }

    return toZoneSlot.canReceiveFrom(fromZoneSlot) ? undefined : INVALID_SLOT_KEY;
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
    if (!this.canAct() || !fromZoneSlot.canAttack(toZoneSlot)) {
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
    if (this.refuseDrop(() => (zoneSlotView.canReceive(equipmentView.card) ? undefined : INVALID_TARGET_KEY))) {
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
package com.dainws.games.crm.domain.core.action;

import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.card.CardCode;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.card.Combatant;
import com.dainws.games.crm.domain.core.card.Equipment;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.exception.PlayerActionExceptionCode;
import com.dainws.games.crm.domain.core.exception.PlayerActionExceptionCode.Code;
import com.dainws.games.crm.domain.core.exception.ZoneExceptionCode;
import com.dainws.games.crm.domain.core.player.Hand;
import com.dainws.games.crm.domain.core.player.Player;

public class EquipAction extends PlayerTurnAction {

	@Override
	protected ActionResult performPlayerAction(ActionContext context) {
		ActionResult checkResult = this.checkContext(context);
		if (!checkResult.isSuccessful()) {
			return checkResult;
		}

		Combatant combatant = this.getTargetCombatantFrom(context);
		Equipment equipment = this.grabEquipmentFromHand(context);
		combatant.equip(equipment);

		this.logTrace("{0} ha sido equipado en el combatiente {1}", equipment, combatant);
		this.notifyActionEvent(EventCode.PLAYER_EQUIP_CARD, context);
		return ActionResult.successful();
	}

	private Combatant getTargetCombatantFrom(ActionContext context) {
		Zone targetZone = context.getTargetZone();
		return targetZone.getCombatant(context.getTargetCoordinate());
	}

	private Equipment grabEquipmentFromHand(ActionContext context) {
		Hand hand = context.getSourcePlayer().getHand();
		CardCode equipmentCode = context.getSourceCard().getCode();

		return (Equipment) hand.grab(equipmentCode);
	}

	private ActionResult checkContext(ActionContext context) {
		Player sourcePlayer = context.getSourcePlayer();
		Hand playerHand = sourcePlayer.getHand();
		Card card = context.getSourceCard();

		if (!playerHand.contains(card)) {
			return ActionResult.failed(new PlayerActionExceptionCode(Code.SELECTED_CARD_NOT_FOUND));
		}

		if (!card.isType(CardType.EQUIPMENT)) {
			return ActionResult.failed(new PlayerActionExceptionCode(Code.SELECTED_CARD_IS_NOT_EQUIPMENT));
		}

		return this.checkTarget(context);
	}

	private ActionResult checkTarget(ActionContext context) {
		Player sourcePlayer = context.getSourcePlayer();
		Player targetPlayer = context.getTargetPlayer();
		if (!sourcePlayer.equals(targetPlayer)) {
			return ActionResult.failed(new PlayerActionExceptionCode(Code.EQUIP_TARGET_NOT_OWNED));
		}

		Zone targetZone = context.getTargetZone();
		Coordinate targetCoordinate = context.getTargetCoordinate();
		if (!targetZone.isInside(targetCoordinate)) {
			return ActionResult.failed(new ZoneExceptionCode(ZoneExceptionCode.Code.COORDINATE_OUT_OF_BOUNDS));
		}

		if (!targetZone.hasCombatant(targetCoordinate)) {
			return ActionResult.failed(new PlayerActionExceptionCode(Code.SELECTED_TARGET_POSITION_HAS_NONE_COMBATANT));
		}

		return ActionResult.successful();
	}
}

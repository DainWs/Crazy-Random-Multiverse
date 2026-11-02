package com.dainws.games.crm.domain.core.action;

import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.card.Combatant;
import com.dainws.games.crm.domain.core.card.Equipment;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.exception.PlayerActionExceptionCode;
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
		Equipment equipment = (Equipment) context.getSourceCard();
		combatant.equip(equipment);

		this.logTrace("{0} ha sido equipado en el combatiente {1}", equipment, combatant);
		this.notifyActionEvent(EventCode.PLAYER_EQUIP_CARD, context);
		return ActionResult.successful();
	}

	private Combatant getTargetCombatantFrom(ActionContext context) {
		Zone targetZone = context.getTargetZone();
		return targetZone.getCombatant(context.getTargetCoordinate());
	}

	private ActionResult checkContext(ActionContext context) {
		Player sourcePlayer = context.getSourcePlayer();
		Hand playerHand = sourcePlayer.getHand();
		Card card = context.getSourceCard();

		if (!playerHand.contains(card)) {
			return ActionResult.failed(PlayerActionExceptionCode.SELECTED_CARD_NOT_FOUND);
		}

		if (!card.isType(CardType.EQUIPMENT)) {
			return ActionResult.failed(PlayerActionExceptionCode.SELECTED_CARD_IS_NOT_EQUIPMENT);
		}

		return ActionResult.successful();
	}
}

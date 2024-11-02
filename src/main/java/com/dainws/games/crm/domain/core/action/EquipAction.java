package com.dainws.games.crm.domain.core.action;

import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.card.Combatant;
import com.dainws.games.crm.domain.core.card.Equipment;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.exception.PlayerActionException;
import com.dainws.games.crm.domain.core.player.Hand;
import com.dainws.games.crm.domain.core.player.Player;

public class EquipAction extends PlayerTurnAction {

	@Override
	protected boolean performPlayerAction(ActionContext context) throws PlayerActionException {
		this.checkContext(context);

		Combatant combatant = this.getTargetCombatantFrom(context);
		Equipment equipment = (Equipment) context.getSourceCard();
		combatant.equip(equipment);

		this.logTrace("%s ha sido equipado en el combatiente %s", equipment, combatant);
		this.notifyActionEvent(EventCode.PLAYER_EQUIP_CARD, context);
		return true;
	}
	
	private Combatant getTargetCombatantFrom(ActionContext context) {
		Zone targetZone = context.getTargetZone();
		return targetZone.getCombatant(context.getTargetCoordinate());
	}

	private void checkContext(ActionContext context) throws PlayerActionException {
		Player sourcePlayer = context.getSourcePlayer();
		Hand playerHand = sourcePlayer.getHand();
		Card card = context.getSourceCard();

		if (!playerHand.contains(card)) {
			throw new PlayerActionException("selected_card_not_found", sourcePlayer);
		}

		if (!card.isType(CardType.EQUIPMENT)) {
			throw new PlayerActionException("selected_card_is_not_equipment", sourcePlayer);
		}
	}
}

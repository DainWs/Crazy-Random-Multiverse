package com.dainws.games.crm.domain.core.action;

import java.lang.System.Logger.Level;

import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.card.Combatant;
import com.dainws.games.crm.domain.core.card.Equipment;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.player.Hand;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.exception.GameRuntimeException;
import com.dainws.games.crm.domain.exception.PlayerActionException;

public class EquipAction extends PlayerTurnAction {

	@Override
	protected void performPlayerAction(ActionContext context) throws PlayerActionException {
		assert (this.eventPublisher != null);

		this.validate(context);

		try {
			Combatant combatant = this.getTargetCombatantFrom(context);
			Equipment equipment = (Equipment) context.getSourceCard();
			combatant.equip(equipment);

			this.logger.log(Level.TRACE, "%s ha sido equipado en el combatiente %s", equipment, combatant);
		} catch (GameRuntimeException e) {
			throw new PlayerActionException(context.getSourcePlayer(), e);
		}

		this.notifyActionEvent(EventCode.PLAYER_EQUIP_CARD, context);
	}
	
	private Combatant getTargetCombatantFrom(ActionContext context) {
		Zone targetZone = context.getTargetZone();
		return targetZone.getCombatant(context.getTargetCoordinate());
	}

	private void validate(ActionContext context) throws PlayerActionException {
		Player sourcePlayer = context.getSourcePlayer();
		Hand playerHand = sourcePlayer.getHand();
		Card card = context.getSourceCard();

		if (!playerHand.contains(card)) {
			throw new PlayerActionException(sourcePlayer, "EXCEPTION_SELECTED_CARD_NOT_FOUND");
		}

		if (!card.isType(CardType.EQUIPMENT)) {
			throw new PlayerActionException(sourcePlayer, "EXCEPTION_SELECTED_CARD_IS_NOT_EQUIPMENT");
		}
	}
}

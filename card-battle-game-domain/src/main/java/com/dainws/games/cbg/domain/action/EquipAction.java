package com.dainws.games.cbg.domain.action;

import com.dainws.games.cbg.domain.card.Card;
import com.dainws.games.cbg.domain.card.CardType;
import com.dainws.games.cbg.domain.card.Combatant;
import com.dainws.games.cbg.domain.card.Equipment;
import com.dainws.games.cbg.domain.exception.GameException;
import com.dainws.games.cbg.domain.exception.PlayerActionException;
import com.dainws.games.cbg.domain.player.Hand;
import com.dainws.games.cbg.domain.player.Zone;

public class EquipAction extends PlayerTurnAction {
	
	@Override
	protected void performPlayerAction(ActionContext context) throws PlayerActionException {
		this.validate(context);

		try {
			Card card = context.getSourceCard();
			Zone zone = context.getTargetPlayer().getZone();
			Combatant combatant = zone.getCombatant(context.getTargetPosition());
			combatant.equip((Equipment) card);
		} catch (GameException gameException) {
			throw new PlayerActionException(gameException);
		}
	}

	private void validate(ActionContext context) throws PlayerActionException {
		Hand playerHand = context.getSourcePlayer().getHand();
		Card card = context.getSourceCard();
		
		if (!playerHand.contains(card)) {
			throw new PlayerActionException("SELECTED_CARD_NOT_FOUND");
		}
		
		if (!card.isType(CardType.EQUIPMENT)) {
			throw new PlayerActionException("SELECTED_CARD_IS_NOT_EQUIPMENT");
		}
	}
}

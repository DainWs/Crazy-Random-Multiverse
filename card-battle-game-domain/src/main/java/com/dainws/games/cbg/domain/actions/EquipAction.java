package com.dainws.games.cbg.domain.actions;

import com.dainws.games.cbg.domain.Hand;
import com.dainws.games.cbg.domain.Player;
import com.dainws.games.cbg.domain.Zone;
import com.dainws.games.cbg.domain.card.Card;
import com.dainws.games.cbg.domain.card.CardType;
import com.dainws.games.cbg.domain.card.Combatant;
import com.dainws.games.cbg.domain.card.Equipment;
import com.dainws.games.cbg.domain.exception.GameException;
import com.dainws.games.cbg.domain.exception.PlayerActionException;

public class EquipAction implements Action {

	@Override
	public void perform(ActionContext context) throws PlayerActionException {
		try {
			Player sourcePlayer = context.getSourcePlayer();
			Hand playerHand = sourcePlayer.getHand();
			Card card = playerHand.getCard(context.getSourceCardCode());
			
			if (!card.isType(CardType.EQUIPMENT)) {
				throw new PlayerActionException("SELECTED_CARD_IS_NOT_EQUIPMENT");
			}
			
			Zone zone = sourcePlayer.getZone();
			Combatant combatant = zone.getCombatant(context.getTargetPosition());
			combatant.equip((Equipment) card);
		} catch (GameException gameException) {
			throw new PlayerActionException(gameException);
		}
	}
}

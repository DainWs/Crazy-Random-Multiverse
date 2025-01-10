package com.dainws.games.crm.domain.core.action;

import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.exception.PlayerActionException;
import com.dainws.games.crm.domain.core.player.Hand;
import com.dainws.games.crm.domain.core.player.Player;

public class UseSpellAction extends UseCardAction {

	@Override
	protected boolean canUse(Card card) {
		return card.isType(CardType.SPELL);
	}

	@Override
	protected void performCardAction(Card card, ActionContext context) throws PlayerActionException {
		
		// TODO perform spell card effect
		
		Player player = context.getSourcePlayer();
		Hand hand = player.getHand();
		hand.remove(card);
	}

}

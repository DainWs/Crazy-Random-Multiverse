package com.dainws.games.crm.domain.core.action;

import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.exception.PlayerActionException;

public abstract class UseCardAction extends PlayerTurnAction {
	@Override
	protected void performPlayerAction(ActionContext context) throws PlayerActionException {
		Card card = context.getSourceCard();
		if (!this.canUse(card)) {
			throw new PlayerActionException(context.getSourcePlayer(), "EXCEPTION_CARD_CANT_BE_USED");
		}
		
		this.performCardAction(card, context);
	}

	protected abstract boolean canUse(Card card);

	protected abstract void performCardAction(Card card, ActionContext context) throws PlayerActionException;
}

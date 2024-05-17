package com.dainws.games.crm.domain.models.action;

import com.dainws.games.crm.domain.exception.PlayerActionException;
import com.dainws.games.crm.domain.models.card.Card;

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

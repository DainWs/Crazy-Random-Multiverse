package com.dainws.games.crm.domain.core.action;

import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.exception.PlayerActionException;

public abstract class UseCardAction extends PlayerTurnAction {
	@Override
	protected boolean performPlayerAction(ActionContext context) throws PlayerActionException {
		Card card = context.getSourceCard();
		if (!this.canUse(card)) {
			throw new PlayerActionException("card_cant_be_used", context.getSourcePlayer());
		}
		
		this.performCardAction(card, context);
		return true;
	}

	protected abstract boolean canUse(Card card);

	protected abstract void performCardAction(Card card, ActionContext context) throws PlayerActionException;
}

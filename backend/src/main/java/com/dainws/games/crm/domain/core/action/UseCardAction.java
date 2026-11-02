package com.dainws.games.crm.domain.core.action;

import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.exception.PlayerActionExceptionCode;
import com.dainws.games.crm.domain.core.exception.PlayerActionExceptionCode.Code;

public abstract class UseCardAction extends PlayerTurnAction {
	@Override
	protected ActionResult performPlayerAction(ActionContext context) {
		Card card = context.getSourceCard();
		if (!this.canUse(card)) {
			return ActionResult.failed(new PlayerActionExceptionCode(Code.CARD_CANT_BE_USED));
		}

		this.performCardAction(card, context);
		return ActionResult.successful();
	}

	protected abstract boolean canUse(Card card);

	protected abstract void performCardAction(Card card, ActionContext context);
}

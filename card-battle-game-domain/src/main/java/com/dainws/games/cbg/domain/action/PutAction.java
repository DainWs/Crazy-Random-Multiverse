package com.dainws.games.cbg.domain.action;

import com.dainws.games.cbg.domain.card.Card;
import com.dainws.games.cbg.domain.card.CardType;
import com.dainws.games.cbg.domain.card.Combatant;
import com.dainws.games.cbg.domain.exception.GameException;
import com.dainws.games.cbg.domain.exception.PlayerActionException;
import com.dainws.games.cbg.domain.player.Hand;

public class PutAction extends PlayerTurnAction {

	@Override
	protected void performPlayerAction(ActionContext context) throws PlayerActionException {
		this.validate(context);

		try {
			Combatant combatantCard = (Combatant) context.getSourceCard();
			context.getSourcePlayer().getHand().remove(combatantCard);
			context.getTargetZone().putCombatant(combatantCard, context.getTargetPosition());
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

		if (!card.isType(CardType.WARRIOR) && !card.isType(CardType.LEADER)) {
			throw new PlayerActionException("SELECTED_CARD_IS_NOT_A_COMBATANT");
		}

		if (context.getTargetZone().hasCombatant(context.getTargetPosition())) {
			throw new PlayerActionException("TARGET_POSITION_IS_OCCUPIED");
		}
	}
}

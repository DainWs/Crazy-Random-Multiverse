package com.dainws.games.cbg.domain.action;

import java.lang.System.Logger.Level;

import com.dainws.games.cbg.domain.card.Card;
import com.dainws.games.cbg.domain.card.CardType;
import com.dainws.games.cbg.domain.card.Combatant;
import com.dainws.games.cbg.domain.exception.GameRuntimeException;
import com.dainws.games.cbg.domain.exception.PlayerActionException;
import com.dainws.games.cbg.domain.player.Hand;
import com.dainws.games.cbg.domain.player.Player;
import com.dainws.games.cbg.domain.player.Position;

public class PutAction extends PlayerTurnAction {

	@Override
	protected void performPlayerAction(ActionContext context) throws PlayerActionException {
		assert (this.playerEventListener != null);

		this.validate(context);

		try {
			Combatant combatant = (Combatant) context.getSourceCard();
			Position targetPosition = context.getTargetPosition();
			context.getSourcePlayer().getHand().remove(combatant);
			context.getTargetZone().putCombatant(combatant, targetPosition);

			this.logger.log(Level.TRACE, "La carta %s ha sido colocada en %s", combatant, targetPosition);
		} catch (GameRuntimeException e) {
			throw new PlayerActionException(context.getSourcePlayer(), e);
		}

		this.playerEventListener.onPlayerPutCardAction(context);
	}

	private void validate(ActionContext context) throws PlayerActionException {
		Player sourcePlayer = context.getSourcePlayer();
		Hand playerHand = sourcePlayer.getHand();
		Card card = context.getSourceCard();

		if (!playerHand.contains(card)) {
			throw new PlayerActionException(sourcePlayer, "EXCEPTION_SELECTED_CARD_NOT_FOUND");
		}

		if (!card.isType(CardType.WARRIOR) && !card.isType(CardType.LEADER)) {
			throw new PlayerActionException(sourcePlayer, "EXCEPTION_SELECTED_CARD_IS_NOT_A_COMBATANT");
		}

		if (context.getTargetZone().hasCombatant(context.getTargetPosition())) {
			throw new PlayerActionException(sourcePlayer, "EXCEPTION_TARGET_POSITION_IS_OCCUPIED");
		}
	}
}

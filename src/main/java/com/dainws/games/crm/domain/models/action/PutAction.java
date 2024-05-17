package com.dainws.games.crm.domain.models.action;

import java.lang.System.Logger.Level;

import com.dainws.games.crm.domain.event.EventCode;
import com.dainws.games.crm.domain.exception.GameRuntimeException;
import com.dainws.games.crm.domain.exception.PlayerActionException;
import com.dainws.games.crm.domain.models.board.Coordinate;
import com.dainws.games.crm.domain.models.board.Zone;
import com.dainws.games.crm.domain.models.card.Card;
import com.dainws.games.crm.domain.models.card.CardCode;
import com.dainws.games.crm.domain.models.card.CardType;
import com.dainws.games.crm.domain.models.card.Combatant;
import com.dainws.games.crm.domain.models.player.Hand;
import com.dainws.games.crm.domain.models.player.Player;

public class PutAction extends PlayerTurnAction {

	@Override
	protected void performPlayerAction(ActionContext context) throws PlayerActionException {
		assert (this.eventPublisher != null);

		this.validate(context);

		try {
			Coordinate targetCoordinate = context.getTargetCoordinate();
			Zone targetZone = context.getTargetZone();
			
			Combatant combatant = this.grabCombatantFromHand(context);
			targetZone.putCombatant(targetCoordinate, combatant);

			this.logger.log(Level.TRACE, "La carta %s ha sido colocada en %s", combatant, targetCoordinate);
		} catch (GameRuntimeException e) {
			throw new PlayerActionException(context.getSourcePlayer(), e);
		}

		this.notifyActionEvent(EventCode.PLAYER_PUT_CARD, context);
	}
	
	private Combatant grabCombatantFromHand(ActionContext context) {
		CardCode cardCode = context.getTargetCard().getCode();
		Hand hand = context.getTargetPlayer().getHand();
		return (Combatant) hand.grab(cardCode);
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

		if (context.getTargetZone().hasCombatant(context.getTargetCoordinate())) {
			throw new PlayerActionException(sourcePlayer, "EXCEPTION_TARGET_POSITION_IS_OCCUPIED");
		}
	}
}

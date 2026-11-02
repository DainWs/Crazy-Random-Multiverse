package com.dainws.games.crm.domain.core.action;

import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.card.CardCode;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.card.Combatant;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.exception.NotAllowedException;
import com.dainws.games.crm.domain.core.exception.PlayerActionException;
import com.dainws.games.crm.domain.core.player.Hand;
import com.dainws.games.crm.domain.core.player.Player;

public class PutAction extends PlayerTurnAction {
	public static final Coordinate NEXT_EMPTY_COORDINATE = null;

	@Override
	protected boolean performPlayerAction(ActionContext context)
			throws PlayerActionException, NotAllowedException {
		this.checkContext(context);

		Coordinate targetCoordinate = context.getTargetCoordinate();
		Combatant combatant = this.grabCombatantFromHand(context);
		Zone targetZone = context.getTargetZone();

		targetZone.putCombatant(targetCoordinate, combatant);
		this.logTrace("La carta {0} ha sido colocada en {1}", combatant, targetCoordinate);

		this.notifyActionEvent(EventCode.PLAYER_PUT_CARD, context);
		return true;
	}

	private Combatant grabCombatantFromHand(ActionContext context) {
		CardCode cardCode = context.getSourceCard().getCode();
		Hand hand = context.getSourcePlayer().getHand();
		return (Combatant) hand.grab(cardCode);
	}

	private void checkContext(ActionContext context) throws PlayerActionException {
		Player sourcePlayer = context.getSourcePlayer();
		Hand playerHand = sourcePlayer.getHand();
		Card card = context.getSourceCard();

		if (!playerHand.contains(card)) {
			throw new PlayerActionException("selected_card_not_found", sourcePlayer);
		}

		if (!card.isType(CardType.WARRIOR) && !card.isType(CardType.LEADER)) {
			throw new PlayerActionException("selected_card_is_not_combatant", sourcePlayer);
		}

		Coordinate targetCoordinate = context.getTargetCoordinate();
		if (targetCoordinate == null) {
			throw new PlayerActionException("selected_target_coordinate_is_null", sourcePlayer);
		}

		if (context.getTargetZone().hasCombatant(targetCoordinate)) {
			throw new PlayerActionException("selected_target_position_already_has_combatant", sourcePlayer);
		}
	}
}

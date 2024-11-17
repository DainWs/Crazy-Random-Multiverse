package com.dainws.games.crm.domain.core.action;

import java.lang.System.Logger.Level;

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

		this.placeCombatant(targetZone, targetCoordinate, combatant);
		this.notifyActionEvent(EventCode.PLAYER_PUT_CARD, context);
		return true;
	}

	private void placeCombatant(Zone zone, Coordinate coordinate, Combatant combatant)
			throws NotAllowedException {
		if (coordinate == NEXT_EMPTY_COORDINATE) {
			zone.addCombatant(combatant);
			this.logger.log(Level.TRACE, "La carta %s ha sido colocada en el tablero", combatant);
		} else {
			zone.putCombatant(coordinate, combatant);
			this.logger.log(Level.TRACE, "La carta %s ha sido colocada en %s", combatant, coordinate);
		}
	}

	private Combatant grabCombatantFromHand(ActionContext context) {
		CardCode cardCode = context.getTargetCard().getCode();
		Hand hand = context.getTargetPlayer().getHand();
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

		if (this.isTargetPositionNotEmpty(context)) {
			throw new PlayerActionException("selected_target_position_already_has_combatant", sourcePlayer);
		}
	}

	private boolean isTargetPositionNotEmpty(ActionContext context) {
		Coordinate targetCoordinate = context.getTargetCoordinate();

		if (targetCoordinate == NEXT_EMPTY_COORDINATE) {
			return false;
		}

		return context.getTargetZone().hasCombatant(targetCoordinate);
	}
}

package com.dainws.games.crm.domain.core.action;

import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.card.CardCode;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.card.Combatant;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.exception.PlayerActionExceptionCode.Code;
import com.dainws.games.crm.domain.core.exception.ZoneExceptionCode;
import com.dainws.games.crm.domain.core.player.Hand;
import com.dainws.games.crm.domain.core.player.Player;

public class PutAction extends PlayerTurnAction {
	public static final Coordinate NEXT_EMPTY_COORDINATE = null;

	@Override
	protected ActionResult performPlayerAction(ActionContext context) {
		ActionResult checkResult = this.checkContext(context);
		if (!checkResult.isSuccessful()) {
			return checkResult;
		}

		Coordinate targetCoordinate = context.getTargetCoordinate();
		Combatant combatant = this.grabCombatantFromHand(context);
		Zone targetZone = context.getTargetZone();

		targetZone.putCombatant(targetCoordinate, combatant);
		combatant.startPlacementCooldown();
		this.logTrace("La carta {} ha sido colocada en {}", combatant, targetCoordinate);

		this.notifyActionEvent(EventCode.PLAYER_PUT_CARD, context);
		return ActionResult.successful();
	}

	private Combatant grabCombatantFromHand(ActionContext context) {
		CardCode cardCode = context.getSourceCard().getCode();
		Hand hand = context.getSourcePlayer().getHand();
		return (Combatant) hand.grab(cardCode);
	}

	private ActionResult checkContext(ActionContext context) {
		Player sourcePlayer = context.getSourcePlayer();
		Hand playerHand = sourcePlayer.getHand();
		Card card = context.getSourceCard();

		if (!playerHand.contains(card)) {
			return ActionResult.playerActionFailed(Code.SELECTED_CARD_NOT_FOUND);
		}

		if (!card.isType(CardType.WARRIOR) && !card.isType(CardType.LEADER)) {
			return ActionResult.playerActionFailed(Code.SELECTED_CARD_IS_NOT_COMBATANT);
		}

		return this.checkTarget(context, card);
	}

	private ActionResult checkTarget(ActionContext context, Card card) {
		Coordinate targetCoordinate = context.getTargetCoordinate();
		Zone targetZone = context.getTargetZone();
		if (!targetZone.isInside(targetCoordinate)) {
			return ActionResult.failed(new ZoneExceptionCode(ZoneExceptionCode.Code.COORDINATE_OUT_OF_BOUNDS));
		}

		if (targetZone.hasCombatant(targetCoordinate)) {
			return ActionResult.playerActionFailed(Code.SELECTED_TARGET_POSITION_ALREADY_HAS_COMBATANT);
		}

		if (targetZone.isLeaderSlot(targetCoordinate) && !card.isType(CardType.LEADER)) {
			return ActionResult.failed(new ZoneExceptionCode(ZoneExceptionCode.Code.COORDINATE_REQUIRES_LEADER));
		}

		if (!targetZone.isPreviousRowFilled(targetCoordinate.getRow())) {
			return ActionResult.failed(new ZoneExceptionCode(ZoneExceptionCode.Code.PREVIOUS_ROW_NEEDS_TO_BE_FILLED));
		}

		return ActionResult.successful();
	}
}

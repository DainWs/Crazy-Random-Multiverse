package com.dainws.games.crm.domain.core.action;

import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.card.Combatant;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.exception.PlayerActionExceptionCode.Code;

public class MoveAction extends PlayerTurnAction {

	@Override
	protected ActionResult performPlayerAction(ActionContext context) {
		ActionResult checkResult = this.checkContext(context);
		if (!checkResult.isSuccessful()) {
			return checkResult;
		}

		Coordinate fromCoordinate = context.getSourceCoordinate();
		Coordinate toCoordinate = context.getTargetCoordinate();
		Zone sourceZone = context.getSourceZone();
		Zone targetZone = context.getTargetZone();

		Combatant combatant = this.getSourceCombatantFrom(context);
		if (targetZone.hasCombatant(toCoordinate)) {
			targetZone.swapCombatants(fromCoordinate, toCoordinate);
		} else {
			targetZone.putCombatant(toCoordinate, combatant);
			sourceZone.removeCombatant(fromCoordinate);
		}

		this.logTrace("{0} ha sido movido desde {1} a {2}", combatant, fromCoordinate, toCoordinate);
		this.notifyActionEvent(EventCode.PLAYER_MOVE_CARD, context);
		return ActionResult.successful();
	}

	private Combatant getSourceCombatantFrom(ActionContext context) {
		Zone sourceZone = context.getSourceZone();
		return sourceZone.getCombatant(context.getSourceCoordinate());
	}

	private ActionResult checkContext(ActionContext context) {
		Zone sourceZone = context.getSourceZone();
		Zone targetZone = context.getTargetZone();
		Combatant combatant = this.getSourceCombatantFrom(context);

		if (!sourceZone.hasCombatant(context.getSourceCoordinate())) {
			return ActionResult.playerActionFailed(Code.SELECTED_SOURCE_POSITION_HAS_NONE_COMBATANT);
		}

		if (!sourceZone.equals(targetZone)) {
			return ActionResult.playerActionFailed(Code.SELECTED_TARGET_ZONE_IS_NOT_SOURCE_ZONE);
		}

		if (combatant.isType(CardType.LEADER)) {
			return ActionResult.playerActionFailed(Code.SELECTED_SOURCE_IS_LEADER);
		}

		if (!this.isTargetAllowed(context, combatant)) {
			return ActionResult.playerActionFailed(Code.SELECTED_TARGET_POSITION_NOT_ALLOWED);
		}

		return ActionResult.successful();
	}

	private boolean isTargetAllowed(ActionContext context, Combatant combatant) {
		Zone targetZone = context.getTargetZone();
		Coordinate fromCoordinate = context.getSourceCoordinate();
		Coordinate toCoordinate = context.getTargetCoordinate();

		if (targetZone.hasCombatant(toCoordinate)) {
			return targetZone.canSwapCombatants(fromCoordinate, toCoordinate);
		}

		return targetZone.canPutCombatant(toCoordinate, combatant);
	}
}

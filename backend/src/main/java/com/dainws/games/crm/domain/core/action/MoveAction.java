package com.dainws.games.crm.domain.core.action;

import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.card.Combatant;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.exception.NotAllowedException;
import com.dainws.games.crm.domain.core.exception.PlayerActionException;
import com.dainws.games.crm.domain.core.player.Player;

public class MoveAction extends PlayerTurnAction {

	@Override
	protected boolean performPlayerAction(ActionContext context)
			throws PlayerActionException, NotAllowedException {
		this.checkContext(context);

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
		return true;
	}

	private Combatant getSourceCombatantFrom(ActionContext context) {
		Zone sourceZone = context.getSourceZone();
		return sourceZone.getCombatant(context.getSourceCoordinate());
	}

	private void checkContext(ActionContext context) throws PlayerActionException {
		Player sourcePlayer = context.getSourcePlayer();
		Zone sourceZone = context.getSourceZone();
		Zone targetZone = context.getTargetZone();
		Combatant combatant = this.getSourceCombatantFrom(context);
	
		if (!sourceZone.hasCombatant(context.getSourceCoordinate())) {
			throw new PlayerActionException("selected_source_position_has_none_combatant", sourcePlayer);
		}

		if (!sourceZone.equals(targetZone)) {
			throw new PlayerActionException("selected_target_zone_is_not_source_zone", sourcePlayer);
		}

		if (this.getSourceCombatantFrom(context).isType(CardType.LEADER)) {
			throw new PlayerActionException("selected_source_is_leader", sourcePlayer);
		}

		if (!this.isTargetAllowed(context, combatant)) {
			throw new PlayerActionException("selected_target_position_not_allowed", sourcePlayer);
		}
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

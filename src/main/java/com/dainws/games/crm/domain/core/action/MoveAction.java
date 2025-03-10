package com.dainws.games.crm.domain.core.action;

import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.board.Zone;
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
		sourceZone.removeCombatant(fromCoordinate);
		targetZone.putCombatant(toCoordinate, combatant);

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

		if (!context.getSourceZone().hasCombatant(context.getSourceCoordinate())) {
			throw new PlayerActionException("selected_source_position_has_none_combatant", sourcePlayer);
		}

		if (context.getTargetZone().hasCombatant(context.getTargetCoordinate())) {
			throw new PlayerActionException("selected_target_position_already_has_combatant", sourcePlayer);
		}
	}
}

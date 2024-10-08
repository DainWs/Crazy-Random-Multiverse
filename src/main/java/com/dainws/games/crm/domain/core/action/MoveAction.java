package com.dainws.games.crm.domain.core.action;

import java.lang.System.Logger.Level;

import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.Combatant;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.exception.GameRuntimeException;
import com.dainws.games.crm.domain.exception.PlayerActionException;

public class MoveAction extends PlayerTurnAction {

	@Override
	protected void performPlayerAction(ActionContext context) throws PlayerActionException {
		assert (this.eventPublisher != null);

		this.validate(context);

		try {
			Coordinate fromCoordinate = context.getSourceCoordinate();
			Coordinate toCoordinate = context.getTargetCoordinate();
			Zone sourceZone = context.getSourceZone();
			Zone targetZone = context.getTargetZone();

			Combatant combatant = this.getSourceCombatantFrom(context);
			sourceZone.removeCombatant(fromCoordinate);
			targetZone.putCombatant(toCoordinate, combatant);

			this.logger.log(Level.TRACE, "%s ha sido movido desde %s a %s", combatant, fromCoordinate, toCoordinate);
		} catch (GameRuntimeException e) {
			throw new PlayerActionException(context.getSourcePlayer(), e);
		}

		this.notifyActionEvent(EventCode.PLAYER_MOVE_CARD, context);
	}
	
	private Combatant getSourceCombatantFrom(ActionContext context) {
		Zone sourceZone = context.getSourceZone();
		return sourceZone.getCombatant(context.getSourceCoordinate());
	}

	private void validate(ActionContext context) throws PlayerActionException {
		Player sourcePlayer = context.getSourcePlayer();

		if (!context.getSourceZone().hasCombatant(context.getSourceCoordinate())) {
			throw new PlayerActionException(sourcePlayer, "EXCEPTION_NONE_COMBATANT_IN_TARGET_POSITION");
		}

		if (context.getTargetZone().hasCombatant(context.getTargetCoordinate())) {
			throw new PlayerActionException(sourcePlayer, "EXCEPTION_TARGET_POSITION_IS_OCCUPIED");
		}
	}
}

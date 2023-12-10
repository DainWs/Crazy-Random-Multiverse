package com.dainws.games.cbg.domain.action;

import java.lang.System.Logger.Level;

import com.dainws.games.cbg.domain.card.Combatant;
import com.dainws.games.cbg.domain.exception.GameRuntimeException;
import com.dainws.games.cbg.domain.exception.PlayerActionException;
import com.dainws.games.cbg.domain.player.Player;
import com.dainws.games.cbg.domain.player.Position;
import com.dainws.games.cbg.domain.player.Zone;

public class MoveAction extends PlayerTurnAction {

	@Override
	protected void performPlayerAction(ActionContext context) throws PlayerActionException {
		assert (this.playerEventListener != null);

		this.validate(context);

		try {
			Position fromPosition = context.getSourcePosition();
			Position toPosition = context.getTargetPosition();
			Zone sourceZone = context.getSourceZone();
			Zone targetZone = context.getTargetZone();

			Combatant combatant = sourceZone.getCombatant(fromPosition);
			sourceZone.removeCombatant(fromPosition);
			targetZone.putCombatant(combatant, toPosition);

			this.logger.log(Level.TRACE, "%s ha sido movido desde %s a %s", combatant, fromPosition, toPosition);
		} catch (GameRuntimeException e) {
			throw new PlayerActionException(context.getSourcePlayer(), e);
		}

		this.playerEventListener.onPlayerMoveCardAction(context);
	}

	private void validate(ActionContext context) throws PlayerActionException {
		Player sourcePlayer = context.getSourcePlayer();

		if (!context.getSourceZone().hasCombatant(context.getSourcePosition())) {
			throw new PlayerActionException(sourcePlayer, "EXCEPTION_NONE_COMBATANT_IN_TARGET_POSITION");
		}

		if (context.getTargetZone().hasCombatant(context.getTargetPosition())) {
			throw new PlayerActionException(sourcePlayer, "EXCEPTION_TARGET_POSITION_IS_OCCUPIED");
		}
	}
}

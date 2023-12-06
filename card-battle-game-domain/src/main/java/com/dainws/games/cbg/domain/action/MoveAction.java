package com.dainws.games.cbg.domain.action;

import com.dainws.games.cbg.domain.card.Combatant;
import com.dainws.games.cbg.domain.exception.GameException;
import com.dainws.games.cbg.domain.exception.PlayerActionException;
import com.dainws.games.cbg.domain.player.Position;
import com.dainws.games.cbg.domain.player.Zone;

public class MoveAction extends PlayerTurnAction {
	@Override
	protected void performPlayerAction(ActionContext context) throws PlayerActionException {
		this.validate(context);

		try {
			Position fromPosition = context.getSourcePosition();
			Position toPosition = context.getTargetPosition();
			Zone sourceZone = context.getSourceZone();
			Zone targetZone = context.getTargetZone();

			Combatant combatant = sourceZone.getCombatant(fromPosition);
			sourceZone.removeCombatant(fromPosition);
			targetZone.putCombatant(combatant, toPosition);
		} catch (GameException gameException) {
			throw new PlayerActionException(gameException);
		}
	}
	
	private void validate(ActionContext context) throws PlayerActionException {
		if (!context.getSourceZone().hasCombatant(context.getSourcePosition())) {
			throw new PlayerActionException("NONE_COMBATANT_IN_TARGET_POSITION");
		}

		if (context.getTargetZone().hasCombatant(context.getTargetPosition())) {
			throw new PlayerActionException("TARGET_POSITION_IS_OCCUPIED");
		}
	}
}

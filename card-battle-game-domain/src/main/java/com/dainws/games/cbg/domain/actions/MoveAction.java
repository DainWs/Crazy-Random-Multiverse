package com.dainws.games.cbg.domain.actions;

import com.dainws.games.cbg.domain.Position;
import com.dainws.games.cbg.domain.Zone;
import com.dainws.games.cbg.domain.card.Combatant;
import com.dainws.games.cbg.domain.exception.GameException;
import com.dainws.games.cbg.domain.exception.PlayerActionException;

public class MoveAction implements Action {
	@Override
	public void perform(ActionContext context) throws PlayerActionException {
		try {
			Position fromPosition = context.getSourcePosition();
			Position toPosition = context.getTargetPosition();
			
			Zone zone = context.getSourcePlayer().getZone();
			if (zone.hasCombatant(toPosition)) {
				throw new PlayerActionException("TARGET_POSITION_IS_OCCUPIED");
			}

			if (!zone.hasCombatant(fromPosition)) {
				throw new PlayerActionException("NONE_COMBATANT_IN_TARGET_POSITION");
			}

			Combatant combatant = zone.getCombatant(fromPosition);
			zone.removeCombatant(fromPosition);
			zone.putCombatant(combatant, toPosition);
		} catch (GameException gameException) {
			throw new PlayerActionException(gameException);
		}
	}
}

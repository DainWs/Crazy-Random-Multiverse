package com.dainws.games.cbg.domain.actions;

import com.dainws.games.cbg.domain.Zone;
import com.dainws.games.cbg.domain.card.Combatant;
import com.dainws.games.cbg.domain.exception.GameException;
import com.dainws.games.cbg.domain.exception.PlayerActionException;

public class AttackAction implements Action {

	@Override
	public void perform(ActionContext context) throws PlayerActionException {
		try {
			Zone sourceZone = context.getSourcePlayer().getZone();
			Combatant sourceCombatant = sourceZone.getCombatant(context.getSourcePosition());
	
			Zone targetZone = context.getTargetPlayer().getZone();
			Combatant targetCombatant = targetZone.getCombatant(context.getTargetPosition());
	
			targetCombatant.receiveDamageFrom(sourceCombatant);
	
			if (!targetCombatant.isAlive()) {
				targetZone.removeCombatant(context.getTargetPosition());
			}
		} catch (GameException gameException) {
			throw new PlayerActionException(gameException);
		}
	}
}

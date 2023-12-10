package com.dainws.games.cbg.domain.action;

import java.lang.System.Logger.Level;

import com.dainws.games.cbg.domain.card.Combatant;
import com.dainws.games.cbg.domain.exception.GameRuntimeException;
import com.dainws.games.cbg.domain.exception.PlayerActionException;
import com.dainws.games.cbg.domain.player.Zone;

public class AttackAction extends PlayerTurnAction {

	@Override
	protected void performPlayerAction(ActionContext context) throws PlayerActionException {
		assert (this.playerEventListener != null);

		try {
			Zone sourceZone = context.getSourcePlayer().getZone();
			Combatant sourceCombatant = sourceZone.getCombatant(context.getSourcePosition());

			Zone targetZone = context.getTargetPlayer().getZone();
			Combatant targetCombatant = targetZone.getCombatant(context.getTargetPosition());

			this.logger.log(Level.TRACE, "El combatiente %s ataca al combatiente %s", sourceCombatant, targetCombatant);

			targetCombatant.receiveDamageFrom(sourceCombatant);

			this.logger.log(Level.TRACE, "El resultado ha sido: %s", targetCombatant);

			if (!targetCombatant.isAlive()) {
				this.logger.log(Level.TRACE, "La carta %s ha muerto", targetCombatant.getName());
				targetZone.removeCombatant(context.getTargetPosition());
			}
		} catch (GameRuntimeException e) {
			throw new PlayerActionException(context.getSourcePlayer(), e);
		}

		this.playerEventListener.onPlayerAttackCardAction(context);
	}
}

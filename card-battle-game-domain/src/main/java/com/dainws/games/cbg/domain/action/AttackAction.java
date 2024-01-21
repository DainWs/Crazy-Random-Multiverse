package com.dainws.games.cbg.domain.action;

import java.lang.System.Logger.Level;

import com.dainws.games.cbg.domain.board.Zone;
import com.dainws.games.cbg.domain.card.Combatant;
import com.dainws.games.cbg.domain.event.EventCode;
import com.dainws.games.cbg.domain.exception.GameRuntimeException;
import com.dainws.games.cbg.domain.exception.PlayerActionException;

public class AttackAction extends PlayerTurnAction {

	@Override
	protected void performPlayerAction(ActionContext context) throws PlayerActionException {
		assert (this.eventHandler != null);

		try {
			Combatant sourceCombatant = this.getSourceCombatantFrom(context);
			Combatant targetCombatant = this.getTargetCombatantFrom(context);
			this.logger.log(Level.TRACE, "El combatiente %s ataca al combatiente %s", sourceCombatant, targetCombatant);

			targetCombatant.receiveDamageFrom(sourceCombatant);
			this.logger.log(Level.TRACE, "El resultado ha sido: %s", targetCombatant);

			if (!targetCombatant.isAlive()) {
				this.logger.log(Level.TRACE, "La carta %s ha muerto", targetCombatant.getName());
				this.removeDeadTargetFromZone(context);
			}			
		} catch (GameRuntimeException e) {
			throw new PlayerActionException(context.getSourcePlayer(), e);
		}

		this.notifyActionEvent(EventCode.PLAYER_ATTACK_CARD, context);
	}
	
	private Combatant getSourceCombatantFrom(ActionContext context) {
		Zone sourceZone = context.getSourceZone();
		return sourceZone.getCombatant(context.getSourceCoordinate());
	}
	
	private Combatant getTargetCombatantFrom(ActionContext context) {
		Zone targetZone = context.getTargetZone();
		return targetZone.getCombatant(context.getTargetCoordinate());
	}
	
	private void removeDeadTargetFromZone(ActionContext context) {
		Zone targetZone = context.getTargetZone();
		targetZone.removeCombatant(context.getTargetCoordinate());
	}
}

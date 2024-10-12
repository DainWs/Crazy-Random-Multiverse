package com.dainws.games.crm.domain.core.action;

import java.lang.System.Logger.Level;

import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.Combatant;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.exception.GameRuntimeException;
import com.dainws.games.crm.domain.core.exception.PlayerActionException;

public class AttackAction extends PlayerTurnAction {

	@Override
	protected void performPlayerAction(ActionContext context) throws PlayerActionException {
		assert (this.eventPublisher != null);

		try {
			Combatant sourceCombatant = this.getSourceCombatantFrom(context);
			Combatant targetCombatant = this.getTargetCombatantFrom(context);
			this.logger.log(Level.TRACE, "El combatiente %s ataca al combatiente %s", sourceCombatant, targetCombatant);

			targetCombatant.receiveDamageFrom(sourceCombatant);
			this.logger.log(Level.TRACE, "El resultado ha sido: %s", targetCombatant);

			if (!targetCombatant.isAlive()) {
				this.logger.log(Level.TRACE, "La carta %s ha muerto", targetCombatant.getCode());
				this.removeDeadTargetFromZone(context);
			}			
		} catch (GameRuntimeException e) {
			throw new PlayerActionException(e, context.getSourcePlayer());
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

package com.dainws.games.crm.domain.models.action;

import java.lang.System.Logger.Level;

import com.dainws.games.crm.domain.event.EventCode;
import com.dainws.games.crm.domain.exception.GameRuntimeException;
import com.dainws.games.crm.domain.exception.PlayerActionException;
import com.dainws.games.crm.domain.models.board.Zone;
import com.dainws.games.crm.domain.models.card.Combatant;

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
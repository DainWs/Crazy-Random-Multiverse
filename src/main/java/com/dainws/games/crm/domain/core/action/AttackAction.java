package com.dainws.games.crm.domain.core.action;

import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.Combatant;
import com.dainws.games.crm.domain.core.event.EventCode;

public class AttackAction extends PlayerTurnAction {

	@Override
	protected boolean performPlayerAction(ActionContext context) {
		Combatant sourceCombatant = this.getSourceCombatantFrom(context);
		Combatant targetCombatant = this.getTargetCombatantFrom(context);
		this.logTrace("El combatiente {0} ataca al combatiente {1}", sourceCombatant, targetCombatant);

		targetCombatant.receiveDamageFrom(sourceCombatant);
		this.logTrace("El resultado ha sido: {0}", targetCombatant);

		if (!targetCombatant.isAlive()) {
			this.logTrace("La carta {0} ha muerto", targetCombatant.getCode());
			this.removeDeadTargetFromZone(context);
		}

		this.notifyActionEvent(EventCode.PLAYER_ATTACK_CARD, context);
		return true;
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

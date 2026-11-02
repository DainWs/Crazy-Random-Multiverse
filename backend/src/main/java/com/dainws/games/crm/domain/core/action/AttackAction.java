package com.dainws.games.crm.domain.core.action;

import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.AttackResult;
import com.dainws.games.crm.domain.core.card.Combatant;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.event.EventDetails;
import com.dainws.games.crm.domain.core.exception.PlayerActionExceptionCode;
import com.dainws.games.crm.domain.core.exception.PlayerActionExceptionCode.Code;

public class AttackAction extends PlayerTurnAction {

	@Override
	protected ActionResult performPlayerAction(ActionContext context) {
		Combatant sourceCombatant = this.getSourceCombatantFrom(context);
		ActionResult checkResult = this.checkContext(context, sourceCombatant);
		if (!checkResult.isSuccessful()) {
			return checkResult;
		}

		Combatant targetCombatant = this.getTargetCombatantFrom(context);
		this.logTrace("El combatiente {0} ataca al combatiente {1}", sourceCombatant, targetCombatant);

		AttackResult attackResult = targetCombatant.receiveDamageFrom(sourceCombatant);
		this.logTrace("El resultado ha sido: {0}", targetCombatant);

		if (!targetCombatant.isAlive()) {
			this.logTrace("La carta {0} ha muerto", targetCombatant.getCode());
			this.removeDeadTargetFromZone(context);
		}

		EventDetails eventDetails = this.createEventDetailsFrom(context);
		eventDetails.setAttackResult(attackResult);
		this.notifyActionEvent(EventCode.PLAYER_ATTACK_CARD, eventDetails);
		return ActionResult.successful();
	}

	private ActionResult checkContext(ActionContext context, Combatant sourceCombatant) {
		if (!sourceCombatant.canAttack()) {
			return ActionResult.failed(new PlayerActionExceptionCode(Code.SELECTED_SOURCE_ATTACK_IN_COOLDOWN));
		}

		Zone targetZone = context.getTargetZone();
		if (targetZone.isProtectedAt(context.getTargetCoordinate())) {
			return ActionResult.failed(new PlayerActionExceptionCode(Code.SELECTED_TARGET_IS_PROTECTED));
		}

		return ActionResult.successful();
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

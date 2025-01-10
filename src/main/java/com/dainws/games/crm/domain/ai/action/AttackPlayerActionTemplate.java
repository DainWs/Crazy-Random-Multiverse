package com.dainws.games.crm.domain.ai.action;

import java.util.Arrays;
import java.util.Objects;

import com.dainws.games.crm.domain.ai.AIAction;
import com.dainws.games.crm.domain.ai.goals.BaseGoalNames;
import com.dainws.games.crm.domain.ai.goals.Goal;
import com.dainws.games.crm.domain.core.action.Action;
import com.dainws.games.crm.domain.core.action.ActionContext;
import com.dainws.games.crm.domain.core.action.AttackAction;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.Combatant;

public class AttackPlayerActionTemplate extends AggressiveActionTemplate {

	@Override
	public Class<? extends Action> getActionType() {
		return AttackAction.class;
	}

	@Override
	public final boolean alignedWith(Goal goal) {
		return goal.getName().equals(BaseGoalNames.ATTACK_PLAYER);
	}

	@Override
	public boolean canPerformWith(ActionContext actionContext) {
		Zone zone = actionContext.getTargetZone();
		if (!zone.isAlive() || !zone.hasCombatants()) {
			return false;
		}
		
		Zone myZone = actionContext.getSourceZone();
		if (!myZone.hasCombatants()) {
			return false;
		}

		Combatant[][] combatantsMatrix = myZone.getCombatants();
		return Arrays.stream(combatantsMatrix)
			    .flatMap(Arrays::stream)
			    .filter(combatant -> Objects.nonNull(combatant))
			    .anyMatch(Combatant::canAttack);
	}

	@Override
	public AIAction createAction(ActionContext actionContext) {
		return new AIAction(new AttackAction(), actionContext, this);
	}
}

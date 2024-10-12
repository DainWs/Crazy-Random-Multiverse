package com.dainws.games.crm.domain.ai.goals.conditions;

import com.dainws.games.crm.domain.ai.AIAction;
import com.dainws.games.crm.domain.ai.goals.GoalArchiveCondition;
import com.dainws.games.crm.domain.core.action.AttackAction;

public class AttackActionArchiveCondition implements GoalArchiveCondition {

	@Override
	public boolean test(AIAction aiAction) {
		return aiAction.getAction() instanceof AttackAction;
	}

}
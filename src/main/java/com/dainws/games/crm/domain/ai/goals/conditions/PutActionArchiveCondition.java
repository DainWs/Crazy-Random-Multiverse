package com.dainws.games.crm.domain.ai.goals.conditions;

import com.dainws.games.crm.domain.ai.AIAction;
import com.dainws.games.crm.domain.ai.goals.GoalArchiveCondition;
import com.dainws.games.crm.domain.core.action.PutAction;

public class PutActionArchiveCondition implements GoalArchiveCondition {

	@Override
	public boolean test(AIAction aiAction) {
		return  aiAction.getAction() instanceof PutAction;
	}
}

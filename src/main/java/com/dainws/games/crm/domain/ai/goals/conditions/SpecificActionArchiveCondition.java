package com.dainws.games.crm.domain.ai.goals.conditions;

import com.dainws.games.crm.domain.ai.AIAction;
import com.dainws.games.crm.domain.ai.goals.GoalArchiveCondition;
import com.dainws.games.crm.domain.core.action.Action;

public class SpecificActionArchiveCondition implements GoalArchiveCondition {

	private Class<? extends Action> clazz;
	
	public SpecificActionArchiveCondition(Class<? extends Action> clazz) {
		this.clazz = clazz;
	}
	
	@Override
	public boolean test(AIAction aiAction) {
		Action action = aiAction.getAction();
		return this.clazz.isInstance(action);
	}
}
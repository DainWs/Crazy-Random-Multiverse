package com.dainws.games.crm.domain.ai.goals;

import com.dainws.games.crm.domain.ai.AIAction;

public class InfiniteGoal extends Goal {

	public InfiniteGoal(GoalName name, GoalArchiveCondition condition) {
		super(name, condition);
	}

	@Override
	protected boolean isArchieved() {
		return false;
	}

	@Override
	protected void onConditionMatch(AIAction action) {
		
	}
}

package com.dainws.games.crm.domain.ai.goals;

import com.dainws.games.crm.domain.ai.AIAction;

public class OneTimeGoal extends Goal {

	private boolean archieved;

	public OneTimeGoal(GoalName name, GoalArchiveCondition condition) {
		super(name, condition);
		this.archieved = false;
	}

	@Override
	public final boolean isArchieved() {
		return this.archieved;
	}

	@Override
	protected void onConditionMatch(AIAction action) {
		this.archieved = true;
	}
}

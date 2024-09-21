package com.dainws.games.crm.domain.ai.goals;

import com.dainws.games.crm.domain.ai.AIAction;

public abstract class Goal {
	private GoalName name;
	private GoalArchiveCondition condition;
	
	protected Goal(GoalName name, GoalArchiveCondition condition) {
		this.name = name;
		this.condition = condition;
	}
	
	public GoalName getName() {
		return this.name;
	}

	protected abstract boolean isArchieved();
	
	public final void updateGoal(AIAction aiAction) {
		if (this.condition.test(aiAction)) {
			this.onConditionMatch(aiAction);
		}
	}

	protected abstract void onConditionMatch(AIAction action);
	
	@Override
	public String toString() {
		return this.name.text();
	}
}

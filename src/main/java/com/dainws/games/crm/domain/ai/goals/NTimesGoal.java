package com.dainws.games.crm.domain.ai.goals;

import com.dainws.games.crm.domain.ai.AIAction;

public class NTimesGoal extends Goal {
	private final int timesToMatch;
	private int currentMatchedTimes;
	
	public NTimesGoal(GoalName name, GoalArchiveCondition condition, int times) {
		super(name, condition);
		this.timesToMatch = times;
		this.currentMatchedTimes = 0;
	}
	
	@Override
	public final boolean isArchieved() {
		return this.currentMatchedTimes >= this.timesToMatch;
	}

	@Override
	protected void onConditionMatch(AIAction action) {
		this.currentMatchedTimes++;
	}
}

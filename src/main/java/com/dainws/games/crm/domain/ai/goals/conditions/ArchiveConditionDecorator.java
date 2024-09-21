package com.dainws.games.crm.domain.ai.goals.conditions;

import com.dainws.games.crm.domain.ai.AIAction;
import com.dainws.games.crm.domain.ai.goals.GoalArchiveCondition;

public abstract class ArchiveConditionDecorator implements GoalArchiveCondition {
	private GoalArchiveCondition wrappee;
	
	protected ArchiveConditionDecorator(GoalArchiveCondition archiveCondition) {
		this.wrappee = archiveCondition;
	}
	
	@Override
	public boolean test(AIAction aiAction) {
		return this.wrappee.test(aiAction);
	}

}

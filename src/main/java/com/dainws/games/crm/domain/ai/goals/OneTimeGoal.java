package com.dainws.games.crm.domain.ai.goals;

import com.dainws.games.crm.domain.ai.AIAction;
import com.dainws.games.crm.domain.ai.Goal;

public abstract class OneActionGoal implements Goal {

	private boolean archieved;
	
	protected OneActionGoal() {
		this.archieved = false;
	}
	
	@Override
	public final boolean isArchieved() {
		return this.archieved;
	}

	@Override
	public final void updateGoal(AIAction action) {
		if (this.test(action)) {
			this.archieved = true;
		}
	}
	
	protected abstract boolean test(AIAction action);
}

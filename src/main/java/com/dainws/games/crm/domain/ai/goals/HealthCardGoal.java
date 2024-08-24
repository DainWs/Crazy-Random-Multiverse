package com.dainws.games.crm.domain.ai.goals;

import com.dainws.games.crm.domain.ai.AIAction;
import com.dainws.games.crm.domain.ai.Goal;
import com.dainws.games.crm.domain.core.card.Card;

public class HealthCardGoal implements Goal {
	private Card target;
	private boolean archieved;
	
	public HealthCardGoal(Card target) {
		this.target = target;
		this.archieved = false;
	}
	
	@Override
	public String getName() {
		return getNameOfGoalFor(this.target);
	}

	@Override
	public boolean isArchieved() {
		return this.archieved;
	}
	
	@Override
	public void updateGoal(AIAction action) {
		if (action.alignedWith(this)) {
			this.archieved = true;
		}
	}
	
	public static String getNameOfGoalFor(Card target) {
		return "HEALTH_CARD_%s".formatted(target.getCode());
	}
}

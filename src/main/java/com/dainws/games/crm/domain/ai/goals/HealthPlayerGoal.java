package com.dainws.games.crm.domain.ai.goals;

import com.dainws.games.crm.domain.ai.AIAction;
import com.dainws.games.crm.domain.ai.Goal;
import com.dainws.games.crm.domain.core.player.Player;

public class HealthPlayerGoal implements Goal {

	private Player target;
	private boolean archieved;
	
	public HealthPlayerGoal(Player target) {
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
	
	public static String getNameOfGoalFor(Player target) {
		return "HEALTH_PLAYER_%s".formatted(target.getCode());
	}

}

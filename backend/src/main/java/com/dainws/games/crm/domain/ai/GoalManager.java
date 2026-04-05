package com.dainws.games.crm.domain.ai;

import java.util.List;

import com.dainws.games.crm.domain.ai.goals.BaseGoalManager;
import com.dainws.games.crm.domain.ai.goals.Goal;

public interface GoalManager {
	void defineGoals(AIContext context);
	
	void updateGoalAlignedWith(AIAction action);
	
	List<Goal> getGoals();

	static GoalManager getDefault() {
		return new BaseGoalManager();
	}
}

package com.dainws.games.crm.domain.ai;

import java.util.List;

import com.dainws.games.crm.domain.ai.classic.ClassicGoalManager;

public interface GoalManager {

	void defineGoals();
	
	void updateGoalAlignedWith(AIAction action);
	
	boolean hasSatisfiedAllGoals();
	
	List<Goal> getGoals();

	static GoalManager getDefault() {
		return new ClassicGoalManager();
	}
}

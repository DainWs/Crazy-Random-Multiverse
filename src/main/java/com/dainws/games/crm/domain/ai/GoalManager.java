package com.dainws.games.crm.domain.ai;

import java.util.List;

public interface GoalManager {

	void defineGoals();
	
	void updateGoalAlignedWith(AIAction action);
	
	boolean hasSatisfiedAllGoals();
	
	List<Goal> getGoals();
}

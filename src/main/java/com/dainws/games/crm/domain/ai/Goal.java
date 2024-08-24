package com.dainws.games.crm.domain.ai;

public interface Goal {
	String getName();

	boolean isArchieved();
	
	void updateGoal(AIAction action);
}

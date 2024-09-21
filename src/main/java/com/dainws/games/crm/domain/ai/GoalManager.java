package com.dainws.games.crm.domain.ai;

import java.util.List;

import com.dainws.games.crm.domain.ai.classic.ClassicGoalManager;
import com.dainws.games.crm.domain.ai.goals.Goal;
import com.dainws.games.crm.domain.core.Game;

public interface GoalManager {
	void applySelfAwareness(AIPlayer meAsAPlayer);

	void defineGoals(Game game);
	
	void updateGoalAlignedWith(AIAction action);
	
	List<Goal> getGoals();

	static GoalManager getDefault() {
		return new ClassicGoalManager();
	}
}

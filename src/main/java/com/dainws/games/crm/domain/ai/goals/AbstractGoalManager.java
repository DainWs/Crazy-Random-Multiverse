package com.dainws.games.crm.domain.ai.goals;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.crm.domain.ai.AIAction;
import com.dainws.games.crm.domain.ai.AIContext;
import com.dainws.games.crm.domain.ai.GoalManager;

public abstract class AbstractGoalManager implements GoalManager {

	private List<Goal> goals;

	@Override
	public void defineGoals(AIContext context) {
		this.goals = new ArrayList<>();
		this.goals.addAll(this.defineAggressiveGoals(context));
		this.goals.addAll(this.defineNeutralGoals(context));
		this.goals.addAll(this.defineDefensiveGoals(context));
	}

	protected abstract List<Goal> defineAggressiveGoals(AIContext context);

	protected abstract List<Goal> defineNeutralGoals(AIContext context);

	protected abstract List<Goal> defineDefensiveGoals(AIContext context);

	@Override
	public void updateGoalAlignedWith(AIAction action) {
		for (Goal goal : this.goals) {
			goal.updateGoal(action);
		}
	}

	@Override
	public final List<Goal> getGoals() {
		return this.goals;
	}

}
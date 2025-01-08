package com.dainws.games.crm.domain.ai.goals;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.crm.domain.ai.AIAction;
import com.dainws.games.crm.domain.ai.AIContext;
import com.dainws.games.crm.domain.ai.GoalManager;
import com.dainws.games.crm.domain.log.Logger;

public abstract class AbstractGoalManager implements GoalManager {

	protected final Logger logger;
	private List<Goal> goals;

	public AbstractGoalManager() {
		this.logger = Logger.getLogger(getClass());
	}
	
	@Override
	public void defineGoals(AIContext context) {
		this.logger.trace("Defining goals for behavior");
		this.goals = new ArrayList<>();
		
		this.logger.trace("Defining aggressive goals for behavior");
		this.goals.addAll(this.defineAggressiveGoals(context));

		this.logger.trace("Defining neutral goals for behavior");
		this.goals.addAll(this.defineNeutralGoals(context));

		this.logger.trace("Defining defensive goals for behavior");
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

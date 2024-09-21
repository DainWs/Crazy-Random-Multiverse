package com.dainws.games.crm.domain.ai;

import java.util.List;

public class Behavior {
	private GoalManager goalManager;
	private ActionExecutor actionExecutor;
	private ActionManager actionManager;
	private DecisionEngine decisionEngine;

	public Behavior() {
		this(new ActionExecutor());
	}
	
	public Behavior(ActionExecutor actionExecutor) {
		this.actionExecutor = actionExecutor;
		this.actionManager = ActionManager.getDefault();
		this.goalManager = GoalManager.getDefault();
		this.decisionEngine = DecisionEngine.getDefault();
	}

	void performBehavior() {
		this.goalManager.defineGoals();

		AIAction bestAction = null;
		do {
			bestAction = this.getBestAction();
			if (bestAction != null) {
				this.executeAction(bestAction);
			}
			
		} while(!this.goalManager.hasSatisfiedAllGoals() && bestAction != null);
	}
	
	private AIAction getBestAction() {
		List<Goal> goals = this.goalManager.getGoals();
		List<AIAction> actions = this.actionManager.getActions();
		return this.decisionEngine.decideBestAction(goals, actions);
	}
	
	private void executeAction(AIAction action) {
		this.actionExecutor.execute(action);
		this.goalManager.updateGoalAlignedWith(action);
	}
}

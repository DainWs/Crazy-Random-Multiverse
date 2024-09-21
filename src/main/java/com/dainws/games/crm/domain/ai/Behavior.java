package com.dainws.games.crm.domain.ai;

import java.util.List;

import com.dainws.games.crm.domain.ai.goals.Goal;
import com.dainws.games.crm.domain.core.Game;

public class Behavior {
	private AIPlayer me;
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
	
	void setSelfAwareness(AIPlayer player) {
		this.me = player;
		this.goalManager.applySelfAwareness(this.me);
		this.actionManager.applySelfAwareness(this.me);
	}

	void performBehavior(Game game) {
		this.goalManager.defineGoals(game);
		this.actionManager.defineActions(game);
		this.decisionEngine.applySelfAwareness(game, this.me);

		AIAction bestAction;
		do {
			bestAction = this.getBestAction();
			
			if (bestAction != null) {
				this.executeAction(bestAction);
			}
		} while(bestAction != null);
	}
	
	private AIAction getBestAction() {
		List<Goal> goals = this.goalManager.getGoals();
		List<AIActionTemplate> actions = this.actionManager.getAvailableActions();
		AIAction bestAction = this.decisionEngine.decideBestAction(goals, actions);
		return bestAction;
	}
	
	private void executeAction(AIAction action) {
		this.actionExecutor.execute(action);
		this.goalManager.updateGoalAlignedWith(action);
	}
}

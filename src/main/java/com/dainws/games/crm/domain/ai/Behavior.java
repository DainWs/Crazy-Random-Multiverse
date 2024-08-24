package com.dainws.games.crm.domain.ai;

import java.util.List;
import java.util.Objects;

public class Behavior {
	private GoalManager goalManager;
	private ActionExecutor actionExecutor;
	private ActionManager actionManager;
	private DecisionEngine decisionEngine;

	private Behavior(Builder builder) {
		this.actionExecutor = builder.actionExecutor;
		this.actionManager = builder.actionManager;
		this.goalManager = builder.goalManager;
		this.decisionEngine = builder.decisionEngine;
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
	
	public static Builder builder() {
		return new Builder();
	}

	public static class Builder {
		private GoalManager goalManager;
		private ActionExecutor actionExecutor;
		private ActionManager actionManager;
		private DecisionEngine decisionEngine;
		
		public Builder withActionExecutor(ActionExecutor actionExecutor) {
			this.actionExecutor = actionExecutor;
			return this;
		}

		public Builder withActionManager(ActionManager actionManager) {
			this.actionManager = actionManager;
			return this;
		}

		public Builder withDecisionEngine(DecisionEngine decisionEngine) {
			this.decisionEngine = decisionEngine;
			return this;
		}

		public Builder withGoalManager(GoalManager goalManager) {
			this.goalManager = goalManager;
			return this;
		}

		public Behavior build() {
			Objects.requireNonNull(this.actionExecutor);
			Objects.requireNonNull(this.actionManager);
			Objects.requireNonNull(this.decisionEngine);
			Objects.requireNonNull(this.goalManager);
			return new Behavior(this);
		}
	}
}

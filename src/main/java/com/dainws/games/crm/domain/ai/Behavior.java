package com.dainws.games.crm.domain.ai;

import java.util.List;

import com.dainws.games.crm.domain.ai.goals.Goal;
import com.dainws.games.crm.domain.core.action.Action;
import com.dainws.games.crm.domain.core.action.ActionContext;
import com.dainws.games.crm.domain.core.action.PassTurnAction;

public class Behavior {
	private GoalManager goalManager;
	private DecisionEngine decisionEngine;
	private ActionManager actionManager;

	public Behavior() {
		this.actionManager = ActionManager.getDefault();
		this.goalManager = GoalManager.getDefault();
		this.decisionEngine = DecisionEngine.getDefault();
	}

	void performBehavior(AIContext context) {
		AIAction bestAction;
		do {
			this.goalManager.defineGoals(context);
			this.actionManager.defineActions(context);

			bestAction = this.getBestAction();

			if (bestAction != DecisionEngine.PASSTURN_ACTION) {
				this.executeAction(bestAction);
			}
		} while (this.shouldContinue(context, bestAction));

		this.passTurn(context);
	}

	private AIAction getBestAction() {
		List<Goal> goals = this.goalManager.getGoals();
		List<AIAction> actions = this.actionManager.getAvailableActions();
		AIAction bestAction = this.decisionEngine.decideBestAction(goals, actions);
		return bestAction;
	}

	private void executeAction(AIAction aiAction) {
		Action action = aiAction.getAction();
		ActionContext context = aiAction.getContext();

		boolean isSucess = action.perform(context);
		if (isSucess) {
			this.goalManager.updateGoalAlignedWith(aiAction);
		}
	}

	private boolean shouldContinue(AIContext context, AIAction bestAction) {
		if (bestAction == DecisionEngine.PASSTURN_ACTION) {
			return false;
		}

		return (context.getAlivePlayers().size() > 1);
	}

	private void passTurn(AIContext context) {
		PassTurnAction action = new PassTurnAction();
		action.perform(context.createMutableActionContext());
	}

	public void setActionManager(ActionManager actionManager) {
		this.actionManager = actionManager;
	}

	public void setDecisionEngine(DecisionEngine decisionEngine) {
		this.decisionEngine = decisionEngine;
	}

	public void setGoalManager(GoalManager goalManager) {
		this.goalManager = goalManager;
	}
}

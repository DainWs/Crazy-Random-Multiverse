package com.dainws.games.crm.domain.ai;

import java.util.List;

import com.dainws.games.crm.domain.ai.goals.Goal;
import com.dainws.games.crm.domain.core.action.Action;
import com.dainws.games.crm.domain.core.action.ActionContext;
import com.dainws.games.crm.domain.core.action.PassTurnAction;
import com.dainws.games.crm.domain.log.Logger;

public class Behavior {
	private Logger logger;
	private GoalManager goalManager;
	private DecisionEngine decisionEngine;
	private ActionManager actionManager;

	public Behavior() {
		this.logger = Logger.getLogger(getClass());
		this.actionManager = ActionManager.getDefault();
		this.goalManager = GoalManager.getDefault();
		this.decisionEngine = DecisionEngine.getDefault();
	}

	void performBehavior(AIContext context) {
		this.logger.debug("Performing AI behavior");
		
		AIAction bestAction;
		boolean actionWasSuccess;
		do {
			this.goalManager.defineGoals(context);
			this.actionManager.defineActions(context);

			bestAction = this.getBestAction();

			actionWasSuccess = false;
			if (bestAction != DecisionEngine.PASSTURN_ACTION) {
				actionWasSuccess = this.executeAction(bestAction);
			}

		} while (actionWasSuccess && context.getAlivePlayers().size() > 1);

		this.passTurn(context);
		this.logger.debug("AI Behavior performance ended");
	}

	private AIAction getBestAction() {
		List<Goal> goals = this.goalManager.getGoals();
		List<AIAction> actions = this.actionManager.getAvailableActions();
		AIAction bestAction = this.decisionEngine.decideBestAction(goals, actions);
		return bestAction;
	}

	private boolean executeAction(AIAction aiAction) {
		this.logger.debug("AI is performing one action of type {0}", aiAction.getActionType());
		Action action = aiAction.getAction();
		ActionContext context = aiAction.getContext();

		boolean isSucess = action.perform(context);
		if (isSucess) {
			this.goalManager.updateGoalAlignedWith(aiAction);
		}

		this.logger.debug("AI Behavior performed action was success?: {0}", isSucess);
		return isSucess;
	}

	private void passTurn(AIContext context) {
		this.logger.debug("AI decided to pass the turn");
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

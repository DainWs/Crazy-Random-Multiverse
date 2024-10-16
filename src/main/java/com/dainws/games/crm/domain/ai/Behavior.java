package com.dainws.games.crm.domain.ai;

import java.util.List;

import com.dainws.games.crm.domain.ai.goals.Goal;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.action.Action;
import com.dainws.games.crm.domain.core.action.ActionContext;
import com.dainws.games.crm.domain.core.action.MutableActionContext;
import com.dainws.games.crm.domain.core.action.PassTurnAction;
import com.dainws.games.crm.domain.core.player.PlayerActionExecutor;

public class Behavior {
	private AIPlayer me;
	private GoalManager goalManager;
	private DecisionEngine decisionEngine;
	private ActionManager actionManager;
	private PlayerActionExecutor actionExecutor;

	public Behavior() {
		this(new PlayerActionExecutor());
	}

	public Behavior(PlayerActionExecutor actionExecutor) {
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

			if (bestAction != DecisionEngine.PASSTURN_ACTION) {
				this.executeAction(bestAction);
			}
		} while (bestAction != DecisionEngine.PASSTURN_ACTION);
		
		this.passTurn(game);
	}

	private AIAction getBestAction() {
		List<Goal> goals = this.goalManager.getGoals();
		System.out.println(goals.size());
		List<AIActionTemplate> actions = this.actionManager.getAvailableActions();
		System.out.println(actions.size());
		AIAction bestAction = this.decisionEngine.decideBestAction(goals, actions);
		System.out.println(bestAction);
		return bestAction;
	}

	private void executeAction(AIAction aiAction) {
		Action action = aiAction.getAction();
		ActionContext context = aiAction.getContext();

		boolean isSucess = this.actionExecutor.execute(action, context);
		if (isSucess) {
			this.goalManager.updateGoalAlignedWith(aiAction);
		}
	}
	
	private void passTurn(Game game) {
		MutableActionContext actionContext = new MutableActionContext();
		actionContext.setGame(game);
		actionContext.setSourcePlayer(this.me);
		
		this.actionExecutor.execute(new PassTurnAction(), actionContext);
	}

	public void setActionExecutor(PlayerActionExecutor actionExecutor) {
		this.actionExecutor = actionExecutor;
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

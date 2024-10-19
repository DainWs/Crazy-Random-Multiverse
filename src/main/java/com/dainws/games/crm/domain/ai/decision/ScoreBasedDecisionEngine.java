package com.dainws.games.crm.domain.ai.decision;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import com.dainws.games.crm.domain.ai.AIAction;
import com.dainws.games.crm.domain.ai.AIActionTemplate;
import com.dainws.games.crm.domain.ai.AIPlayer;
import com.dainws.games.crm.domain.ai.DecisionEngine;
import com.dainws.games.crm.domain.ai.goals.Goal;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.action.Action;
import com.dainws.games.crm.domain.core.action.ActionContext;

public class ScoreBasedDecisionEngine implements DecisionEngine {
	private Game game;
	private AIPlayer me;
	private Map<Class<? extends Action>, ActionContext> cache;

	public ScoreBasedDecisionEngine() {
		this.cache = new HashMap<>();
	}

	@Override
	public void applySelfAwareness(Game game, AIPlayer meAsAPlayer) {
		this.game = game;
		this.me = meAsAPlayer;
	}

	@Override
	public AIAction decideBestAction(List<Goal> goals, List<AIActionTemplate> aiActionTemplates) {
		this.cache.clear();

		AIActionTemplate topAction = null;
		int topScore = 0;

		for (AIActionTemplate aiActionTemplate : aiActionTemplates) {
			int score = this.calculateActionScore(aiActionTemplate, goals);

			if (this.shouldChange(topScore, score)) {
				topAction = aiActionTemplate;
				topScore = score;
			}
		}

		if (topAction != null) {
			ActionContext context = this.cache.get(topAction.getActionType());
			return topAction.createAction(context);
		}

		return DecisionEngine.PASSTURN_ACTION;
	}

	private boolean shouldChange(int topScore, int score) {
		if (score == 0 && topScore == 0)
			return false;
		if (score < topScore)
			return false;
		if (score > topScore)
			return true;
		return new Random().nextBoolean();
	}

	private int calculateActionScore(AIActionTemplate action, List<Goal> goals) {
		int score = 0;

		for (Goal goal : goals) {
			if (this.shouldIncreaseScore(action, goal)) {
				score++;
			}
		}

		return score;
	}

	private boolean shouldIncreaseScore(AIActionTemplate action, Goal goal) {
		if (!action.alignedWith(goal)) {
			return false;
		}

		ActionContext context = this.createContext(action, goal);
		if (!action.canPerformWith(context)) {
			return false;
		}

		this.cache.put(action.getActionType(), context);
		return true;
	}

	private ActionContext createContext(AIActionTemplate action, Goal goal) {
		ContextDecisionEngineFactory factory = new ContextDecisionEngineFactory();
		ContextDecisionEngine engine = factory.createContextDecisionEngine(action);
		engine.applySelfAwareness(this.game, this.me);
		return engine.decideContextFor(action, goal);
	}
}

package com.dainws.games.crm.domain.ai.classic;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import com.dainws.games.crm.domain.ai.AIAction;
import com.dainws.games.crm.domain.ai.AIActionTemplate;
import com.dainws.games.crm.domain.ai.AIPlayer;
import com.dainws.games.crm.domain.ai.DecisionEngine;
import com.dainws.games.crm.domain.ai.decision.ContextDecisionEngine;
import com.dainws.games.crm.domain.ai.decision.ContextDecisionEngineFactory;
import com.dainws.games.crm.domain.ai.goals.Goal;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.action.Action;
import com.dainws.games.crm.domain.core.action.ActionContext;
import com.dainws.games.crm.domain.core.action.MutableActionContext;

public class ClassicDecisionEngine implements DecisionEngine {
	
	private Game game;
	private AIPlayer me;
	private Map<Class<? extends Action>, ActionContext> cache;

	public ClassicDecisionEngine() {
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
			System.out.println("Selected: ");
			System.out.println("a " + context.getGame());
			System.out.println("b " + context.getSourcePlayer());
			System.out.println("c " + context.getSourceCard());
			System.out.println("d " + context.getSourceCoordinate());
			System.out.println("e " + context.getTargetPlayer());
			System.out.println("f " + context.getTargetCard());
			System.out.println("g " + context.getTargetCoordinate());
			System.out.println();
			System.out.println();
			
			return topAction.createAction(context);			
		}
		return null;
	}

	private boolean shouldChange(int topScore, int score) {
		if (score == 0 && topScore == 0) return false;
		if (score < topScore) return false;
		if (score > topScore) return true;
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
		if (!action.alignedWith(goal)) return false;

		ContextDecisionEngineFactory factory = new ContextDecisionEngineFactory();
		ContextDecisionEngine engine = factory.createContextDecisionEngine(action);
		engine.applySelfAwareness(this.game, this.me);

		MutableActionContext context = this.createMutableActionContext();
		context.setTargetPlayer(engine.decideTargetPlayer(action, goal));
		context.setSourceCard(engine.decideSourceCard(action, goal));
		context.setTargetCard(engine.decideTargetCard(action, goal));
		context.setSourceCoordinate(engine.decideSourceCoordinate(action, goal));
		context.setTargetCoordinate(engine.decideTargetCoordinate(action, goal));

		if (action.canPerformWith(context)) {
			System.out.println("---------------------------------------");
			System.out.println("type " + action.getActionType());
			System.out.println("a " + context.getGame());
			System.out.println("b " + context.getSourcePlayer());
			System.out.println("c " + context.getSourceCard());
			System.out.println("d " + context.getSourceCoordinate());
			System.out.println("e " + context.getTargetPlayer());
			System.out.println("f " + context.getTargetCard());
			System.out.println("g " + context.getTargetCoordinate());
			System.out.println("---------------------------------------");
			this.cache.put(action.getActionType(), context);
			return true;
		}
		return false;
	}

	private MutableActionContext createMutableActionContext() {
		MutableActionContext context = new MutableActionContext();
		context.setGame(this.game);
		context.setSourcePlayer(this.me);
		return context;
	}
}

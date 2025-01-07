package com.dainws.games.crm.domain.ai.score;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.dainws.games.crm.domain.ai.AIAction;
import com.dainws.games.crm.domain.ai.DecisionEngine;
import com.dainws.games.crm.domain.ai.goals.Goal;
import com.dainws.games.crm.domain.core.action.Action;
import com.dainws.games.crm.domain.core.action.AttackAction;
import com.dainws.games.crm.domain.core.action.PutAction;
import com.dainws.games.crm.domain.log.Logger;

public class ScoreBasedDecisionEngine implements DecisionEngine {
	private static final int DEFAULT_SCORE = 10;

	private Logger logger;
	private Map<Class<? extends Action>, Score> relation;

	public ScoreBasedDecisionEngine() {
		this.logger = Logger.getLogger(getClass());
		this.relation = new HashMap<>();
		this.relation.put(PutAction.class, Score.of(1000));
		this.relation.put(AttackAction.class, Score.of(500));
	}

	public void setRelation(Class<? extends Action> actionType, Score score) {
		this.relation.put(actionType, score);
	}

	@Override
	public AIAction decideBestAction(List<Goal> goals, List<AIAction> actions) {
		this.logger.debug("Deciding best action for current goals in a score based way");
		AIAction topAction = DecisionEngine.PASSTURN_ACTION;
		Score topScore = new Score();

		for (AIAction currentAction : actions) {
			int alignedGoals = this.countAlignedGoals(goals, currentAction);

			Score currentScore = new Score();
			currentScore.increase(this.getActionBaseScore(currentAction));
			currentScore.increase(this.getAlignedGoalsScore(currentScore.value(), alignedGoals));

			if (alignedGoals > 0 && this.shouldChange(topScore, currentScore)) {
				topAction = currentAction;
				topScore = currentScore;
			}
		}

		this.logger.debug("The best action for current goals is {0}", topAction);
		return topAction;
	}

	private int countAlignedGoals(List<Goal> goals, AIAction action) {
		int counter = 0;

		for (Goal goal : goals) {
			if (action.alignedWith(goal)) {
				counter++;
			}
		}

		return counter;
	}

	private Score getActionBaseScore(AIAction action) {
		if (!this.relation.containsKey(action.getActionType())) {
			return Score.of(DEFAULT_SCORE);
		}
		
		return this.relation.get(action.getActionType());
	}

	private Score getAlignedGoalsScore(int readOnlyCurrentScore, int amountOfAlignedGoals) {
		Double increasePerGoal = readOnlyCurrentScore * 0.05;
		Double totalToIncrease = increasePerGoal * amountOfAlignedGoals;
		return Score.of(totalToIncrease.intValue());
	}

	private boolean shouldChange(Score topScore, Score score) {
		if (score.isZero() && topScore.isZero()) {
			return false;
		}

		if (score.isLowerThan(topScore)) {
			return false;
		}

		if (score.isBiggerThan(topScore)) {
			return true;
		}

		return true;
	}
}

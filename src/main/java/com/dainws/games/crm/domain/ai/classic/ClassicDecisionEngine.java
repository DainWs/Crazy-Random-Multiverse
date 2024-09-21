package com.dainws.games.crm.domain.ai.classic;

import java.util.List;
import java.util.Random;

import com.dainws.games.crm.domain.ai.AIAction;
import com.dainws.games.crm.domain.ai.DecisionEngine;
import com.dainws.games.crm.domain.ai.Goal;

public class ClassicDecisionEngine implements DecisionEngine {

	@Override
	public AIAction decideBestAction(List<Goal> goals, List<AIAction> aiActions) {
		AIAction topAction = null;
		int topScore = 0;

		for (AIAction aiAction : aiActions) {
			int score = this.calculateActionScore(topAction, goals);

			if (this.shouldChange(topScore, score)) {
				topAction = aiAction;
				topScore = score;
			}
		}

		return topAction;
	}
	
	private int calculateActionScore(AIAction action, List<Goal> goals) {
		int score = 0;
		
		for (Goal goal : goals) {
			if (action.alignedWith(goal)) {
				score++;
			}
		}
		
		return score;
	}

	private boolean shouldChange(int topScore, int score) {
		if (score == 0 && topScore == 0) return false;
		if (score < topScore) return false;
		if (score > topScore) return true;
		return new Random().nextBoolean();
	}
}

package com.dainws.games.crm.domain.ai;

import java.util.List;

import com.dainws.games.crm.domain.ai.goals.Goal;
import com.dainws.games.crm.domain.ai.score.ScoreBasedDecisionEngine;

public interface DecisionEngine {
	static final AIAction PASSTURN_ACTION = null;
	
	AIAction decideBestAction(List<Goal> goals, List<AIAction> aiActionTemplates);
	
	static DecisionEngine getDefault() {
		return new ScoreBasedDecisionEngine();
	}
}

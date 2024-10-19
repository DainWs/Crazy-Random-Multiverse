package com.dainws.games.crm.domain.ai;

import java.util.List;

import com.dainws.games.crm.domain.ai.decision.ScoreBasedDecisionEngine;
import com.dainws.games.crm.domain.ai.goals.Goal;
import com.dainws.games.crm.domain.core.Game;

public interface DecisionEngine {
	static final AIAction PASSTURN_ACTION = null;

	void applySelfAwareness(Game game, AIPlayer meAsAPlayer);
	
	AIAction decideBestAction(List<Goal> goals, List<AIActionTemplate> aiActionTemplates);
	
	static DecisionEngine getDefault() {
		return new ScoreBasedDecisionEngine();
	}
}

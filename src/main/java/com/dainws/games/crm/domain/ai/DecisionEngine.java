package com.dainws.games.crm.domain.ai;

import java.util.List;

import com.dainws.games.crm.domain.ai.goals.Goal;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.mode.pvsai.PvsAIDecisionEngine;

public interface DecisionEngine {
	static final AIAction PASSTURN_ACTION = null;

	void applySelfAwareness(Game game, AIPlayer meAsAPlayer);
	
	AIAction decideBestAction(List<Goal> goals, List<AIActionTemplate> aiActionTemplates);
	
	static DecisionEngine getDefault() {
		return new PvsAIDecisionEngine();
	}
}

package com.dainws.games.crm.domain.ai;

import java.util.List;

import com.dainws.games.crm.domain.ai.classic.ClassicDecisionEngine;

public interface DecisionEngine {
	AIAction decideBestAction(List<Goal> goals, List<AIAction> aiActions);
	
	static DecisionEngine getDefault() {
		return new ClassicDecisionEngine();
	}
}

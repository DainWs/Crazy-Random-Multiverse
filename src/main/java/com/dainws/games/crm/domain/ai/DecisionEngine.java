package com.dainws.games.crm.domain.ai;

import java.util.List;

public interface DecisionEngine {
	AIAction decideBestAction(List<Goal> goals, List<AIAction> aiActions);
}

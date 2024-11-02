package com.dainws.games.crm.domain.ai;

import java.util.List;

import com.dainws.games.crm.domain.ai.score.ScoreBasedActionManager;

public interface ActionManager {	
	void defineActions(AIContext context);

	List<AIAction> getAvailableActions();

	static ActionManager getDefault() {
		return new ScoreBasedActionManager();
	}
}

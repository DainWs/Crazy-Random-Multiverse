package com.dainws.games.crm.domain.ai;

import java.util.List;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.mode.pvsai.PvsAIActionManager;

public interface ActionManager {
	void applySelfAwareness(AIPlayer meAsAPlayer);
	
	void defineActions(Game game);

	List<AIActionTemplate> getAvailableActions();

	static ActionManager getDefault() {
		return new PvsAIActionManager();
	}
}

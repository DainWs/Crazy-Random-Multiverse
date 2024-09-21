package com.dainws.games.crm.domain.ai;

import java.util.List;

import com.dainws.games.crm.domain.ai.classic.ClassicActionManager;
import com.dainws.games.crm.domain.core.Game;

public interface ActionManager {
	void applySelfAwareness(AIPlayer meAsAPlayer);
	
	void defineActions(Game game);

	List<AIActionTemplate> getAvailableActions();

	static ActionManager getDefault() {
		return new ClassicActionManager();
	}
}

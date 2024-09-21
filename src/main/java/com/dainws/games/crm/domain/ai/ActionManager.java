package com.dainws.games.crm.domain.ai;

import java.util.List;

import com.dainws.games.crm.domain.ai.classic.ClassicActionManager;

public interface ActionManager {
	List<AIAction> getActions();

	static ActionManager getDefault() {
		return new ClassicActionManager();
	}
}

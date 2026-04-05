package com.dainws.games.crm.domain.mode;

import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.core.event.Event;

public interface GameModeEventDispatcher {

	GameMode getGameMode();
	
	void dispatch(Event event);
}

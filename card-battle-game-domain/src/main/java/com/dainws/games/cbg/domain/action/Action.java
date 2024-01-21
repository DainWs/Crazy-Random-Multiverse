package com.dainws.games.cbg.domain.action;

import com.dainws.games.cbg.domain.events.EventTrigger;
import com.dainws.games.cbg.domain.exception.PlayerActionException;

public interface Action extends EventTrigger {
	static final String LOGGER_NAME = "ActionLogger";
	
	void perform(ActionContext context) throws PlayerActionException;
}

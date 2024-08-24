package com.dainws.games.crm.domain.core.action;

import com.dainws.games.crm.domain.core.event.EventTrigger;
import com.dainws.games.crm.domain.exception.PlayerActionException;

public interface Action extends EventTrigger {
	static final String LOGGER_NAME = "ActionLogger";
	
	void perform(ActionContext context) throws PlayerActionException;
}

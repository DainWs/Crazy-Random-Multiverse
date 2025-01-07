package com.dainws.games.crm.domain.core.action;

public interface Action {
	static final String LOGGER_NAME = "com.dainws.ActionLogger";
	
	boolean perform(ActionContext context);
}

package com.dainws.games.crm.domain.core.action;

public interface ActionExecutor {

	boolean execute(Action action, ActionContextTemplate contextTemplate);

}

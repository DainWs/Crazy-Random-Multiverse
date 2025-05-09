package com.dainws.games.crm.domain.core.action;

public interface ActionMonitor {
	Action getExecutedAction(int index);
	
	ActionContext getExecutedActionContext(int index);
	
	boolean getExecutedActionResult(int index);
	
	boolean wasActionExecuted(Class<? extends Action> clazz);
	
	
}

package com.dainws.games.crm.tools.domain.core.action;

import com.dainws.games.crm.domain.core.action.Action;
import com.dainws.games.crm.domain.core.action.ActionContext;

public interface ActionMonitor {
	Action getExecutedAction(int index);
	
	ActionContext getExecutedActionContext(int index);
	
	boolean getExecutedActionResult(int index);
	
	boolean wasActionExecuted(Class<? extends Action> clazz);
	
	
}

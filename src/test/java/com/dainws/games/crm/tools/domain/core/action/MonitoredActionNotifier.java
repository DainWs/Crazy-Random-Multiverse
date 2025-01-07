package com.dainws.games.crm.tools.domain.core.action;

import com.dainws.games.crm.domain.core.action.Action;
import com.dainws.games.crm.domain.core.action.ActionContext;

public interface MonitoredActionNotifier {
	void performingAction(Action action, ActionContext context);
	
	void actionPerformed(Action action, ActionContext context, boolean result);
}

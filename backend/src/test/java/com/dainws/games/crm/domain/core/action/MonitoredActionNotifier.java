package com.dainws.games.crm.domain.core.action;

public interface MonitoredActionNotifier {
	void performingAction(Action action, ActionContext context);
	
	void actionPerformed(Action action, ActionContext context, boolean result);
}

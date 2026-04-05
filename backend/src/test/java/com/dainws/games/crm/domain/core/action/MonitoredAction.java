package com.dainws.games.crm.domain.core.action;

public class MonitoredAction implements Action {

	private Action action;
	private MonitoredActionNotifier actionNotifier;
	
	public MonitoredAction(MonitoredActionNotifier actionNotifier, Action action) {
		this.action = action;
		this.actionNotifier = actionNotifier;
	}
	
	@Override
	public boolean perform(ActionContext context) {
		this.actionNotifier.performingAction(this.action, context);
		boolean result = this.action.perform(context);
		this.actionNotifier.actionPerformed(this.action, context, result);
		return result;
	}

}

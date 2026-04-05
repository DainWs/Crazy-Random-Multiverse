package com.dainws.games.crm.domain.ai;

import java.util.List;

import com.dainws.games.crm.domain.core.action.Action;
import com.dainws.games.crm.domain.core.action.ActionContext;
import com.dainws.games.crm.domain.core.action.MonitoredAction;
import com.dainws.games.crm.domain.core.action.MonitoredActionNotifier;

public class MonitoredActionManager implements ActionManager {
	private ActionManager wrapper;
	private MonitoredActionNotifier actionNotifier;
	
	public MonitoredActionManager(MonitoredActionNotifier actionNotifier, ActionManager wrapper) {
		this.wrapper = wrapper;
		this.actionNotifier = actionNotifier;
	}

	@Override
	public void defineActions(AIContext context) {
		this.wrapper.defineActions(context);
	}

	@Override
	public List<AIAction> getAvailableActions() {
		List<AIAction> aiActions = this.wrapper.getAvailableActions();
		return aiActions.stream()
				.map(this::convertIntoMonitoredAction)
				.toList();
	}
	
	private AIAction convertIntoMonitoredAction(AIAction aiAction) {
		Action action = aiAction.getAction();
		ActionContext actionContext = aiAction.getContext();
		MonitoredAction monitoredAction = new MonitoredAction(this.actionNotifier, action);
		return new AIAction(monitoredAction, actionContext, aiAction.getTemplate());
	}
	
}

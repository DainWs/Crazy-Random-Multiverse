package com.dainws.games.crm.tools.domain.ai;

import java.util.ArrayList;
import java.util.function.Predicate;

import com.dainws.games.crm.domain.ai.ActionManager;
import com.dainws.games.crm.domain.ai.Behavior;
import com.dainws.games.crm.domain.core.action.Action;
import com.dainws.games.crm.domain.core.action.ActionContext;
import com.dainws.games.crm.tools.domain.core.action.ActionMonitor;
import com.dainws.games.crm.tools.domain.core.action.MonitoredActionNotifier;

public class BehaviorMonitor extends Behavior implements ActionMonitor, MonitoredActionNotifier {

	private ArrayList<Action> executedActions;
	private ArrayList<ActionContext> actionContexts;
	private ArrayList<Boolean> actionResults;
	
	public BehaviorMonitor() {
		super();
		this.setActionManager(ActionManager.getDefault());
		this.executedActions = new ArrayList<>();
		this.actionContexts = new ArrayList<>();
		this.actionResults = new ArrayList<>();
	}
	
	@Override
	public void setActionManager(ActionManager actionManager) {
		super.setActionManager(new MonitoredActionManager(this, actionManager));
	}

	@Override
	public void performingAction(Action action, ActionContext context) {
		int index = this.executedActions.size();
		this.executedActions.add(index, action);
		this.actionContexts.add(index, context);
	}

	@Override
	public void actionPerformed(Action action, ActionContext context, boolean result) {
		int index = this.executedActions.indexOf(action);
		this.actionResults.add(index, result);
	}

	@Override
	public Action getExecutedAction(int index) {
		return this.executedActions.get(index);
	}
	
	@Override
	public ActionContext getExecutedActionContext(int index) {
		return this.actionContexts.get(index);
	}
	
	@Override
	public boolean getExecutedActionResult(int index) {
		return this.actionResults.get(index);
	}
	
	
	@Override
	public boolean wasActionExecuted(Class<? extends Action> clazz) {
		return this.anyActionExecutedMatch(action -> action.getClass().equals(clazz));
	}
	
	
	
	
	public boolean anyActionExecutedMatch(Predicate<Action> predicate) {
		return this.executedActions.stream()
				.anyMatch(predicate);
	}
	
}

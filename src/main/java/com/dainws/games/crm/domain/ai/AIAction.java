package com.dainws.games.crm.domain.ai;

import com.dainws.games.crm.domain.ai.goals.Goal;
import com.dainws.games.crm.domain.core.action.Action;
import com.dainws.games.crm.domain.core.action.ActionContext;

public class AIAction {
	private Action action;
	private ActionContext context;
	private AIActionTemplate template;

	public AIAction(Action action, ActionContext context) {
		this.action = action;
		this.context = context;
	}

	public AIAction(Action action, ActionContext context, AIActionTemplate template) {
		this.action = action;
		this.context = context;
		this.template = template;
	}

	public Class<? extends Action> getActionType() {
		return this.action.getClass();
	}
	
	public boolean alignedWith(Goal goal) {
		return this.template.alignedWith(goal);
	}

	public boolean perform() {
		return this.action.perform(this.context);
	}

	public Action getAction() {
		return action;
	}

	public ActionContext getContext() {
		return context;
	}

	public AIActionTemplate getTemplate() {
		return template;
	}
}

package com.dainws.games.crm.domain.ai;

import com.dainws.games.crm.domain.core.action.Action;
import com.dainws.games.crm.domain.core.action.ActionContext;

public class AIAction {
	private Action action;
	private ActionContext context;

	public AIAction(Action action, ActionContext context) {
		this.action = action;
		this.context = context;
	}

	public Action getAction() {
		return action;
	}

	public ActionContext getContext() {
		return context;
	}
}

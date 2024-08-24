package com.dainws.games.crm.domain.ai;

import java.util.Collection;
import java.util.List;

import com.dainws.games.crm.domain.core.action.Action;
import com.dainws.games.crm.domain.core.action.ActionContext;

public class AIAction {
	private Action action;
	private ActionContext context;
	private Collection<Goal> goals;
	
	public AIAction(Action action, ActionContext context, Goal ...goals) {
		this(action, context, List.of(goals));
	}
	
	public AIAction(Action action, ActionContext context, Collection<Goal> goals) {
		this.action = action;
		this.context = context;
		this.goals = goals;
	}
	
	public boolean alignedWith(Goal goal) {
		return this.goals.contains(goal);
	}
	
	public Action getAction() {
		return action;
	}
	
	public ActionContext getContext() {
		return context;
	}
	
}

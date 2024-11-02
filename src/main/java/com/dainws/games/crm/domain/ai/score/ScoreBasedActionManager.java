package com.dainws.games.crm.domain.ai.score;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.dainws.games.crm.domain.ai.AIAction;
import com.dainws.games.crm.domain.ai.AIActionTemplate;
import com.dainws.games.crm.domain.ai.AIContext;
import com.dainws.games.crm.domain.ai.action.BaseActionManager;
import com.dainws.games.crm.domain.core.action.Action;
import com.dainws.games.crm.domain.core.action.ActionContext;
import com.dainws.games.crm.domain.core.action.AttackAction;
import com.dainws.games.crm.domain.core.action.PutAction;

public class ScoreBasedActionManager extends BaseActionManager {

	private Map<Class<? extends Action>, ActionContextFactory> actionContextFactories;

	public ScoreBasedActionManager() {
		this.actionContextFactories = new HashMap<>();
		this.actionContextFactories.put(AttackAction.class, new ScoreAttackContextFactory());
		this.actionContextFactories.put(PutAction.class, new ScorePutContextFactory());
	}

	public void setContextFactory(Class<? extends Action> actionType, ActionContextFactory factory) {
		this.actionContextFactories.put(actionType, factory);
	}

	@Override
	protected List<AIAction> defineAction(AIContext context, AIActionTemplate template) {
		if (!this.actionContextFactories.containsKey(template.getActionType())) {
			return List.of();
		}

		ActionContextFactory contextFactory = this.actionContextFactories.get(template.getActionType());
		ActionContext actionContext = contextFactory.decideContextFor(context, template);
		return List.of(template.createAction(actionContext));
	}
}

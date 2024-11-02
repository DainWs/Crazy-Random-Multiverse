package com.dainws.games.crm.domain.ai.action;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.crm.domain.ai.AIAction;
import com.dainws.games.crm.domain.ai.AIActionTemplate;
import com.dainws.games.crm.domain.ai.AIContext;
import com.dainws.games.crm.domain.ai.ActionManager;

public abstract class AbstractActionManager implements ActionManager {
	private List<AIAction> actions;

	@Override
	public final void defineActions(AIContext context) {
		List<AIActionTemplate> templates = this.defineActionTemplates(context);
		this.actions = new ArrayList<>();

		for (AIActionTemplate template : templates) {
			List<AIAction> actions = this.defineAction(context, template);
			this.actions.addAll(actions);
		}

		if (!context.isGameRunning()) {
			this.actions.clear();
		}
	}

	protected abstract List<AIActionTemplate> defineActionTemplates(AIContext context);

	protected abstract List<AIAction> defineAction(AIContext context, AIActionTemplate templates);

	@Override
	public final List<AIAction> getAvailableActions() {
		return this.actions;
	}
}

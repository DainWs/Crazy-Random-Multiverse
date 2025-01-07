package com.dainws.games.crm.domain.ai.action;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;

import com.dainws.games.crm.domain.ai.AIAction;
import com.dainws.games.crm.domain.ai.AIActionTemplate;
import com.dainws.games.crm.domain.ai.AIContext;
import com.dainws.games.crm.domain.ai.ActionManager;
import com.dainws.games.crm.domain.log.Logger;

public abstract class AbstractActionManager implements ActionManager {

	protected final Logger logger;
	private List<AIAction> actions;
	
	protected AbstractActionManager() {
		this.logger = Logger.getLogger(getClass());
	}

	@Override
	public final void defineActions(AIContext context) {
		this.logger.debug("Defining actions for AI Behavior");
		List<AIActionTemplate> templates = this.defineActionTemplates(context);
		this.actions = new ArrayList<>();

		for (AIActionTemplate template : templates) {
			List<AIAction> actions = this.defineAction(context, template);
			this.actions.addAll(actions);
		}

		this.actions.removeIf(Predicate.not(AIAction::canBePerformed));

		if (!context.isGameRunning()) {
			this.logger.debug("Game has already finished, clearing defined actions");
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

package com.dainws.games.crm.domain.ai.goals.conditions;

import com.dainws.games.crm.domain.ai.AIAction;
import com.dainws.games.crm.domain.ai.goals.GoalArchiveCondition;
import com.dainws.games.crm.domain.core.action.ActionContext;
import com.dainws.games.crm.domain.core.card.Card;

public class TargetCardDecorator extends ArchiveConditionDecorator {
	private Card target;

	public TargetCardDecorator(GoalArchiveCondition archiveCondition, Card target) {
		super(archiveCondition);
		this.target = target;
	}

	@Override
	public boolean test(AIAction aiAction) {
		if (!super.test(aiAction)) {
			return false;
		}

		ActionContext context = aiAction.getContext();
		return context.getTargetCard().equals(this.target);
	}
}

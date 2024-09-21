package com.dainws.games.crm.domain.ai.goals.conditions;

import com.dainws.games.crm.domain.ai.AIAction;
import com.dainws.games.crm.domain.ai.goals.GoalArchiveCondition;
import com.dainws.games.crm.domain.core.action.ActionContext;
import com.dainws.games.crm.domain.core.player.Player;

public class TargetPlayerDecorator extends ArchiveConditionDecorator {
	private Player target;

	public TargetPlayerDecorator(GoalArchiveCondition archiveCondition, Player target) {
		super(archiveCondition);
		this.target = target;
	}

	@Override
	public boolean test(AIAction aiAction) {
		if (!super.test(aiAction)) {
			return false;
		}

		ActionContext context = aiAction.getContext();
		return context.getTargetPlayer().equals(this.target);
	}
}

package com.dainws.games.crm.domain.ai.goals.conditions;

import com.dainws.games.crm.domain.ai.AIAction;
import com.dainws.games.crm.domain.ai.goals.GoalArchiveCondition;
import com.dainws.games.crm.domain.core.action.ActionContext;
import com.dainws.games.crm.domain.core.board.Coordinate;

public class TargetCoordinateDecorator extends ArchiveConditionDecorator {
	private Coordinate target;

	public TargetCoordinateDecorator(GoalArchiveCondition archiveCondition, Coordinate target) {
		super(archiveCondition);
		this.target = target;
	}

	@Override
	public boolean test(AIAction aiAction) {
		if (!super.test(aiAction)) {
			return false;
		}

		ActionContext context = aiAction.getContext();
		return context.getTargetCoordinate().equals(this.target);
	}
}

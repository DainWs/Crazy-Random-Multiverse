package com.dainws.games.crm.domain.ai.goals.conditions;

import com.dainws.games.crm.domain.ai.AIAction;
import com.dainws.games.crm.domain.ai.goals.GoalArchiveCondition;
import com.dainws.games.crm.domain.core.action.ActionContext;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.player.Player;

public class TargetPlayerIsDeadDecorator extends TargetPlayerDecorator {

	public TargetPlayerIsDeadDecorator(GoalArchiveCondition archiveCondition, Player target) {
		super(archiveCondition, target);
	}
	
	@Override
	public boolean test(AIAction aiAction) {
		if (!super.test(aiAction)) {
			return false;
		}
		
		ActionContext context = aiAction.getContext();
		Zone targetZone = context.getTargetZone();
		return !targetZone.isAlive();
	}

}

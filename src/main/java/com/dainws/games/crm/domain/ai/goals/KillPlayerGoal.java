package com.dainws.games.crm.domain.ai.goals;

import com.dainws.games.crm.domain.ai.AIAction;
import com.dainws.games.crm.domain.ai.Goal;
import com.dainws.games.crm.domain.core.action.ActionContext;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.player.Player;

public class KillPlayerGoal implements Goal {
	private Player target;
	private boolean archieved;

	public KillPlayerGoal(Player target) {
		this.target = target;
		this.archieved = false;
	}

	@Override
	public String getName() {
		return getNameOfGoalFor(this.target);
	}

	@Override
	public boolean isArchieved() {
		return this.archieved;
	}

	@Override
	public void updateGoal(AIAction action) {
		ActionContext actionContext = action.getContext();
		Board board = actionContext.getBoard();
		if (action.alignedWith(this) && !board.isZoneAlive(this.target.getPlayerCode())) {
			this.archieved = true;
		}
	}
	
	public static String getNameOfGoalFor(Player target) {
		return "KILL_PLAYER_%s".formatted(target.getCode());
	}
}

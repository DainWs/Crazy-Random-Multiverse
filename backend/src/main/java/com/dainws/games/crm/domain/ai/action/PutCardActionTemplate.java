package com.dainws.games.crm.domain.ai.action;

import com.dainws.games.crm.domain.ai.AIAction;
import com.dainws.games.crm.domain.ai.goals.BaseGoalNames;
import com.dainws.games.crm.domain.ai.goals.Goal;
import com.dainws.games.crm.domain.core.action.Action;
import com.dainws.games.crm.domain.core.action.ActionContext;
import com.dainws.games.crm.domain.core.action.PutAction;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.player.Hand;

public class PutCardActionTemplate extends NeutralActionTemplate {

	@Override
	public Class<? extends Action> getActionType() {
		return PutAction.class;
	}

	@Override
	public final boolean alignedWith(Goal goal) {
		return goal.getName().equals(BaseGoalNames.PUT_CARD);
	}

	@Override
	public boolean canPerformWith(ActionContext context) {
		boolean isSamePlayer = context.getSourcePlayer().equals(context.getTargetPlayer());
		if (!isSamePlayer) {
			return false;
		}

		Zone zone = context.getTargetZone();
		if (!zone.isAlive() || zone.isFilled()) {
			return false;
		}

		Hand hand = context.getSourcePlayer().getHand();
		if (hand.isEmpty()) {
			return false;
		}

		boolean noneSourceCard = (context.getSourceCard() == null);
		boolean noneTargetCard = (context.getTargetCard() == null);
		return (!noneSourceCard && !noneTargetCard);
	}

	@Override
	public AIAction createAction(ActionContext actionContext) {
		return new AIAction(new PutAction(), actionContext, this);
	}
}

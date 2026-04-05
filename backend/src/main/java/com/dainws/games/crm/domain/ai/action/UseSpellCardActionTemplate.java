package com.dainws.games.crm.domain.ai.action;

import com.dainws.games.crm.domain.ai.AIAction;
import com.dainws.games.crm.domain.ai.goals.BaseGoalNames;
import com.dainws.games.crm.domain.ai.goals.Goal;
import com.dainws.games.crm.domain.core.action.Action;
import com.dainws.games.crm.domain.core.action.ActionContext;
import com.dainws.games.crm.domain.core.action.UseSpellAction;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.player.Hand;

public class UseSpellCardActionTemplate extends NeutralActionTemplate {

	@Override
	public Class<? extends Action> getActionType() {
		return UseSpellAction.class;
	}

	@Override
	public boolean alignedWith(Goal goal) {
		return  goal.getName().equals(BaseGoalNames.USE_SPELL);
	}

	@Override
	public boolean canPerformWith(ActionContext context) {
		Hand hand = context.getSourcePlayer().getHand();
		if (hand.isEmpty()) {
			return false;
		}

		return hand.contains(CardType.SPELL);
	}

	@Override
	public AIAction createAction(ActionContext actionContext) {
		return new AIAction(new UseSpellAction(), actionContext, this);
	}

}

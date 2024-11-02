package com.dainws.games.crm.domain.ai;

import com.dainws.games.crm.domain.ai.action.ActionIntention;
import com.dainws.games.crm.domain.ai.goals.Goal;
import com.dainws.games.crm.domain.core.action.Action;
import com.dainws.games.crm.domain.core.action.ActionContext;

public interface AIActionTemplate {

	ActionIntention getIntention();

	boolean isIntention(ActionIntention intention);

	Class<? extends Action> getActionType();

	boolean alignedWith(Goal goal);

	boolean canPerformWith(ActionContext actionContext);

	AIAction createAction(ActionContext actionContext);
}

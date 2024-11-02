package com.dainws.games.crm.domain.ai.action;

import com.dainws.games.crm.domain.ai.AIActionTemplate;

public abstract class DefensiveActionTemplate implements AIActionTemplate {

	@Override
	public ActionIntention getIntention() {
		return BaseActionIntention.DEFENSIVE;
	}

	@Override
	public boolean isIntention(ActionIntention intention) {
		return BaseActionIntention.DEFENSIVE.equals(intention);
	}
}

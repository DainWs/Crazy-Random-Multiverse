package com.dainws.games.crm.domain.ai.action;

import com.dainws.games.crm.domain.ai.AIActionTemplate;

public abstract class NeutralActionTemplate implements AIActionTemplate {

	@Override
	public ActionIntention getIntention() {
		return BaseActionIntention.NEUTRAL;
	}

	@Override
	public boolean isIntention(ActionIntention intention) {
		return BaseActionIntention.NEUTRAL.equals(intention);
	}
}

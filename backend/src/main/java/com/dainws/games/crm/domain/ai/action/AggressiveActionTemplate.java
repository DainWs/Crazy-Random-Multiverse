package com.dainws.games.crm.domain.ai.action;

import com.dainws.games.crm.domain.ai.AIActionTemplate;

public abstract class AggressiveActionTemplate implements AIActionTemplate {

	@Override
	public ActionIntention getIntention() {
		return BaseActionIntention.AGGRESSIVE;
	}

	@Override
	public boolean isIntention(ActionIntention intention) {
		return BaseActionIntention.AGGRESSIVE.equals(intention);
	}
}

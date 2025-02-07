package com.dainws.games.crm.domain.mode.aivsai;

import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.mode.classic.ClassicEventDispatcher;

public class AIvsAIEventDispatcher extends ClassicEventDispatcher {

	public AIvsAIEventDispatcher() {
		super(new AIvsAIGameFlow());
	}
	
	@Override
	public GameMode getGameMode() {
		return AIvsAIGameStrategy.AIVSAI_MODE;
	}
	
}

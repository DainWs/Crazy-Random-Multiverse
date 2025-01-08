package com.dainws.games.crm.domain.mode.pvsai;

import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.mode.classic.ClassicEventDispatcher;

public class PvsAIEventDispatcher extends ClassicEventDispatcher {

	public PvsAIEventDispatcher() {
		super(new PvsAIGameFlow());
	}
	
	@Override
	public GameMode getGameMode() {
		return PvsAIGameStrategy.PVSAI_MODE;
	}
	
}
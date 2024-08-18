package com.dainws.games.crm.domain.core.ai;

public interface AIBehavior {
	static AIBehavior NONE = () -> {};
	
	void performBehavior();
}

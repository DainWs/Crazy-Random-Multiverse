package com.dainws.games.crm.domain.ai.goals;

public enum BaseGoalNames implements GoalName {
	NONE,
	PUT_CARD,
	USE_SPELL,
	ATTACK_PLAYER;
	
	@Override
	public String text() {
		return this.name();
	}
}

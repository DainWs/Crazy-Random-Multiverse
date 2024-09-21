package com.dainws.games.crm.domain.ai.goals;

public enum BaseGoalNames implements GoalName {
	PUT_CARD,
	ATTACK_PLAYER;
	
	@Override
	public String text() {
		return this.name();
	}
}

package com.dainws.games.crm.domain.core;

public enum StandardGameMode implements GameMode {
	CLASSIC, PLAYER_VS_AI;

	@Override
	public String text() {
		return this.name().toLowerCase();
	}
	
}

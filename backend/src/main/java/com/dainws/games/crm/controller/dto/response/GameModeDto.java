package com.dainws.games.crm.controller.dto.response;

import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.mode.GameModes;

public enum GameModeDto {
	CLASSIC(GameModes.CLASSIC);

	private GameMode domainGameMode;

	private GameModeDto(GameMode domainGameMode) {
		this.domainGameMode = domainGameMode;
	}

	public GameMode getDomainGameMode() {
		return domainGameMode;
	}
}

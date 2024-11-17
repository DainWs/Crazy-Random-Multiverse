package com.dainws.games.crm.controller.dto.domain;

import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.mode.GameModes;

public enum GameModeDto {
	CLASSIC(GameModes.CLASSIC),
	PLAYER_VS_AI(GameModes.PLAYER_VS_AI);

	private GameMode domainGameMode;

	private GameModeDto(GameMode domainGameMode) {
		this.domainGameMode = domainGameMode;
	}

	public GameMode getDomainGameMode() {
		return domainGameMode;
	}
}

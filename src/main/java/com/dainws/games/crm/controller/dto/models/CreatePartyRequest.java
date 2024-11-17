package com.dainws.games.crm.controller.dto.models;

import com.dainws.games.crm.controller.dto.domain.GameModeDto;

public class CreatePartyRequest {
	private GameModeDto gameMode; 
	private int maxPlayers;
	
	public CreatePartyRequest() {
		this.gameMode = GameModeDto.CLASSIC;
		this.maxPlayers = 4;
	}

	public GameModeDto getGameMode() {
		return gameMode;
	}

	public void setGameMode(GameModeDto gameMode) {
		this.gameMode = gameMode;
	}

	public int getMaxPlayers() {
		return maxPlayers;
	}

	public void setMaxPlayers(int maxPlayers) {
		this.maxPlayers = maxPlayers;
	}
}

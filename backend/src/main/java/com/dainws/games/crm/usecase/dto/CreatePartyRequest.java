package com.dainws.games.crm.usecase.dto;

import com.dainws.games.crm.controller.dto.response.GameModeDto;

public class CreatePartyRequest {
	private GameModeDto gameMode; 
	private int maxUsers;
	
	public CreatePartyRequest() {
		this.gameMode = GameModeDto.CLASSIC;
		this.maxUsers = 4;
	}

	public GameModeDto getGameMode() {
		return gameMode;
	}

	public void setGameMode(GameModeDto gameMode) {
		this.gameMode = gameMode;
	}

	public int getMaxUsers() {
		return maxUsers;
	}

	public void setMaxUsers(int maxUsers) {
		this.maxUsers = maxUsers;
	}
}

package com.dainws.games.crm.usecase.dto;

import com.dainws.games.crm.controller.dto.response.GameModeDto;

public class UpdatePartyRequest {
	private Integer maxUsers;
	private GameModeDto gameMode;
	
	public UpdatePartyRequest() {
	}

	public GameModeDto getGameMode() {
		return gameMode;
	}

	public void setGameMode(GameModeDto gameMode) {
		this.gameMode = gameMode;
	}

	public Integer getMaxUsers() {
		return maxUsers;
	}

	public void setMaxUsers(Integer maxUsers) {
		this.maxUsers = maxUsers;
	}
}

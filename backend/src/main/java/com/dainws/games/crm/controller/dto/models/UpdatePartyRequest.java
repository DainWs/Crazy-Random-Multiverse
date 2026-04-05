package com.dainws.games.crm.controller.dto.models;

import com.dainws.games.crm.controller.dto.domain.GameModeDto;

public class UpdatePartyRequest {
	private String code;
	private Integer maxPlayers;
	private GameModeDto gameMode;
	
	public UpdatePartyRequest() {
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public GameModeDto getGameMode() {
		return gameMode;
	}

	public void setGameMode(GameModeDto gameMode) {
		this.gameMode = gameMode;
	}

	public Integer getMaxPlayers() {
		return maxPlayers;
	}

	public void setMaxPlayers(Integer maxPlayers) {
		this.maxPlayers = maxPlayers;
	}
}

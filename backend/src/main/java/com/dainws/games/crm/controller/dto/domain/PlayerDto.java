package com.dainws.games.crm.controller.dto.domain;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PlayerDto {
	@JsonProperty("code")
	private String code;

	@JsonProperty("name")
	private String name;

	@JsonProperty("isSpectator")
	private boolean spectator;
	
	@JsonProperty("isAlive")
	private boolean alive;

	public void setCode(String code) {
		this.code = code;
	}

	public String getCode() {
		return code;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}
	
	public void setSpectator(boolean spectator) {
		this.spectator = spectator;
	}
	
	public boolean isSpectator() {
		return spectator;
	}
	
	public void setAlive(boolean alive) {
		this.alive = alive;
	}
	
	public boolean isAlive() {
		return alive;
	}
}

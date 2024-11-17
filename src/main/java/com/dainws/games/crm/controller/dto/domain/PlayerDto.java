package com.dainws.games.crm.controller.dto.domain;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PlayerDto {
	@JsonProperty("code")
	private String code;

	@JsonProperty("name")
	private String name;

	@JsonProperty("isSpectator")
	private boolean isSpectator;
	
	@JsonProperty("isAlive")
	private boolean isAlive;	

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
	
	public void setSpectator(boolean isSpectator) {
		this.isSpectator = isSpectator;
	}
	
	public boolean isSpectator() {
		return isSpectator;
	}
	
	public void setAlive(boolean isAlive) {
		this.isAlive = isAlive;
	}
	
	public boolean isAlive() {
		return isAlive;
	}
}

package com.dainws.games.crm.stomp.dto.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PlayerDto {
	@JsonProperty("code")
	private String code;

	@JsonProperty("name")
	private String name;

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
}

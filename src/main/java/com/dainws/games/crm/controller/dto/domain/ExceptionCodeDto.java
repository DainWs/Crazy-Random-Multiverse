package com.dainws.games.crm.controller.dto.domain;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ExceptionCodeDto {
	@JsonProperty(value = "key")
	private String key;
	
	public ExceptionCodeDto(String key) {
		this.key = key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String getKey() {
		return key;
	}
}

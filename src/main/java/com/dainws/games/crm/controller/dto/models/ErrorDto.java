package com.dainws.games.crm.controller.dto.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ErrorDto {
	@JsonProperty(value = "key")
	private String key;

	@JsonProperty(value = "value")
	private String value;
	
	public void setKey(String key) {
		this.key = key;
	}
	
	public String getKey() {
		return key;
	}
	
	public void setValue(String value) {
		this.value = value;
	}
	
	public String getValue() {
		return value;
	}
}

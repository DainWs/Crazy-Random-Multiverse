package com.dainws.games.crm.stomp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ErrorDto {
	@JsonProperty(value = "key")
	private String key;

	@JsonProperty(value = "value")
	private String value;

	@JsonProperty(value = "language")
	private String language;
	
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
	
	public void setLanguage(String language) {
		this.language = language;
	}
	
	public String getLanguage() {
		return language;
	}
}

package com.dainws.games.crm.controller.dto.domain;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserDto {
	
	@JsonProperty(value = "id", required = false)
	private String id;

	@JsonProperty(value = "username", required = true)
	private String username;

	public void setId(String uid) {
		this.id = uid;
	}

	public String getId() {
		return id;
	}
	
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

}

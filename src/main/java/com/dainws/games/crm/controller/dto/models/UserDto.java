package com.dainws.games.crm.controller.dto.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserDto {
	
	@JsonProperty(value = "uid", required = false)
	private String uid;

	@JsonProperty(value = "username", required = true)
	private String username;

	public void setUid(String uid) {
		this.uid = uid;
	}

	public String getUid() {
		return uid;
	}
	
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

}

package com.dainws.games.crm.stomp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserInfoResponse {
	@JsonProperty("uid")
	private String uid;
	
	@JsonProperty("username")
	private String username;

	public void setUid(String uid) {
		this.uid = uid;
	}

	public String getUid() {
		return uid;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getUsername() {
		return username;
	}
}

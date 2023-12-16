package com.dainws.games.crm.stomp.dto;

public class UserInfoResponse {
	private String sessionId;
	private String username;

	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}

	public String getSessionId() {
		return sessionId;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getUsername() {
		return username;
	}
}

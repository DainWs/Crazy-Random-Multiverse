package com.dainws.games.crm.domain.core.exception;

public class GameExceptionCode {
	private String value;
	
	public GameExceptionCode(String value) {
		this.value = "exception." + value;
	}

	public String value() {
		return value;
	}
}

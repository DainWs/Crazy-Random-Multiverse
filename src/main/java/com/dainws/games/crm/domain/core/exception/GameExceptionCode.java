package com.dainws.games.crm.domain.core.exception;

public class GameExceptionCode {
	private String value;

	public GameExceptionCode(String value) {
		this.value = "exception." + value;

		if (value.startsWith("exception.")) {
			this.value = value;
		}
	}

	public String value() {
		return value;
	}
	
	@Override
	public String toString() {
		return this.value;
	}
}

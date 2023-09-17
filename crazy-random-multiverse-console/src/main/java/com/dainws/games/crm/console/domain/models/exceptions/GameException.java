package com.dainws.games.crm.console.domain.models.exceptions;

public class GameException extends Exception {

	private static final long serialVersionUID = -4307082110643822954L;

	public GameException(String message) {
		super(message);
	}
	
	public GameException(Throwable throwable) {
		super(throwable);
	}
	
	public GameException(String message, Throwable throwable) {
		super(message, throwable);
	}
}

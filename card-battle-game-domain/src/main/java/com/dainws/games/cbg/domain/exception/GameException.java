package com.dainws.games.cbg.domain.exception;

public class GameException extends Exception {

	private static final long serialVersionUID = -2063427620165885793L;

	public GameException(String message) {
		super(message);
	}

	public GameException(Throwable throwable) {
		super(throwable);
	}
	
	public GameException(String message, Throwable cause) {
		super(message, cause);
	}
}

package com.dainws.games.cbg.domain.exception;

public class GameRuntimeException extends RuntimeException {

	private static final long serialVersionUID = -8674843047120348147L;

	public GameRuntimeException(String message) {
		super(message);
	}
	
	public GameRuntimeException(Throwable throwable) {
		super(throwable);
	}
	
	public GameRuntimeException(String message, Throwable throwable) {
		super(message, throwable);
	}
}

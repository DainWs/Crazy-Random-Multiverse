package com.dainws.games.cbg.domain.exception;

public class PlayerActionException extends GameException {

	private static final long serialVersionUID = -1029563058707798026L;

	public PlayerActionException(GameException gameException) {
		super(gameException.getKey(), gameException);
	}
	
	public PlayerActionException(String messageKey) {
		super(messageKey);
	}
	
	public PlayerActionException(String messageKey, Throwable throwable) {
		super(messageKey, throwable);
	}
}

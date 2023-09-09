package com.dainws.games.cbg.domain.player.exception;

import com.dainws.games.cbg.domain.exception.GameRuntimeException;

public class PlayerActionException extends GameRuntimeException {

	private static final long serialVersionUID = -1029563058707798026L;

	public PlayerActionException(String message) {
		super(message);
	}

	public PlayerActionException(Throwable throwable) {
		super(throwable);
	}

	public PlayerActionException(String message, Throwable throwable) {
		super(message, throwable);
	}
}

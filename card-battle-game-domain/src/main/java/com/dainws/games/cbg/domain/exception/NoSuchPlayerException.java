package com.dainws.games.cbg.domain.exception;

public class NoSuchPlayerException extends GameRuntimeException {

	private static final long serialVersionUID = 3566265867557100109L;

	public NoSuchPlayerException(String message) {
		super(message);
	}
}

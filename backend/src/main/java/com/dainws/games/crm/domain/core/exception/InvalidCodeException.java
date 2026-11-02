package com.dainws.games.crm.domain.core.exception;

public class InvalidCodeException extends RuntimeException {
	private static final long serialVersionUID = 6310457741822890453L;

	public InvalidCodeException(Throwable throwable) {
		super(throwable);
	}
}

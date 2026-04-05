package com.dainws.games.crm.domain.core.exception;

public class NotAllowedException extends GameException {

	private static final long serialVersionUID = -3976807989940833143L;

	public NotAllowedException(String code) {
		super(new ExceptionCode(code));
	}
	
	public NotAllowedException(ExceptionCode code) {
		super(code);
	}

	public NotAllowedException(ExceptionCode code, Throwable throwable) {
		super(code, throwable);
	}
}

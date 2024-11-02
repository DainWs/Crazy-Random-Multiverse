package com.dainws.games.crm.domain.core.exception;

public class OperationNotAllowedException extends GameException {

	private static final long serialVersionUID = -3976807989940833143L;

	public OperationNotAllowedException(String code) {
		super(new GameExceptionCode(code));
	}
	
	public OperationNotAllowedException(GameExceptionCode code) {
		super(code);
	}

	public OperationNotAllowedException(GameExceptionCode code, Throwable throwable) {
		super(code, throwable);
	}
}

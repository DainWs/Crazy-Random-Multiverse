package com.dainws.games.crm.domain.core.exception;

public abstract class GameException extends Exception {

	private static final long serialVersionUID = -2063427620165885793L;

	private ExceptionCode code;
	
	protected GameException(ExceptionCode code) {
		this.code = code;
	}

	protected GameException(ExceptionCode code, Throwable throwable) {
		super(throwable);
		this.code = code;
	}

	public ExceptionCode getCode() {
		return code;
	}
	
	public String getCodeValue() {
		return code.value();
	}
}

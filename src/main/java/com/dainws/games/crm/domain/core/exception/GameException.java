package com.dainws.games.crm.domain.core.exception;

public abstract class GameException extends Exception {

	private static final long serialVersionUID = -2063427620165885793L;

	private GameExceptionCode code;
	
	protected GameException(GameExceptionCode code) {
		this.code = code;
	}

	protected GameException(GameExceptionCode code, Throwable throwable) {
		super(throwable);
		this.code = code;
	}

	public GameExceptionCode getCode() {
		return code;
	}
	
	public String getCodeValue() {
		return code.value();
	}
}

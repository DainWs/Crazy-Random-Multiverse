package com.dainws.games.crm.domain.core.exception;

public abstract class GameRuntimeException extends RuntimeException {

	private static final long serialVersionUID = -8674843047120348147L;

	private ExceptionCode code;

	protected GameRuntimeException(ExceptionCode code) {
		this.code = code;
	}

	protected GameRuntimeException(ExceptionCode code, Throwable throwable) {
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

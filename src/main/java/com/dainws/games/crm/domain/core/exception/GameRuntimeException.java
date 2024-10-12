package com.dainws.games.crm.domain.core.exception;

public abstract class GameRuntimeException extends RuntimeException {

	private static final long serialVersionUID = -8674843047120348147L;

	private GameExceptionCode code;

	protected GameRuntimeException(GameExceptionCode code) {
		this.code = code;
	}

	protected GameRuntimeException(GameExceptionCode code, Throwable throwable) {
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

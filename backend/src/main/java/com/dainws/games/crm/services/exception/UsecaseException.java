package com.dainws.games.crm.services.exception;

import com.dainws.games.crm.domain.core.exception.ExceptionCode;

public abstract class UsecaseException extends RuntimeException {

	private static final long serialVersionUID = -4015434814689096764L;

	private ExceptionCode code;
	
	protected UsecaseException(ExceptionCode code) {
		this.code = code;
	}

	protected UsecaseException(ExceptionCode code, Throwable throwable) {
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

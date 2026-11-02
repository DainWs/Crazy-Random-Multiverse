package com.dainws.games.crm.domain.core.exception;

public class MalformedRequestException extends GameRuntimeException {
	private static final long serialVersionUID = 4172903648115529076L;

	public MalformedRequestException(Throwable throwable) {
		super(RequestExceptionCode.MALFORMED, throwable);
	}
}

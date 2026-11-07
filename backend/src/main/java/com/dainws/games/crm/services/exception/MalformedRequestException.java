package com.dainws.games.crm.services.exception;

import com.dainws.games.crm.domain.core.exception.ExceptionCode;

public class MalformedRequestException extends UsecaseException {

	private static final long serialVersionUID = 2418830577116094331L;

	public MalformedRequestException() {
		super(new ExceptionCode("request.malformed"));
	}
}

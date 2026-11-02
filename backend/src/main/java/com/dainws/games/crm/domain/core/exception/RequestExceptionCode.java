package com.dainws.games.crm.domain.core.exception;

public class RequestExceptionCode extends ExceptionCode {

	public static final ExceptionCode MALFORMED = new RequestExceptionCode("malformed");

	public RequestExceptionCode(String value) {
		super("request." + value);
	}

}

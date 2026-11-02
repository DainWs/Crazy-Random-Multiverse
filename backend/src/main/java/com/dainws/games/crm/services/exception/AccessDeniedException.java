package com.dainws.games.crm.services.exception;

import com.dainws.games.crm.domain.core.exception.ExceptionCode;

public class AccessDeniedException extends UsecaseException {

	private static final long serialVersionUID = 6371254810392754123L;

	public AccessDeniedException(String messageId) {
		this(new ExceptionCode("access_denied." + messageId));
	}

	public AccessDeniedException(ExceptionCode code) {
		super(code);
	}

	public static AccessDeniedException wrongGame() {
		return new AccessDeniedException("wrong_game");
	}

	public static AccessDeniedException identityMismatch() {
		return new AccessDeniedException("identity_mismatch");
	}
}

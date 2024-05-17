package com.dainws.games.crm.domain.exception;

import com.dainws.games.crm.domain.translator.TranslatableKey;

public class CoordinateNotAllowedException extends GameRuntimeException {

	private static final long serialVersionUID = -3976807989940833143L;

	public CoordinateNotAllowedException(String messageKey) {
		super(new TranslatableKey(messageKey));
	}

	public CoordinateNotAllowedException(String messageKey, String message) {
		super(new TranslatableKey(messageKey), message);
	}

	public CoordinateNotAllowedException(String messageKey, Throwable throwable) {
		super(new TranslatableKey(messageKey), throwable);
	}

	public CoordinateNotAllowedException(String messageKey, String message, Throwable throwable) {
		super(new TranslatableKey(messageKey), message, throwable);
	}
}

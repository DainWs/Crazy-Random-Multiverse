package com.dainws.games.cbg.domain.exception;

import com.dainws.games.cbg.domain.translator.TranslatableKey;

public class NotEmptyCoordinateException extends GameRuntimeException {

	private static final long serialVersionUID = 3971393193720667639L;

	public NotEmptyCoordinateException() {
		super(new TranslatableKey("EXCEPTION_NOT_EMPTY_COORDINATE"));
	}
}

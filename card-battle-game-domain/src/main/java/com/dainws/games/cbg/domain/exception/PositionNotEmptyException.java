package com.dainws.games.cbg.domain.exception;

import com.dainws.games.cbg.domain.translator.TranslatableKey;

public class PositionNotEmptyException extends GameRuntimeException {

	private static final long serialVersionUID = 3971393193720667639L;

	public PositionNotEmptyException() {
		super(new TranslatableKey("EXCEPTION_POSITION_IS_ALREADY_OCCUPIED"));
	}
}

package com.dainws.games.crm.domain.exception;

import com.dainws.games.crm.domain.translator.TranslatableKey;

public class CoordinateOutOfBoundsException extends GameRuntimeException {

	private static final long serialVersionUID = -1313695002882278013L;

	public CoordinateOutOfBoundsException() {
		super(new TranslatableKey("EXCEPTION_COORDINATE_OUT_OF_BOUNDS"));
	}

}

package com.dainws.games.cbg.domain.exception;

import com.dainws.games.cbg.domain.translator.TranslatableKey;

public class EmptyCoordinateException extends GameRuntimeException {

	private static final long serialVersionUID = -3879094334120187296L;

	public EmptyCoordinateException() {
		super(new TranslatableKey("EXCEPTION_NONE_COMBATANT_IN_COORDINATE"));
	}

}

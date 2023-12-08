package com.dainws.games.cbg.domain.exception;

import com.dainws.games.cbg.domain.translator.TranslatableKey;

public class PositionEmptyException extends GameRuntimeException {

	private static final long serialVersionUID = -3879094334120187296L;

	public PositionEmptyException() {
		super(new TranslatableKey("EXCEPTION_NONE_COMBATANT_IN_POSITION"));
	}

}

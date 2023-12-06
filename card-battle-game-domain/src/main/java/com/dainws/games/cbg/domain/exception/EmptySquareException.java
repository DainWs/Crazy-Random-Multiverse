package com.dainws.games.cbg.domain.exception;

import com.dainws.games.cbg.domain.translator.TranslatableKey;

public class EmptySquareException extends GameRuntimeException {

	private static final long serialVersionUID = -3879094334120187296L;

	public EmptySquareException() {
		super(new TranslatableKey("NONE_COMBATANT_IN_SQUARE"), "No se ha encontrado ningun combatiente en esta casilla");
	}

}

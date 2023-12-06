package com.dainws.games.cbg.domain.exception;

import com.dainws.games.cbg.domain.translator.TranslatableKey;

public class NotEmptyPositionException extends GameRuntimeException {

	private static final long serialVersionUID = 3971393193720667639L;

	public NotEmptyPositionException() {
		super(new TranslatableKey("SQUARE_IS_ALREADY_OCCUPIED"), "La casilla ya se encuentra ocupada por un combatiente");
	}
}

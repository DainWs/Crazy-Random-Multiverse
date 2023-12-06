package com.dainws.games.cbg.domain.exception;

import com.dainws.games.cbg.domain.text.TextKey;

public class OccupiedSquareException extends GameException {

	private static final long serialVersionUID = 3971393193720667639L;

	public OccupiedSquareException() {
		super(new TextKey("SQUARE_IS_ALREADY_OCCUPIED"), "La casilla ya se encuentra ocupada por un combatiente");
	}
}

package com.dainws.games.cbg.domain.exception;

public class EmptySquareException extends GameException {

	private static final long serialVersionUID = -3879094334120187296L;

	public EmptySquareException() {
		super("NONE_COMBATANT_IN_SQUARE", "No se ha encontrado ningun combatiente en esta casilla");
	}

}

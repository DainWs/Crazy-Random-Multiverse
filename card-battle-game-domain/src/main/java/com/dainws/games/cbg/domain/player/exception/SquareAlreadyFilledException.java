package com.dainws.games.cbg.domain.player.exception;

import com.dainws.games.cbg.domain.exception.GameRuntimeException;

public class SquareAlreadyFilledException extends GameRuntimeException {

	private static final long serialVersionUID = 3971393193720667639L;

	public SquareAlreadyFilledException() {
		super("This Square is already filled.");
	}
}

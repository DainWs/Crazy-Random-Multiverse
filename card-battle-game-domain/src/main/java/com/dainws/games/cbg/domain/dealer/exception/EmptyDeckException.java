package com.dainws.games.cbg.domain.dealer.exception;

import com.dainws.games.cbg.domain.exception.GameRuntimeException;

public class EmptyDeckException extends GameRuntimeException {

	private static final long serialVersionUID = -9006209164621867019L;

	public EmptyDeckException() {
		super("The deck requires at least 1 card");
	}
}
